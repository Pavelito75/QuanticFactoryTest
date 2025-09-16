
# QuanticFactory Test – Plateforme de Recherche


Bienvenue sur **QuanticFactory Test** !
Ce projet est un test technique réalisé en 5 jours pour l’entreprise QuanticFactory, développé avec **Next.js** (React) côté front-end.
Il utilise les API **OpenDataParis** pour la recherche d’activités et de lieux.

---

## Fonctionnalités principales

- Recherche d’activités et de lieux
- Filtrage par arrondissement et type d’activité
- Géolocalisation pour trouver des résultats proches
- Interface moderne
- Utilisation de polices personnalisées (Nexa)

---

## Documentation technique

### Front-end (client)

- **Next.js** (React, JavaScript)
- Structure :
	```
	quantic/
	├── public/              # Fichiers publics (polices, images)
	│   └── nexa/            # Polices Nexa
	├── src/
	│   ├── app/             # Pages principales (layout, page, api)
	│   └── components/      # Composants UI (filtres, barre de recherche, géolocalisation)
	├── package.json         # Dépendances et scripts
	├── next.config.mjs      # Configuration Next.js
	├── jsconfig.json        # Configuration JS
	└── README.md            # Documentation
	```

---

## Guide utilisateur & développeur

### Prérequis

- **npm**

### Installation

1. **Cloner le dépôt**
	```bash
	git clone <git@github.com:Pavelito75/QuanticFactoryTest.git>
	cd quantic
	```

2. **Installer les dépendances**
	```bash
	npm install
	```

### Lancement du projet

1. **Démarrer le serveur Next.js**
	```bash
	npm run dev
	```

2. **Accéder à l’application**
	- [http://localhost:3000](http://localhost:3000)

---

## Utilisation

- Utilisez la barre de recherche et les filtres pour trouver des activités
- Activez la géolocalisation pour des résultats personnalisés
- Interface adaptée à tous les supports

---

## Notes

- Les polices Nexa sont intégrées dans le dossier `public/nexa/`
- Les composants sont modulaires et facilement extensibles
- Le projet est conçu pour être simple à prendre en main

---

**Projet réalisé en 5 jours dans le cadre d’un test technique pour QuanticFactory.**

**Auteur :**
- Pavelito : Fullstack