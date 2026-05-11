/**
 * Service pour communiquer avec l'annonce-service (Spring Boot)
 */

const axios = require('axios');

// Configuration de l'URL du service Spring Boot
const ANNONCE_SERVICE_URL = process.env.ANNONCE_SERVICE_URL || 'http://localhost:8080/api';

const annonceService = {
  /**
   * Récupérer les détails d'une annonce
   * @param {number} annonceId - ID de l'annonce
   * @returns {Promise<Object>} Détails de l'annonce
   */
  async getAnnonce(annonceId) {
    try {
      const response = await axios.get(
        `${ANNONCE_SERVICE_URL}/annonces/${annonceId}`,
        { timeout: 5000 }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de l'annonce ${annonceId}:`,
        error.message
      );
      throw new Error(`Impossible de récupérer l'annonce: ${error.message}`);
    }
  },

  /**
   * Mettre à jour le statut d'une annonce
   * @param {number} annonceId - ID de l'annonce
   * @param {string} statut - Nouveau statut (APPROUVEE, REJETEE, PUBLIEE)
   * @returns {Promise<Object>} Annonce mise à jour
   */
  async updateAnnonceStatut(annonceId, statut) {
    try {
      const response = await axios.patch(
        `${ANNONCE_SERVICE_URL}/annonces/${annonceId}/statut`,
        { statut },
        { timeout: 5000 }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour de l'annonce ${annonceId}:`,
        error.message
      );
      throw new Error(
        `Impossible de mettre à jour l'annonce: ${error.message}`
      );
    }
  },

  /**
   * Soumettre une annonce pour modération
   * @param {number} annonceId - ID de l'annonce
   * @returns {Promise<Object>} Annonce soumise
   */
  async submitAnnonce(annonceId) {
    try {
      const response = await axios.post(
        `${ANNONCE_SERVICE_URL}/annonces/${annonceId}/soumettre`,
        {},
        { timeout: 5000 }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la soumission de l'annonce ${annonceId}:`,
        error.message
      );
      throw new Error(
        `Impossible de soumettre l'annonce: ${error.message}`
      );
    }
  }
};

module.exports = annonceService;
