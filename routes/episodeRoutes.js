const express = require('express');
const { createEpisode } = require('../controllers/episodeController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticate, isAdmin, createEpisode);

module.exports = router;
