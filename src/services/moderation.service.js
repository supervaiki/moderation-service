const Moderation = require('../models/moderation.model');
const annonceService = require('./annonce.service');

/**
 * Approve an annonce (Save to MySQL and notify annonce-service)
 * @param {number} annonceId 
 * @returns {Object} Moderation result
 */
const approveAnnonce = async (annonceId) => {
  try {
    // 1. Vérifier si l'annonce a déjà été modérée en base
    const existing = await Moderation.findOne({ where: { annonceId: parseInt(annonceId) } });

    if (existing) {
      throw new Error('Annonce already moderated');
    }

    // 2. Créer l'entrée dans la table MySQL
    const moderation = await Moderation.create({
      id: `MOD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      annonceId: parseInt(annonceId),
      status: 'APPROUVEE',
      reason: null
    });

    // 3. Mettre à jour le statut dans le service Spring Boot
    try {
      await annonceService.updateAnnonceStatut(annonceId, 'PUBLIEE');
      console.log(`Annonce ${annonceId} statut updated to PUBLIEE in annonce-service`);
    } catch (annonceError) {
      console.warn(`Warning: Annonce-service update failed: ${annonceError.message}`);
      // On continue même si la mise à jour Spring Boot échoue, la modération est déjà enregistrée
    }

    return moderation;
  } catch (error) {
    throw new Error(`Error approving annonce: ${error.message}`);
  }
};

/**
 * Reject an annonce (Save to MySQL and notify annonce-service)
 * @param {number} annonceId 
 * @param {string} reason 
 * @returns {Object} Moderation result
 */
const rejectAnnonce = async (annonceId, reason = '') => {
  try {
    const existing = await Moderation.findOne({ where: { annonceId: parseInt(annonceId) } });

    if (existing) {
      throw new Error('Annonce already moderated');
    }

    const moderation = await Moderation.create({
      id: `MOD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      annonceId: parseInt(annonceId),
      status: 'REJETEE',
      reason: reason || 'Annonce does not meet requirements'
    });

    // 3. Mettre à jour le statut dans le service Spring Boot
    try {
      await annonceService.updateAnnonceStatut(annonceId, 'REJETEE');
      console.log(`Annonce ${annonceId} statut updated to REJETEE in annonce-service`);
    } catch (annonceError) {
      console.warn(`Warning: Annonce-service update failed: ${annonceError.message}`);
      // On continue même si la mise à jour Spring Boot échoue, la modération est déjà enregistrée
    }

    return moderation;
  } catch (error) {
    throw new Error(`Error rejecting annonce: ${error.message}`);
  }
};

/**
 * Get moderation by annonce ID from MySQL
 */
const getModerationByAnnonceId = async (annonceId) => {
  try {
    return await Moderation.findOne({ where: { annonceId: parseInt(annonceId) } });
  } catch (error) {
    throw new Error(`Error fetching moderation: ${error.message}`);
  }
};

/**
 * Get real-time statistics from MySQL
 */
const getStatistics = async () => {
  try {
    const total = await Moderation.count();
    const approved = await Moderation.count({ where: { status: 'APPROUVEE' } });
    const rejected = await Moderation.count({ where: { status: 'REJETEE' } });

    return {
      totalModerated: total,
      approved,
      rejected,
      approvalRate: total > 0 ? parseFloat(((approved / total) * 100).toFixed(2)) : 0,
      rejectionRate: total > 0 ? parseFloat(((rejected / total) * 100).toFixed(2)) : 0
    };
  } catch (error) {
    throw new Error(`Error fetching statistics: ${error.message}`);
  }
};

module.exports = {
  approveAnnonce,
  rejectAnnonce,
  getModerationByAnnonceId,
  getStatistics
};