const express = require('express');
const { getTaskStatistics, getTaskTrends } = require('../controllers/analytics.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// All analytics routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/analytics/statistics
 * @desc    Get task statistics for user
 * @access  Private
 */
router.get('/statistics', getTaskStatistics);

/**
 * @route   GET /api/v1/analytics/trends
 * @desc    Get task trends and insights
 * @access  Private
 */
router.get('/trends', getTaskTrends);

module.exports = router;
