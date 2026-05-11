/**
 * GUIDE DE FINALIZATION - Connexion Node.js ↔ Spring Boot
 * =========================================================
 * 
 * Ce document explique les modifications apportées et les prochaines étapes
 */

// ============================================================
// 1. FICHIERS CRÉES/MODIFIÉS
// ============================================================

// ✅ CRÉÉS:
// - src/services/annonce.service.js
//   → Service pour communiquer avec Spring Boot
//   → Gère les appels HTTP vers annonce-service
//   → Fonctions: getAnnonce(), updateAnnonceStatut(), submitAnnonce()

// - .env.example
//   → Configuration d'environnement de base
//   → À copier et adapter: cp .env.example .env

// ✅ MODIFIÉS:
// - package.json
//   → Ajout de "axios" aux dépendances

// - src/services/moderation.service.js
//   → Import du service annonce
//   → Appel à annonce-service après approbation/rejet
//   → Gestion gracieuse des erreurs de connexion

// - src/config/swagger.js
//   → Amélioré la documentation

// - README.md
//   → Documentation complète de l'intégration

// ============================================================
// 2. CONFIGURATION REQUISE
// ============================================================

/*
   Avant de lancer le service, créez votre fichier .env:

   $ cp .env.example .env

   Éditez .env avec vos paramètres:
   - ANNONCE_SERVICE_URL: URL de votre service Spring Boot
   - DB_*: Paramètres MySQL

   Exemple:
   ```
   PORT=3002
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=moderation_db
   DB_PORT=3306
   ANNONCE_SERVICE_URL=http://localhost:8080/api
   ```
*/

// ============================================================
// 3. INSTALLER LES DÉPENDANCES
// ============================================================

/*
   $ npm install

   Cela installera:
   - axios (pour les appels HTTP)
   - express, cors, dotenv
   - sequelize, mysql2
   - swagger-jsdoc, swagger-ui-express
   - nodemon (dev)
*/

// ============================================================
// 4. CRÉER LA BASE DE DONNÉES
// ============================================================

/*
   Lancez MySQL et exécutez:

   CREATE DATABASE moderation_db;
*/

// ============================================================
// 5. WORKFLOW DE COMMUNICATION
// ============================================================

/*
   ┌─────────────────────────────────────────┐
   │ Spring Boot (annonce-service)           │
   │ POST /api/annonces/{id}/soumettre       │
   └────────────────┬────────────────────────┘
                    │ Appelle
                    ▼
   ┌─────────────────────────────────────────┐
   │ Node.js (moderation-service)            │
   │ PATCH /api/moderations/{id}/approve     │
   │ PATCH /api/moderations/{id}/reject      │
   └────────────────┬────────────────────────┘
                    │ Retour appel HTTP
                    ▼
   ┌─────────────────────────────────────────┐
   │ Spring Boot (annonce-service)           │
   │ PATCH /api/annonces/{id}/statut         │
   │ (MET À JOUR: PUBLIEE ou REJETEE)        │
   └─────────────────────────────────────────┘

   FLUX COMPLET:
   1. User crée annonce → Status: EN_ATTENTE
   2. User soumet → Spring Boot appelle Node.js
   3. Node.js enregistre décision → Base MySQL
   4. Node.js appelle Spring Boot → Update annonce
   5. Annonce devient PUBLIEE ou REJETEE
*/

// ============================================================
// 6. LANCER LES SERVICES
// ============================================================

/*
   Terminal 1 - Spring Boot (Port 8080):
   $ cd /chemin/vers/annonce-service
   $ mvn spring-boot:run

   Terminal 2 - Node.js (Port 3002):
   $ cd /chemin/vers/moderation-service
   $ npm start

   Ou mode développement:
   $ npm run dev
*/

// ============================================================
// 7. TESTER LES ENDPOINTS
// ============================================================

/*
   A. Approuver une annonce:
   
   PATCH http://localhost:3002/api/moderations/1/approve

   Réponse:
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
   
   ✅ Cela va aussi:
      - Enregistrer en BD MySQL
      - Appeler Spring Boot pour mettre à jour le statut

   B. Rejeter une annonce:
   
   PATCH http://localhost:3002/api/moderations/2/reject
   Content-Type: application/json
   
   {
     "reason": "Contenu inapproprié"
   }

   Réponse:
   {
     "success": true,
     "message": "Annonce rejected successfully",
     "data": {
       "id": "MOD-1715394827123-8901",
       "annonceId": 2,
       "status": "REJETEE",
       "reason": "Contenu inapproprié"
     }
   }

   C. Voir la modération d'une annonce:
   
   GET http://localhost:3002/api/moderations/1

   D. Voir les statistiques:
   
   GET http://localhost:3002/api/moderations/stats

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
*/

// ============================================================
// 8. VÉRIFIER LES LOGS
// ============================================================

/*
   Node.js affichera des logs comme:

   SUCCESS:
   ✓ Annonce 1 statut updated to PUBLIEE in annonce-service

   WARNING (Spring Boot down):
   ⚠ Warning: Annonce-service update failed: ECONNREFUSED
   → Le service continue même si Spring Boot est down

   ERROR:
   ✗ Error approving annonce: Annonce already moderated
*/

// ============================================================
// 9. ACCÉDER À SWAGGER
// ============================================================

/*
   URL: http://localhost:3002/api-docs

   Vous pouvez:
   - Voir tous les endpoints documentés
   - Tester les endpoints directement
   - Consulter les schémas OpenAPI
*/

// ============================================================
// 10. POINTS CLÉS D'INTÉGRATION
// ============================================================

/*
   A. Configuration de l'URL Spring Boot:
      - Variable: ANNONCE_SERVICE_URL
      - Fichier: .env
      - Défaut: http://localhost:8080/api

   B. Format des appels HTTP:
      - Méthode: PATCH
      - Endpoint: /api/annonces/{id}/statut
      - Body: { "statut": "PUBLIEE" }

   C. Gestion d'erreurs:
      - Si Spring Boot est down: Logs warning, service continue
      - Annonce déjà modérée: 409 Conflict
      - ID manquant: 400 Bad Request
      - Erreur serveur: 500 Server Error

   D. Statuts supportés:
      - EN_ATTENTE: Annonce créée, en attente de modération
      - APPROUVEE: Modération approuvée (côté Node.js)
      - REJETEE: Modération rejetée (côté Node.js)
      - PUBLIEE: Annonce publiée (côté Spring Boot)

   E. Données persistantes:
      - Node.js: Enregistre dans MySQL local
      - Spring Boot: Enregistre dans sa BD

   F. Sécurité:
      - Vérifier ANNONCE_SERVICE_URL en production
      - Ajouter authentification/JWT si nécessaire
      - Valider les données entrantes
*/

// ============================================================
// 11. STRUCTURE DU PROJET FINAL
// ============================================================

/*
   moderation-service/
   ├── src/
   │   ├── config/
   │   │   ├── db.js                    # Configuration MySQL
   │   │   └── swagger.js               # Configuration Swagger (MODIFIÉ)
   │   ├── controllers/
   │   │   └── moderation.controller.js
   │   ├── models/
   │   │   └── moderation.model.js
   │   ├── routes/
   │   │   └── moderation.routes.js
   │   ├── services/
   │   │   ├── moderation.service.js    # Logique métier (MODIFIÉ)
   │   │   └── annonce.service.js       # NOUVEAU - Intégration Spring Boot
   │   ├── utils/
   │   │   └── response.js
   │   ├── middlewares/
   │   │   └── error.middleware.js
   │   └── app.js
   ├── server.js
   ├── package.json                     # MODIFIÉ - axios ajouté
   ├── .env                             # À créer - cp .env.example .env
   ├── .env.example                     # NOUVEAU
   ├── README.md                        # MODIFIÉ - Documentation complète
   └── INTEGRATION_GUIDE.js            # CE FICHIER
*/

// ============================================================
// 12. PROCHAINES ÉTAPES
// ============================================================

/*
   1. ✅ Copier .env.example en .env
   2. ✅ Adapter les variables d'environnement
   3. ✅ Créer la BD MySQL moderation_db
   4. ✅ npm install
   5. ✅ Vérifier que Spring Boot est lancé (8080)
   6. ✅ npm start (ou npm run dev)
   7. ✅ Tester les endpoints via Swagger UI
   8. ✅ Valider le workflow complet

   Optionnel:
   - Ajouter authentification JWT
   - Ajouter validation de données
   - Ajouter logging structuré
   - Ajouter tests unitaires
   - Déployer en production
*/

// ============================================================
// FIN DU GUIDE
// ============================================================
