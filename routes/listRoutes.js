const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { createList, addMovieToList, getUserLists } = require('../controllers/listController');

const router = express.Router();

router.post('/', authenticate, createList); // ✅ Authenticated users only
router.post('/:id/add', authenticate, addMovieToList); // ✅ Add movie to list
router.get('/:userId', authenticate, getUserLists); // ✅ View user's lists with movies

module.exports = router;
