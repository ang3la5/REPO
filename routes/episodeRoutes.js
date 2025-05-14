const express = require('express');
const { deleteEpisode } = require('../controllers/episodeController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.delete('/:id', authenticate, isAdmin, deleteEpisode);

module.exports = router;
