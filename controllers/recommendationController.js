const { Movie, Review, MoviePreference } = require('../models');
const { Op } = require('sequelize');

exports.getRecommendations = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get preferences
    const prefs = await MoviePreference.findOne({ where: { user_id: userId } });

    // Get most-reviewed genre from their stats
    const userReviews = await Review.findAll({
      where: { user_id: userId },
      include: [{ model: Movie, as: 'movie', attributes: ['genre'] }]
    });

    const genreCount = {};
    userReviews.forEach(r => {
      const g = r.movie?.genre;
      if (g) genreCount[g] = (genreCount[g] || 0) + 1;
    });

    let topGenre = null;
    let maxCount = 0;
    for (const g in genreCount) {
      if (genreCount[g] > maxCount) {
        topGenre = g;
        maxCount = genreCount[g];
      }
    }

    // Build search conditions based on preferences and top genre
    const conditions = [];

    if (prefs?.genre_preference) {
      conditions.push({ genre: prefs.genre_preference });
    }

    if (topGenre) {
      conditions.push({ genre: topGenre });
    }

    const actorKeywords = prefs?.favorite_actors?.split(',').map(a => a.trim());
    const directorKeywords = prefs?.favorite_directors?.split(',').map(d => d.trim());

    if (actorKeywords?.length) {
      actorKeywords.forEach(keyword => {
        conditions.push({ description: { [Op.like]: `%${keyword}%` } });
      });
    }

    if (directorKeywords?.length) {
      directorKeywords.forEach(keyword => {
        conditions.push({ description: { [Op.like]: `%${keyword}%` } });
      });
    }

    const recommendations = await Movie.findAll({
      where: {
        [Op.or]: conditions
      },
      limit: 10
    });

    res.status(200).json({ recommended: recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
