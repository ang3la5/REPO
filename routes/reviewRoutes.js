const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const {
  createReview,
  updateReview,
  deleteReview,
  getReviewsByUser,
  getReviewsForMovie
} = require('../controllers/reviewController');

const router = express.Router();

router.get('/user', authenticate, getReviewsByUser);
router.post('/', authenticate, createReview);
router.put('/:reviewId', authenticate, updateReview);
router.delete('/:reviewId', authenticate, deleteReview);
router.get('/:movieId', getReviewsForMovie);


module.exports = router;