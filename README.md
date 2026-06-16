# API « Atelier » (Bun + Hono + MySQL)

API REST qui sert les données du front [`project-react`](../project-react) et
reçoit les messages du formulaire de contact.

## Stack
- [Bun](https://bun.sh) — runtime & gestionnaire de paquets
- [Hono](https://hono.dev) — framework HTTP
- MySQL 9 via [`mysql2`](https://github.com/sidorares/node-mysql2)

## Endpoints

| Méthode | Route           | Description                    |
|---------|-----------------|--------------------------------|
| GET     | `/api/health`   | Healthcheck                    |
| GET     | `/api/team`     | Membres de l'équipe            |
| GET     | `/api/services` | Services                       |
| GET     | `/api/projects` | Travaux                        |
| GET     | `/api/faq`      | Questions fréquentes           |
| POST    | `/api/contact`  | Envoi d'un message de contact  |
| GET     | `/api/contact`  | Liste des messages reçus       |

### `POST /api/contact`
```json
{ "nom": "Jean", "email": "jean@example.com", "message": "Bonjour !" }
```
Réponses : `201 { "success": true, "id": 1 }` ou `400 { "error": "..." }`.

## Démarrage

### Tout en Docker (API + MySQL)
```bash
docker compose up --build
```
L'API écoute sur `http://localhost:3000`, MySQL sur `3306`. Les tables sont
créées et seedées automatiquement au premier démarrage.

### En local (Bun) avec MySQL en conteneur
```bash
bun install
docker compose up -d db          # lance uniquement MySQL
cp .env.example .env             # ajuste si besoin
bun run dev                      # API avec rechargement à chaud
```

## Tests
```bash
bun test
```
Les tests utilisent un `InMemoryRepository` : ils sont déterministes et ne
nécessitent **aucune** base de données en marche.

## Architecture
- `index.ts` — point d'entrée : initialise le pool MySQL puis sert l'app Hono.
- `src/app.ts` — `createApp(repo)` construit l'app à partir d'un `Repository`
  injecté (même logique en prod et en test).
- `src/repositories/` — interface `Repository`, implémentations `mysql` (prod)
  et `memory` (tests).
- `src/db.ts` — pool mysql2, création du schéma, seed.
- `src/data/seed.ts` — données initiales (identiques au front).

## Câblage du front
Le front (`project-react`) consomme l'API via un proxy Vite (`/api` →
`http://localhost:3000`). Voir son `vite.config.js` et `src/api.js`.
