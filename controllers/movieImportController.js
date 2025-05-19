const { Movie } = require('../models');
const { fetchMovieByTitle } = require('../utils/tmdbFetcher');

exports.importMovieFromTMDb = async (req, res) => {
  const { title } = req.query;

  if (!title) return res.status(400).json({ message: "Title is required." });

  try {
    const movieData = await fetchMovieByTitle(title);
    if (!movieData) return res.status(404).json({ message: "Movie not found on TMDb." });

    const existing = await Movie.findOne({ where: { title: movieData.title } });
    if (existing) return res.status(409).json({ message: "Movie already exists." });

    const newMovie = await Movie.create(movieData);
    res.status(201).json({ message: "Movie imported successfully", movie: newMovie });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
