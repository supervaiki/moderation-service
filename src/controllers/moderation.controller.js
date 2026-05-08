const moderationService = require('../services/moderation.service');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Approve an annonce
 * @route PATCH /moderations/{annonceId}/approve
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const approveAnnonce = async (req, res) => {
  try {
    const { annonceId } = req.params;

    if (!annonceId) {
      return errorResponse(res, 400, 'Annonce ID is required');
    }

    const result = await moderationService.approveAnnonce(annonceId);
    successResponse(res, 200, 'Annonce approved successfully', result);
  } catch (error) {
    console.error('Error approving annonce:', error);
    if (error.message.includes('already moderated')) {
      return errorResponse(res, 409, error.message);
    }
    errorResponse(res, 500, 'Error approving annonce', { error: error.message });
  }
};

/**
 * Reject an annonce
 * @route PATCH /moderations/{annonceId}/reject
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const rejectAnnonce = async (req, res) => {
  try {
    const { annonceId } = req.params;
    const { reason } = req.body;

    if (!annonceId) {
      return errorResponse(res, 400, 'Annonce ID is required');
    }

    const result = await moderationService.rejectAnnonce(annonceId, reason);
    successResponse(res, 200, 'Annonce rejected successfully', result);
  } catch (error) {
    console.error('Error rejecting annonce:', error);
    if (error.message.includes('already moderated')) {
      return errorResponse(res, 409, error.message);
    }
    errorResponse(res, 500, 'Error rejecting annonce', { error: error.message });
  }
};

/**
 * Get moderation statistics
 * @route GET /moderations/stats
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getStats = async (req, res) => {
  try {
    const stats = await moderationService.getStatistics();
    successResponse(res, 200, 'Statistics retrieved successfully', stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    errorResponse(res, 500, 'Error fetching statistics', { error: error.message });
  }
};

/**
 * Get moderation by annonce ID
 * @route GET /moderations/{annonceId}
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getModerationByAnnonceId = async (req, res) => {
  try {
    const { annonceId } = req.params;
    const moderation = await moderationService.getModerationByAnnonceId(annonceId);

    if (!moderation) {
      return errorResponse(res, 404, 'Moderation not found for this annonce');
    }

    successResponse(res, 200, 'Moderation retrieved successfully', moderation);
  } catch (error) {
    console.error('Error fetching moderation:', error);
    errorResponse(res, 500, 'Error fetching moderation', { error: error.message });
  }
};

module.exports = {
  approveAnnonce,
  rejectAnnonce,
  getModerationByAnnonceId,
  getStats
};
