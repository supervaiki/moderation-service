

/**
 * Envoie une réponse de succès
 * @param {Object} res - Objet de réponse Express
 * @param {number} statusCode - Code HTTP (ex: 200, 201)
 * @param {string} message - Message descriptif
 * @param {Object} data - Données provenant de MySQL (Sequelize)
 */
const successResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Envoie une réponse d'erreur
 * @param {Object} res - Objet de réponse Express
 * @param {number} statusCode - Code HTTP (ex: 400, 404, 500)
 * @param {string} message - Message d'erreur
 * @param {Object} error - Détails de l'erreur (stack trace en dev uniquement)
 */
const errorResponse = (res, statusCode, message, error = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    error,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  successResponse,
  errorResponse
};