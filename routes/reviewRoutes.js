const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const {
  createReview,
  updateReview,
  deleteReview,
  getReviewsForMovie
} = require('../controllers/reviewController');

const router = express.Router();

router.post('/', authenticate, createReview);
router.put('/:reviewId', authenticate, updateReview);
router.delete('/:reviewId', authenticate, deleteReview);
router.get('/:movieId', getReviewsForMovie);

module.exports = router;