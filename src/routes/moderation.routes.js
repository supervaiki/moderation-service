const express = require('express');
const router = express.Router();
const moderationController = require('../controllers/moderation.controller');

/**
 * @swagger
 * /api/moderations/{annonceId}/approve:
 *   patch:
 *     tags:
 *       - Moderation
 *     summary: Approve an annonce
 *     parameters:
 *       - in: path
 *         name: annonceId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The annonce ID to approve
 *     responses:
 *       200:
 *         description: Annonce approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     annonceId:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       enum: [APPROUVEE]
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict - Annonce already moderated
 *       500:
 *         description: Server error
 */
router.patch('/:annonceId/approve', moderationController.approveAnnonce);

/**
 * @swagger
 * /api/moderations/{annonceId}/reject:
 *   patch:
 *     tags:
 *       - Moderation
 *     summary: Reject an annonce
 *     parameters:
 *       - in: path
 *         name: annonceId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The annonce ID to reject
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for rejection
 *     responses:
 *       200:
 *         description: Annonce rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     annonceId:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       enum: [REJETEE]
 *                     reason:
 *                       type: string
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict - Annonce already moderated
 *       500:
 *         description: Server error
 */
router.patch('/:annonceId/reject', moderationController.rejectAnnonce);

/**
 * @swagger
 * /api/moderations/stats:
 *   get:
 *     tags:
 *       - Moderation
 *     summary: Get moderation statistics
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalModerated:
 *                       type: integer
 *                     approved:
 *                       type: integer
 *                     rejected:
 *                       type: integer
 *                     approvalRate:
 *                       type: number
 *       500:
 *         description: Server error
 */
router.get('/stats', moderationController.getStats);

/**
 * @swagger
 * /api/moderations/{annonceId}:
 *   get:
 *     tags:
 *       - Moderation
 *     summary: Get moderation by annonce ID
 *     parameters:
 *       - in: path
 *         name: annonceId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The annonce ID
 *     responses:
 *       200:
 *         description: Moderation retrieved successfully
 *       404:
 *         description: Moderation not found
 *       500:
 *         description: Server error
 */
router.get('/:annonceId', moderationController.getModerationByAnnonceId);

module.exports = router;
