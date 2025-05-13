const { Season, Movie } = require('../models');

exports.createSeason = async (req, res) => {
  const { seriesId, number, title } = req.body;

  try {
    const series = await Movie.findByPk(seriesId);
    if (!series || series.type !== 'series') {
      return res.status(400).json({ message: "Invalid series ID or target is not a series." });
    }

    const season = await Season.create({ series_id: seriesId, number, title });
    res.status(201).json({ message: "Season created", season });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};