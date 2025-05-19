const { Movie, Season, Episode } = require('../models');
const { fetchFullSeriesData } = require('../utils/tmdbFetcher');
const axios = require('axios');
require('dotenv').config();

exports.importSeries = async (req, res) => {
  const { title } = req.query;
  if (!title) return res.status(400).json({ message: "Title is required" });

  try {
    const seriesData = await fetchFullSeriesData(title);
    if (!seriesData) return res.status(404).json({ message: "Series not found on TMDb" });

    const exists = await Movie.findOne({ where: { title: seriesData.title } });
    if (exists) return res.status(409).json({ message: "Series already exists in your database" });

    const series = await Movie.create(seriesData);

    // Logging info for debugging
    console.log(`Importing series: ${seriesData.title} (TMDb ID: ${seriesData.tmdb_id})`);

    // Handle seasons and episodes
    for (let seasonNum = 1; seasonNum <= seriesData.seasons.length; seasonNum++) {
      try {
        const seasonRes = await axios.get(
          `https://api.themoviedb.org/3/tv/${seriesData.tmdb_id}/season/${seasonNum}?api_key=${process.env.TMDB_API_KEY}`
        );

        const season = await Season.create({
          series_id: series.id,
          number: seasonNum,
          title: seasonRes.data.name || `Season ${seasonNum}`
        });

        if (Array.isArray(seasonRes.data.episodes)) {
          for (const ep of seasonRes.data.episodes) {
            await Episode.create({
              season_id: season.id,
              number: ep.episode_number,
              title: ep.name || `Episode ${ep.episode_number}`,
              description: ep.overview || ''
            });
          }
        }
      } catch (err) {
        console.error(`⚠️ Failed to import Season ${seasonNum}: ${err.message}`);
        // Continue with next season
      }
    }

    return res.status(201).json({
      message: "✅ Series imported with available seasons and episodes",
      series
    });

  } catch (error) {
    console.error('❌ importSeries error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};