const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { createList, addMovieToList, getUserLists, deleteList, updateList, removeMovieFromList, addSeriesToList } = require('../controllers/listController');


const router = express.Router();


router.delete('/:listId/movie/:movieId', authenticate, removeMovieFromList);
router.post('/:id/add-series', authenticate, addSeriesToList);
router.get('/user', authenticate, getUserLists); // cleaner
router.post('/', authenticate, createList); // ✅ Authenticated users only
router.post('/:id/add', authenticate, addMovieToList); // ✅ Add movie to list
router.delete('/:id', authenticate, deleteList);
router.put('/:id', authenticate, updateList);

module.exports = router;
