const { Review, Movie } = require('../models');

exports.getUserStats = async (req, res) => {
  const userId = req.params.userId;

  try {
    // All reviews by user
    const reviews = await Review.findAll({
      where: { user_id: userId },
      include: [{ model: Movie, as: 'movie', attributes: ['genre', 'type'] }]
    });

    const totalReviews = reviews.length;
    const genres = {};

    reviews.forEach(review => {
      const genre = review.movie?.genre;
      if (genre) {
        genres[genre] = (genres[genre] || 0) + 1;
      }
    });

    // Find most frequent genre
    let mostReviewedGenre = null;
    let maxCount = 0;
    for (const genre in genres) {
      if (genres[genre] > maxCount) {
        mostReviewedGenre = genre;
        maxCount = genres[genre];
      }
    }

    res.status(200).json({
      userId,
      totalReviews,
      mostReviewedGenre,
      genreBreakdown: genres
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
