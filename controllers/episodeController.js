const { Episode, Season } = require('../models');

exports.createEpisode = async (req, res) => {
  const { seasonId, number, title, description } = req.body;

  try {
    const season = await Season.findByPk(seasonId);
    if (!season) {
      return res.status(400).json({ message: "Invalid season ID." });
    }

    const episode = await Episode.create({ season_id: seasonId, number, title, description });
    res.status(201).json({ message: "Episode created", episode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};