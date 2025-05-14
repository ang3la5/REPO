const { Movie, Season, Episode } = require('../models');
const { fetchSeriesByTitle } = require('../utils/tmdbFetcher');
const axios = require('axios');
require('dotenv').config();

exports.importSeries = async (req, res) => {
  const { title } = req.query;
  if (!title) return res.status(400).json({ message: "Title required" });

  try {
    const seriesData = await fetchSeriesByTitle(title);
    if (!seriesData) return res.status(404).json({ message: "Series not found" });

    const exists = await Movie.findOne({ where: { title: seriesData.title } });
    if (exists) return res.status(409).json({ message: "Series already exists" });

    const series = await Movie.create(seriesData);

    // Fetch and insert all seasons and episodes
    for (let seasonNum = 1; seasonNum <= seriesData.season_count; seasonNum++) {
      const seasonRes = await axios.get(
        `https://api.themoviedb.org/3/tv/${seriesData.id}/season/${seasonNum}?api_key=${process.env.TMDB_API_KEY}`
      );

      const season = await Season.create({
        series_id: series.id,
        number: seasonNum,
        title: seasonRes.data.name || `Season ${seasonNum}`
      });

      for (const ep of seasonRes.data.episodes) {
        await Episode.create({
          season_id: season.id,
          number: ep.episode_number,
          title: ep.name,
          description: ep.overview
        });
      }
    }

    res.status(201).json({ message: "Series imported with seasons and episodes", series });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
