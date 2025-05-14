const express = require('express');
const { getAllMovies, getMovieById, updateMovie, deleteMovie } = require('../controllers/movieController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public Route
router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.get('/:id', updateMovie);
router.get('/:id', deleteMovie);
router.put('/:id', authenticate, isAdmin, updateMovie);
router.delete('/:id', authenticate, isAdmin, deleteMovie);


// Admin-Only Route
router.post('/', authenticate, isAdmin);

module.exports = router;
