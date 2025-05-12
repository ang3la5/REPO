const express = require('express');
const { getAllMovies, createMovie } = require('../controllers/movieController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public Route
router.get('/', getAllMovies);

// Admin-Only Route
router.post('/', authenticate, isAdmin, createMovie);

module.exports = router;
