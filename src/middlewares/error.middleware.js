const { errorResponse } = require('../utils/response');

const notFoundHandler = (req, res, next) => {
  errorResponse(res, 404, `Route not found: ${req.originalUrl}`);
};

const errorHandler = (err, req, res, next) => {
  // Log détaillé 
  console.error('Error Details:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // --- AJOUT : Gestion spécifique des erreurs Sequelize ---
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Cette annonce a déjà été modérée (Violation de contrainte).';
  }
  
  if (err.name === 'SequelizeConnectionError') {
    statusCode = 503;
    message = 'Le service de base de données MySQL est indisponible.';
  }
  // -------------------------------------------------------

  errorResponse(res, statusCode, message, {
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};