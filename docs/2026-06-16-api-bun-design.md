# API Bun pour le front « Atelier » — Design

Date : 2026-06-16

## Objectif
Fournir une API REST (Bun + Hono + TypeScript, MySQL 9) qui sert les données
aujourd'hui codées en dur dans le front React `project-react`, et qui reçoit les
messages du formulaire de contact. Le front est ensuite câblé pour consommer
cette API.

## Stack
- **Runtime** : Bun 1.x (image `oven/bun`)
- **Framework HTTP** : Hono
- **Base de données** : MySQL 9 (dernière version), via `mysql2/promise`
- **Tests** : `bun test`

## Architecture
```
project-api-react/
├── index.ts                # entrée : init DB + Bun.serve
├── compose.yaml            # MySQL 9 + service API
├── Dockerfile              # image oven/bun (multi-stage)
├── package.json
├── tsconfig.json
├── .env.example
├── src/
│   ├── config.ts           # lecture des variables d'env
│   ├── app.ts              # createApp(repo) -> instance Hono
│   ├── db.ts               # pool mysql2 + schéma + seed
│   ├── data/seed.ts        # données initiales (équipe, services, travaux, faq)
│   └── repositories/
│       ├── types.ts        # interface Repository + types entités
│       ├── memory.ts       # InMemoryRepository (tests)
│       └── mysql.ts        # MysqlRepository (prod)
└── tests/                  # un fichier par ressource
```

### Couche Repository injectable
`createApp(repo)` reçoit un `Repository`. La logique des routes (validation,
codes HTTP, formes de réponse) est identique quel que soit le backend de
données. En prod on injecte `MysqlRepository`, en test `InMemoryRepository`
(seedé). Les tests passent sans MySQL en marche, et n'ouvrent pas de connexion
au moment de l'import (la connexion mysql2 est paresseuse, créée seulement dans
`index.ts`).

## Endpoints
| Méthode | Route           | Réponse                                              |
|---------|-----------------|------------------------------------------------------|
| GET     | `/api/health`   | `{ status: "ok" }`                                   |
| GET     | `/api/team`     | `[{ id, nom, role, initiales }]`                     |
| GET     | `/api/services` | `[{ id, no, title, text }]`                          |
| GET     | `/api/projects` | `[{ id, tag, title, text }]`                         |
| GET     | `/api/faq`      | `[{ id, q, a }]`                                     |
| POST    | `/api/contact`  | `201 { success: true, id }` ou `400 { error }`       |
| GET     | `/api/contact`  | `[{ id, nom, email, message, created_at }]`          |

CORS activé pour permettre l'appel depuis le front en dev.

### Validation `POST /api/contact`
- `nom` : chaîne non vide
- `email` : chaîne non vide au format email
- `message` : chaîne non vide
Sinon `400 { error: "..." }`.

## Schéma MySQL
Tables : `team_members`, `services`, `projects`, `faq`, `contact_messages`.
Créées avec `CREATE TABLE IF NOT EXISTS`. Les tables de référence sont seedées
au démarrage si vides (données identiques au front).

## Câblage frontend (`project-react`)
- `vite.config.js` : proxy `/api` -> `http://localhost:3000`
- `src/api.js` : helpers `fetchJson` + fonctions par ressource
- Pages `Equipe`, `Services`, `Travaux`, `FAQ` : chargement via `useEffect` avec
  états de chargement / erreur (fallback sur tableau vide)
- `Contact` : `POST /api/contact` réel au submit, gestion erreur

## Ports
- API : `3000`
- MySQL : `3306`
- Front (dev Vite) : `5173`, proxy `/api` vers l'API

## Tests
Un fichier `bun test` par ressource via `app.request()` de Hono et
`InMemoryRepository` : codes HTTP, formes de réponse, et validation du contact
(cas valides + invalides).
