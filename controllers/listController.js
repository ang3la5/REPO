const { UserList, Movie } = require('../models');

exports.createList = async (req, res) => {
  const userId = req.user.id;
  const { name, description } = req.body;

  try {
    const list = await UserList.create({
      user_id: userId,
      name,
      description
    });

    res.status(201).json({ message: 'List created', list });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addMovieToList = async (req, res) => {
  const userId = req.user.id;
  const listId = req.params.id;
  const { movieId } = req.body;

  try {
    // Make sure the list belongs to the user
    const list = await UserList.findOne({ where: { id: listId, user_id: userId } });
    if (!list) {
      return res.status(404).json({ message: "List not found or does not belong to user." });
    }

    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    await list.addMovie(movie); // Sequelize magic from belongsToMany

    res.status(200).json({ message: `Movie added to "${list.name}"` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserLists = async (req, res) => {
  const userId = req.params.userId;

  try {
    const lists = await UserList.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Movie,
          as: 'movies',
          attributes: ['id', 'title', 'type', 'genre']
        }
      ]
    });

    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};