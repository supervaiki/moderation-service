Voici le contenu complet de votre fichier **README.md** au format Markdown (`.md`). Vous pouvez copier et coller ce bloc directement dans votre fichier.

```markdown
# Moderation Service API - SenAnnonces.sn

Service de modération pour la plateforme SenAnnonces.sn (Node.js + Express).

## 🏗️ Architecture

Ce service fait partie d'une architecture microservices à 2 services:

```
┌─────────────────────┐
│ Annonce Service     │
│ (Spring Boot)       │
│ Port 8080           │
└──────────┬──────────┘
           │ API Calls
           │
┌──────────▼──────────┐
│ Moderation Service  │
│ (Node.js/Express)   │
│ Port 3002           │
└─────────────────────┘
```

## 📋 Workflow

1. **Créer annonce** → Statut = `EN_ATTENTE`
2. **Soumettre** → Appel au moderation-service
3. **Modération**:
   - ✅ **APPROUVEE** → Annonce devient `PUBLIEE` dans annonce-service
   - ❌ **REJETEE** → Annonce reste `REJETEE` dans annonce-service

## 🚀 Installation

### Prérequis

- Node.js v14+
- npm ou yarn
- MySQL 5.7+
- Service Spring Boot (annonce-service) en cours d'exécution sur http://localhost:8080

### Étapes

1. **Cloner le projet**
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

## 📚 API Endpoints

### 1. Approuver une annonce

```http
PATCH /api/moderations/{annonceId}/approve
```

**Description**: Approuve une annonce et la publie dans annonce-service

**Parameters**:
- `annonceId` (path, integer, required): ID de l'annonce

**Response Success (200)**:
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

**Response Error**:
- `400`: Annonce ID missing
- `409`: Annonce déjà modérée
- `500`: Erreur serveur

---

### 2. Rejeter une annonce

```http
PATCH /api/moderations/{annonceId}/reject
Content-Type: application/json

{
  "reason": "Annonce contient du contenu inapproprié"
}
```

**Description**: Rejette une annonce avec une raison

**Parameters**:
- `annonceId` (path, integer, required): ID de l'annonce
- `reason` (body, string, optional): Raison du rejet

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Annonce rejected successfully",
  "data": {
    "id": "MOD-1715394827123-8901",
    "annonceId": 1,
    "status": "REJETEE",
    "reason": "Annonce contient du contenu inapproprié"
  }
}
```

---

### 3. Récupérer la modération d'une annonce

```http
GET /api/moderations/{annonceId}
```

**Parameters**:
- `annonceId` (path, integer, required): ID de l'annonce

**Response (200)**:
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

**Response (200)**:
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

## 🔗 Intégration avec Spring Boot

### Configuration côté Node.js

Le service Node.js appelle automatiquement annonce-service lorsque:

1. **Approbation** → Met à jour le statut à `PUBLIEE`
   ```javascript
   await annonceService.updateAnnonceStatut(annonceId, 'PUBLIEE');
   ```

2. **Rejet** → Met à jour le statut à `REJETEE`
   ```javascript
   await annonceService.updateAnnonceStatut(annonceId, 'REJETEE');
   ```

### URL de l'API Spring Boot

L'URL doit être configurée dans `.env`:
```env
ANNONCE_SERVICE_URL=http://localhost:8080/api
```

### Endpoints attendus côté Spring Boot

```http
PATCH /api/annonces/{id}/statut
Content-Type: application/json

{
  "statut": "PUBLIEE"
}
```

## 🧪 Tests avec Postman

### 1. Tester l'approbation

```bash
curl -X PATCH http://localhost:3002/api/moderations/1/approve
```

### 2. Tester le rejet

```bash
curl -X PATCH http://localhost:3002/api/moderations/2/reject \
  -H "Content-Type: application/json" \
  -d '{"reason": "Contenu inapproprié"}'
```

### 3. Récupérer les statistiques

```bash
curl http://localhost:3002/api/moderations/stats
```

## 📖 Swagger Documentation

Accédez à la documentation interactive:

```
http://localhost:3002/api-docs
```

## 📁 Structure du Projet

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

## 🔧 Détails Techniques

### Modèle de Données (Moderation)

```javascript
{
  id: String,           // MOD-timestamp-random
  annonceId: Integer,   // ID from annonce-service
  status: String,       // APPROUVEE | REJETEE
  reason: String,       // Nullable
  createdAt: Date,
  updatedAt: Date
}
```

### Gestion des Erreurs

- Connection errors avec Spring Boot: Service continue fonctionner (logs warning)
- Annonce déjà modérée: Retourne 409 Conflict
- Paramètres invalides: Retourne 400 Bad Request
- Erreurs serveur: Retourne 500 Server Error

## 🔐 Variables d'Environnement

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

## 🚨 Troubleshooting

### Erreur: "Cannot connect to annonce-service"

1. Vérifier que le service Spring Boot est en cours d'exécution
2. Vérifier l'URL dans `.env`: `ANNONCE_SERVICE_URL`
3. Vérifier les logs du service Spring Boot

### Erreur: "Cannot connect to database"

1. Vérifier que MySQL est en cours d'exécution
2. Vérifier les identifiants dans `.env`
3. Vérifier que la base de données existe

### Erreur: "Annonce already moderated"

Une annonce ne peut être modérée qu'une seule fois. Vérifier l'ID utilisé.

## 📞 Support

Pour les questions ou problèmes:
- Email: support@senannoncess.sn
- Documentation: http://localhost:3002/api-docs

## 📄 Licence

ISC

```


```