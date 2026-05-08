const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const moderationRoutes = require('./routes/moderation.routes');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');
const swaggerOptions = require('./config/swagger');
const sequelize = require('./config/db'); // Import de ta connexion MySQL

const app = express();

// Swagger documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/moderations', moderationRoutes);

// Health check endpoint
// Amélioration : On vérifie aussi si la DB est connectée
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ 
      status: 'OK', 
      message: 'Service is running', 
      database: 'Connected' 
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Service running but DB disconnected' 
    });
  }
});

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;