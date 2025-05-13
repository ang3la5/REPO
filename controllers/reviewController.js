// controllers/reviewController.js
const { Review, Movie, User } = require('../models');

const createReview = async (req, res) => {
  const { movieId, rating, comment } = req.body;
  const userId = req.user.id;

  try {
    const existingReview = await Review.findOne({ where: { movie_id: movieId, user_id: userId } });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this movie." });
    }

    await Review.create({ movie_id: movieId, user_id: userId, rating, comment });
    await updateMovieRating(movieId);

    res.status(201).json({ message: "Review added" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  try {
    const review = await Review.findByPk(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found." });

    if (review.user_id !== userId) {
      return res.status(403).json({ message: "You can only edit your own reviews." });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    await updateMovieRating(review.movie_id);
    res.status(200).json({ message: "Review updated", review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;

  try {
    const review = await Review.findByPk(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found." });

    if (review.user_id !== userId) {
      return res.status(403).json({ message: "You can only delete your own reviews." });
    }

    await review.destroy();
    await updateMovieRating(review.movie_id);

    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper to update movie's average rating and total_reviews
const updateMovieRating = async (movieId) => {
  const reviews = await Review.findAll({ where: { movie_id: movieId } });

  if (reviews.length === 0) {
    // No reviews left
    const movie = await Movie.findByPk(movieId);
    movie.rating = 0;
    movie.total_reviews = 0;
    return await movie.save();
  }

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const average = total / reviews.length;

  const movie = await Movie.findByPk(movieId);
  movie.rating = average;
  movie.total_reviews = reviews.length;
  return await movie.save();
};

const getReviewsForMovie = async (req, res) => {
  const { movieId } = req.params;

  try {
    const reviews = await Review.findAll({
      where: { movie_id: movieId },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReviewsForMovie,
  updateMovieRating
};
