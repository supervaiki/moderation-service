Voici le contenu complet de votre fichier **README.md** au format Markdown (`.md`). Vous pouvez copier et coller ce bloc directement dans votre fichier.

```markdown
# Moderation Service - SenAnnonces.sn

Service de modération pour la plateforme SenAnnonces.sn. Ce microservice est responsable de la validation, de l'approbation et du rejet des annonces avant leur publication finale.

## Architecture du Projet

```text
moderation-service/
├── src/
│   ├── config/
│   │   ├── db.js                # Configuration de la connexion MySQL (Sequelize)
│   │   └── swagger.js           # Configuration OpenAPI/Swagger
│   ├── models/
│   │   └── moderation.model.js  # Modèle Sequelize pour la table MySQL
│   ├── routes/
│   │   └── moderation.routes.js # Définition des routes API
│   ├── controllers/
│   │   └── moderation.controller.js # Gestion des requêtes et réponses HTTP
│   ├── services/
│   │   └── moderation.service.js   # Logique métier et accès aux données MySQL
│   ├── middlewares/
│   │   └── error.middleware.js     # Gestion centralisée des erreurs
│   ├── utils/
│   │   └── response.js             # Formateurs de réponse standardisés
│   └── app.js                   # Configuration Express et synchronisation DB
├── server.js                    # Point d'entrée du serveur
├── package.json                 # Dépendances et scripts
├── .env                         # Variables d'environnement (non versionné)
└── README.md                    # Documentation du projet

```

## Installation

1. Installez les dépendances nécessaires :
```bash
npm install

```


2. Assurez-vous d'avoir installé **mysql2** et **sequelize** :
```bash
npm install mysql2 sequelize

```



## Configuration de la Base de Données

Ce service utilise une base de données MySQL **indépendante** pour garantir l'isolation des microservices.

1. Créez la base de données dans votre interface MySQL :
```sql
CREATE DATABASE sen_annonces_moderation;

```


2. Configurez vos accès dans le fichier `.env` :
```env
PORT=3002
DB_HOST=localhost
DB_NAME=sen_annonces_moderation
DB_USER=votre_utilisateur
DB_PASS=votre_mot_de_passe
NODE_ENV=development

```



## Utilisation

### Lancement en mode développement

```bash
npm run dev

```

### Lancement en mode production

```bash
npm start

```

## Endpoints API

### Modération

| Méthode | Endpoint | Description |
| --- | --- | --- |
| **PATCH** | `/api/moderations/:id/approve` | Approuve une annonce par son ID |
| **PATCH** | `/api/moderations/:id/reject` | Rejette une annonce (nécessite une raison) |
| **GET** | `/api/moderations/:id` | Récupère les détails d'une modération |
| **GET** | `/api/moderations/stats` | Récupère les statistiques globales (depuis MySQL) |

## Documentation Swagger

La documentation interactive OpenAPI est disponible une fois le serveur lancé à l'adresse suivante :

👉 `http://localhost:3002/api-docs`

## Intégration Microservices

Ce service s'intègre avec le service Java (`annonce-service`) selon le flux suivant :

1. **Java** : Crée l'annonce (statut `EN_ATTENTE`).
2. **Java** : Appelle ce service via l'endpoint `/approve` ou `/reject`.
3. **Node.js** : Enregistre la décision dans la base MySQL `sen_annonces_moderation`.
4. **Node.js** : Renvoie le résultat JSON au service Java.
5. **Java** : Met à jour le statut final (`PUBLIEE` ou `REJETEE`) en fonction de la réponse.

## Technologies

* **Backend** : Node.js / Express
* **Base de données** : MySQL
* **ORM** : Sequelize
* **Documentation** : Swagger UI / OpenAPI 3.0

```


```