const { Movie } = require('../models');

exports.getAllMovies = async (req, res) => {
  const movies = await Movie.findAll();
  res.status(200).json(movies);
};

exports.createMovie = async (req, res) => {
  const { title, description, genre } = req.body;
  const movie = await Movie.create({ title, description, genre });
  res.status(201).json(movie);
};
