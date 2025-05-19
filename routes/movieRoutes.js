// routes/movieRoutes.js
const express = require('express');
const {
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie
} = require('../controllers/movieController');
const { getRecommendations } = require('../controllers/recommendationController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// ✅ Static routes first
router.get('/', getAllMovies); // GET /api/movies
router.get('/suggestions', authenticate, getRecommendations); // GET /api/movies/suggestions

// ✅ Dynamic routes after
router.get('/:id', getMovieById); // GET /api/movies/:id
router.put('/:id', authenticate, isAdmin, updateMovie); // PUT /api/movies/:id
router.delete('/:id', authenticate, isAdmin, deleteMovie); // DELETE /api/movies/:id

// ✅ Admin-only movie creation
router.post('/', authenticate, isAdmin); // POST /api/movies

module.exports = router;
