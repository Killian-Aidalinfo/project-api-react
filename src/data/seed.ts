// Données initiales — identiques à celles codées en dur dans le front « Atelier ».

export const teamSeed = [
  { nom: "Camille Roy", role: "Lead front-end", initiales: "CR" },
  { nom: "Hugo Petit", role: "Développeur React", initiales: "HP" },
  { nom: "Léa Moreau", role: "Designer UI", initiales: "LM" },
  { nom: "Samir Benali", role: "Intégrateur", initiales: "SB" },
];

export const servicesSeed = [
  {
    no: "01",
    title: "Conception d'interface",
    text: "Maquettage et intégration de composants React clairs et réutilisables.",
  },
  {
    no: "02",
    title: "Développement front",
    text: "Applications single-page rapides, accessibles et faciles à maintenir.",
  },
  {
    no: "03",
    title: "Intégration d'API",
    text: "Connexion à des services distants avec gestion des états de chargement.",
  },
  {
    no: "04",
    title: "Optimisation",
    text: "Performances, bonnes pratiques et structure de code pérenne.",
  },
];

export const projectsSeed = [
  {
    tag: "Interface",
    title: "Tableau de bord",
    text: "Vue de synthèse avec composants réutilisables et données dynamiques.",
  },
  {
    tag: "Données",
    title: "Liste filtrable",
    text: "Recherche et filtres côté client sur une collection d'éléments.",
  },
  {
    tag: "Formulaire",
    title: "Saisie validée",
    text: "Gestion d'état contrôlée et validation des champs en temps réel.",
  },
  {
    tag: "API",
    title: "Consommation REST",
    text: "Récupération de données distantes et états de chargement soignés.",
  },
];

export const faqSeed = [
  {
    q: "Quelles technologies sont utilisées ?",
    a: "Le site est construit avec React 19, Vite pour le bundling et React Router pour la navigation entre les vues.",
  },
  {
    q: "Le projet est-il open source ?",
    a: "Oui, le code source est public et disponible sur GitHub. Vous pouvez le cloner, l'exécuter et l'adapter librement.",
  },
  {
    q: "Comment lancer le projet en local ?",
    a: "Après avoir cloné le dépôt, exécutez « npm install » puis « npm run dev » pour démarrer le serveur de développement.",
  },
  {
    q: "Puis-je ajouter mes propres pages ?",
    a: "Bien sûr. Chaque vue est un fichier dans src/pages ; il suffit d'ajouter une route dans main.jsx et un lien dans la navigation.",
  },
];
