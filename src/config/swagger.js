/**
 * Swagger/OpenAPI Configuration
 */

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Moderation Service API - SenAnnonces.sn',
      version: '1.0.0',
      description: 'Service de modération pour la plateforme SenAnnonces.sn. Valide et approuve/rejette les annonces avant publication. Communique avec le service annonce-service (Spring Boot).',
      
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Development server'
      },
      
    ],
    
    components: {
      schemas: {
        Annonce: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique annonce ID'
            },
            titre: {
              type: 'string',
              description: 'Titre de l\'annonce'
            },
            description: {
              type: 'string',
              description: 'Description complète'
            },
            prix: {
              type: 'number',
              description: 'Prix de l\'annonce'
            },
            ville: {
              type: 'string',
              description: 'Ville où l\'annonce est publiée'
            },
            statut: {
              type: 'string',
              enum: ['EN_ATTENTE', 'APPROUVEE', 'REJETEE', 'PUBLIEE'],
              description: 'Statut de l\'annonce'
            }
          }
        },
        Moderation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique moderation ID'
            },
            annonceId: {
              type: 'integer',
              description: 'ID de l\'annonce modérée'
            },
            status: {
              type: 'string',
              enum: ['APPROUVEE', 'REJETEE'],
              description: 'Décision de modération'
            },
            reason: {
              type: 'string',
              nullable: true,
              description: 'Raison du rejet (si applicable)'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp de la modération'
            }
          }
        },
        ApproveRequest: {
          type: 'object',
          description: 'Request body (optionnel)',
          properties: {}
        },
        RejectRequest: {
          type: 'object',
          description: 'Request body pour rejeter une annonce',
          properties: {
            reason: {
              type: 'string',
              description: 'Raison du rejet'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string'
            },
            error: {
              type: 'object',
              nullable: true
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Statistics: {
          type: 'object',
          properties: {
            totalModerated: {
              type: 'integer',
              description: 'Nombre total d\'annonces modérées'
            },
            approved: {
              type: 'integer',
              description: 'Nombre d\'annonces approuvées'
            },
            rejected: {
              type: 'integer',
              description: 'Nombre d\'annonces rejetées'
            },
            approvalRate: {
              type: 'number',
              description: 'Taux d\'approbation en pourcentage'
            },
            rejectionRate: {
              type: 'number',
              description: 'Taux de rejet en pourcentage'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Moderation',
        description: 'Endpoints de modération des annonces',
        externalDocs: {
          description: 'Workflow de modération',
          url: 'http://localhost:3002/api-docs'
        }
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/app.js']
};

module.exports = swaggerOptions;
