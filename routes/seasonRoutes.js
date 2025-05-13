const express = require('express');
const { createSeason } = require('../controllers/seasonController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticate, isAdmin, createSeason);

module.exports = router;
