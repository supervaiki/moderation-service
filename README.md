
```markdown
# Moderation Service API - SenAnnonces.sn

Service de modération pour la plateforme SenAnnonces.sn. Ce microservice valide, approuve et rejette les annonces avant leur publication. Développé en Node.js avec Express.

## Architecture

Ce service s'inscrit dans une architecture microservices et interagit directement avec le backend principal :

- **Annonce Service (Spring Boot)** : Gère la création et le cycle de vie global des annonces.
- **Moderation Service (Node.js/Express)** : Isole la logique de modération (approbation et rejet) via des API REST dédiées.

## Flux de Modération

Le processus de modération suit les étapes suivantes:

1. Création d'annonce: Statut initial = EN_ATTENTE
2. Soumission: Appel au service de modération
3. Modération:
   - Approbation: L'annonce est publiée (statut = PUBLIEE)
   - Rejet: L'annonce est marquée comme rejetée (statut = REJETEE)

## Installation et Configuration

### Prérequis

- Node.js v14+
- npm ou yarn
- MySQL 5.7+
- Service Spring Boot (annonce-service) en cours d'exécution sur http://localhost:8080

### Étapes

1. Accéder au répertoire du projet
   ```bash
   cd moderation-service
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   ```bash
   cp .env.example .env
   ```
   
   Éditer `.env` avec vos paramètres:
   ```env
   PORT=3002
   NODE_ENV=development
   
   # Database
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=moderation_db
   DB_PORT=3306
   
   # Annonce Service (Spring Boot)
   ANNONCE_SERVICE_URL=http://localhost:8080/api
   ```

4. **Créer la base de données MySQL**
   ```sql
   CREATE DATABASE moderation_db;
   ```

5. **Lancer le service**
   ```bash
   npm start
   ```
   
   Ou en mode développement:
   ```bash
   npm run dev
   ```

## Endpoints API

### 1. Approuver une annonce

```http
PATCH /api/moderations/{annonceId}/approve
```

Approuve une annonce et met à jour son statut à PUBLIEE dans le service Spring Boot.

**Paramètres**:
- `annonceId` (chemin, entier, obligatoire): Identifiant de l'annonce

**Réponse Succès (200)**:
```json
{
  "success": true,
  "message": "Annonce approved successfully",
  "data": {
    "id": "MOD-1715394827123-4567",
    "annonceId": 1,
    "status": "APPROUVEE",
    "reason": null
  }
}
```

**Codes d'erreur**:
- `400`: L'identifiant de l'annonce est manquant
- `409`: Conflit - L'annonce a déjà été modérée
- `500`: Erreur serveur

---

### 2. Rejeter une annonce

```http
PATCH /api/moderations/{annonceId}/reject
Content-Type: application/json

{
  "reason": "Motif du rejet"
}
```

Rejette une annonce et met à jour son statut à REJETEE dans le service Spring Boot.

**Paramètres**:
- `annonceId` (chemin, entier, obligatoire): Identifiant de l'annonce
- `reason` (corps, chaîne, optionnel): Motif du rejet

**Réponse Succès (200)**:
```json
{
  "success": true,
  "message": "Annonce rejected successfully",
  "data": {
    "id": "MOD-1715394827123-8901",
    "annonceId": 1,
    "status": "REJETEE",
    "reason": "Motif du rejet"
  }
}
```

---

### 3. Récupérer la modération d'une annonce

```http
GET /api/moderations/{annonceId}
```

**Paramètres**:
- `annonceId` (chemin, entier, obligatoire): Identifiant de l'annonce

**Réponse (200)**:
```json
{
  "success": true,
  "message": "Moderation retrieved successfully",
  "data": {
    "id": "MOD-1715394827123-4567",
    "annonceId": 1,
    "status": "APPROUVEE",
    "reason": null
  }
}
```

---

### 4. Obtenir les statistiques

```http
GET /api/moderations/stats
```

**Réponse (200)**:
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalModerated": 10,
    "approved": 7,
    "rejected": 3,
    "approvalRate": 70,
    "rejectionRate": 30
  }
}
```

---

## Intégration avec le Service Spring Boot

### Communication Inter-services

Le service de modération notifie de manière asynchrone le service principal des annonces via des appels HTTP. Les décisions de modération sont traduites ainsi :

- **Approbation** : Synchronisation de l'annonce ciblée vers le statut `PUBLIEE`
- **Rejet** : Synchronisation de l'annonce ciblée vers le statut `REJETEE`

### Configuration de l'URL du Service Spring Boot

L'URL d'accès au service Spring Boot est définie dans le fichier `.env`:

```env
ANNONCE_SERVICE_URL=http://localhost:8080/api
```

### Format des Requêtes vers Spring Boot

Les appels effectués vers le service Spring Boot utilisent le format suivant:

```http
PATCH /api/annonces/{id}/statut
Content-Type: application/json

{
  "statut": "PUBLIEE"
}
```

## Tests et Validation

Exemples de requêtes pour tester les endpoints:

### Approuver une annonce

```bash
curl -X PATCH http://localhost:3002/api/moderations/1/approve
```

### Rejeter une annonce

```bash
curl -X PATCH http://localhost:3002/api/moderations/2/reject \
  -H "Content-Type: application/json" \
  -d '{"reason": "Contenu inapproprié"}'
```

### Récupérer les statistiques

```bash
curl http://localhost:3002/api/moderations/stats
```

## Documentation Interactive

La documentation interactive des API (OpenAPI/Swagger) est accessible à l'adresse suivante après le lancement du service:

```
http://localhost:3002/api-docs
```

## Structure du Projet

```
moderation-service/
├── src/
│   ├── config/
│   │   ├── db.js                 # Configuration MySQL/Sequelize
│   │   └── swagger.js            # Configuration Swagger
│   ├── controllers/
│   │   └── moderation.controller.js
│   ├── models/
│   │   └── moderation.model.js   # Modèle Sequelize
│   ├── routes/
│   │   └── moderation.routes.js
│   ├── services/
│   │   ├── moderation.service.js    # Logique métier modération
│   │   └── annonce.service.js       # Intégration Spring Boot
│   ├── utils/
│   │   └── response.js
│   ├── middlewares/
│   │   └── error.middleware.js
│   └── app.js
├── server.js
├── package.json
├── .env.example
└── README.md
```

## Détails Techniques

### Modèle de Données

La table Moderation stocke les décisions de modération avec la structure suivante:

```javascript
{
  id: String,           // MOD-timestamp-random
  annonceId: Integer,   // Identifiant de l'annonce
  status: String,       // APPROUVEE | REJETEE
  reason: String,       // Motif du rejet (nullable)
  createdAt: Date,
  updatedAt: Date
}
```

### Gestion des Erreurs

Le service gère les erreurs selon les cas suivants:

- Erreurs de connexion avec Spring Boot: Le service continue de fonctionner et enregistre un avertissement
- Annonce déjà modérée: Retourne le code HTTP 409 Conflict
- Paramètres invalides: Retourne le code HTTP 400 Bad Request
- Erreurs serveur: Retourne le code HTTP 500 Server Error

## Variables d'Environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `PORT` | Port du service | 3002 |
| `NODE_ENV` | Environnement | development |
| `DB_HOST` | Host MySQL | localhost |
| `DB_USER` | User MySQL | root |
| `DB_PASSWORD` | Password MySQL | - |
| `DB_NAME` | Database name | moderation_db |
| `DB_PORT` | Port MySQL | 3306 |
| `ANNONCE_SERVICE_URL` | URL Spring Boot | http://localhost:8080/api |

## Résolution des Problèmes

### Erreur: Impossible de se connecter au service annonce-service

Actions recommandées:
- Vérifier que le service Spring Boot est en cours d'exécution sur le port 8080
- Valider l'URL de connexion dans le fichier `.env` (variable ANNONCE_SERVICE_URL)
- Consulter les logs du service Spring Boot pour identifier la cause

### Erreur: Impossible de se connecter à la base de données

Actions recommandées:
- Vérifier que le service MySQL est en cours d'exécution
- Valider les identifiants d'accès dans le fichier `.env`
- Confirmer que la base de données `moderation_db` existe

### Erreur: Annonce déjà modérée

Une annonce ne peut être modérée qu'une seule fois. Vérifier que l'ID fourni est correct et n'a pas été traité précédemment.



```


```