const express = require('express');
const { getRecommendations } = require('../controllers/recommendationController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/suggestions', authenticate, getRecommendations);

module.exports = router;
