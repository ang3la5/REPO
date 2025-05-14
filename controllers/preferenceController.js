const { MoviePreference } = require('../models');

exports.setPreferences = async (req, res) => {
  const userId = req.user.id;
  const { genre_preference, favorite_actors, favorite_directors } = req.body;

  try {
    let prefs = await MoviePreference.findOne({ where: { user_id: userId } });

    if (prefs) {
      prefs.genre_preference = genre_preference;
      prefs.favorite_actors = favorite_actors;
      prefs.favorite_directors = favorite_directors;
      await prefs.save();
    } else {
      prefs = await MoviePreference.create({
        user_id: userId,
        genre_preference,
        favorite_actors,
        favorite_directors
      });
    }

    res.status(200).json({ message: "Preferences saved", preferences: prefs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPreferences = async (req, res) => {
  const userId = req.user.id;

  try {
    const prefs = await MoviePreference.findOne({ where: { user_id: userId } });

    if (!prefs) {
      return res.status(404).json({ message: "No preferences found." });
    }

    res.status(200).json(prefs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
