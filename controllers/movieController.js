const { Movie, Season, Episode, Review, ListMovie } = require('../models');
const { Op } = require('sequelize');

exports.getAllMovies = async (req, res) => {
  const { search, genre, type } = req.query;

  const where = {};

  if (search && typeof search === 'string') {
    where.title = { [Op.like]: `%${search.trim()}%` };
  }

  if (genre && typeof genre === 'string') {
    where.genre = { [Op.like]: `%${genre.trim()}%` };
  }

  if (type && typeof type === 'string') {
    where.type = type.trim();
  }

  try {
    const movies = await Movie.findAll({ where });
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, description, genre, type, actors, directors } = req.body;

  try {
    const movie = await Movie.findByPk(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    Object.assign(movie, { title, description, genre, type, actors, directors });
    await movie.save();

    res.status(200).json({ message: "Movie updated", movie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMovie = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findByPk(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // 1. Delete reviews
    await Review.destroy({ where: { movie_id: id } });

    // 2. Delete from user lists
    await ListMovie.destroy({ where: { movie_id: id } });

    // 3. If series, delete seasons and episodes
    if (movie.type === 'series') {
      const seasons = await Season.findAll({ where: { series_id: id } });

      for (const season of seasons) {
        await Episode.destroy({ where: { season_id: season.id } });
        await season.destroy();
      }
    }

    // 4. Delete the movie/series
    await movie.destroy();

    res.status(200).json({ message: "Movie/series and all related data deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
