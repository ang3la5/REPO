const { UserList, Movie } = require('../models');

exports.createList = async (req, res) => {
  const userId = req.user.id;
  const { name, description } = req.body;

  try {
    // Prevent duplicate list names per user
    const existing = await UserList.findOne({ where: { user_id: userId, name } });
    if (existing) {
      return res.status(400).json({ message: 'A list with this name already exists.' });
    }

    const list = await UserList.create({
      user_id: userId,
      name,
      description: description || null,
      isDefault: false
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
  const userId = req.user.id; // 🔄 get from token instead of params

  try {
    const lists = await UserList.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Movie,
          as: 'movies',
          attributes: ['id', 'title', 'type', 'genre', 'posterUrl'] // optional: include poster
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(lists);
  } catch (error) {
    console.error('Error in getUserLists:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteList = async (req, res) => {
  const userId = req.user.id;
  const listId = req.params.id;

  try {
    const list = await UserList.findOne({ where: { id: listId, user_id: userId } });

    if (!list) return res.status(404).json({ message: 'List not found.' });
    if (list.isDefault) return res.status(403).json({ message: 'Cannot delete default lists.' });

    await list.destroy();
    res.status(200).json({ message: 'List deleted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /lists/:id
exports.updateList = async (req, res) => {
  const userId = req.user.id;
  const listId = req.params.id;
  const { name, description } = req.body;

  try {
    const list = await UserList.findOne({ where: { id: listId, user_id: userId } });

    if (!list) return res.status(404).json({ message: 'List not found.' });
    if (list.isDefault) return res.status(403).json({ message: 'Cannot rename default lists.' });

    list.name = name || list.name;
    list.description = description || list.description;
    await list.save();

    res.status(200).json({ message: 'List updated', list });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeMovieFromList = async (req, res) => {
  const userId = req.user.id;
  const { listId, movieId } = req.params;

  try {
    const list = await UserList.findOne({
      where: { id: listId, user_id: userId }
    });

    if (!list) {
      return res.status(404).json({ message: 'List not found or not owned by user.' });
    }

    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found.' });
    }

    await list.removeMovie(movie); // Sequelize belongsToMany magic

    res.status(200).json({ message: 'Movie removed from list.' });
  } catch (error) {
    console.error('Error removing movie from list:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.addSeriesToList = async (req, res) => {
  const userId = req.user.id;
  const listId = req.params.id;
  const { seriesId } = req.body;

  if (!seriesId) {
    return res.status(400).json({ message: 'Missing seriesId in request body' });
  }

  try {
    const list = await List.findByPk(listId);

    if (!list || list.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to modify this list' });
    }

    await list.addSeries(seriesId); // Sequelize many-to-many magic

    res.status(200).json({ message: 'Series added to list successfully' });
  } catch (err) {
    console.error('Error adding series to list:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
