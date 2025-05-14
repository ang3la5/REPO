const { sequelize, Movie, Season, Episode } = require('../models');
const { fetchFullSeriesData } = require('../utils/tmdbFetcher');
const axios = require('axios');
require('dotenv').config();

const seriesTitles = [
  "Breaking Bad",
  "Stranger Things",
  "The Crown",
  "Dark",
  "Peaky Blinders"
];

const TMDB_KEY = process.env.TMDB_API_KEY;

(async () => {
  await sequelize.authenticate();
  console.log("✅ Connected to DB");

  for (const title of seriesTitles) {
    try {
      const exists = await Movie.findOne({ where: { title } });
      if (exists) {
        console.log(`⚠️ Skipping existing series: ${title}`);
        continue;
      }

      const series = await fetchFullSeriesData(title);
      if (!series) {
        console.log(`❌ Series not found: ${title}`);
        continue;
      }

      let collectedDirectors = new Set();
      for (let season of series.seasons.slice(0, 1)) {
        const seasonRes = await axios.get(
            `https://api.themoviedb.org/3/tv/${series.tmdb_id}/season/${season.season_number}?api_key=${TMDB_KEY}`
         );

         for (const ep of seasonRes.data.episodes.slice(0, 3)) {
    for (const crewMember of ep.crew) {
      if (crewMember.job === 'Director') {
        collectedDirectors.add(crewMember.name);
      }
    }
  }
}

series.directors = [...collectedDirectors].join(', ') || 'Unknown';

const savedSeries = await Movie.create(series);
        
      console.log(`📺 Imported series: ${title}`);

      for (const season of series.seasons) {
        const seasonRes = await axios.get(
          `https://api.themoviedb.org/3/tv/${series.tmdb_id}/season/${season.season_number}?api_key=${TMDB_KEY}`
        );

        const savedSeason = await Season.create({
          series_id: savedSeries.id,
          number: season.season_number,
          title: season.name
        });

        for (const ep of seasonRes.data.episodes) {
          await Episode.create({
            season_id: savedSeason.id,
            number: ep.episode_number,
            title: ep.name,
            description: ep.overview
          });
        }

        console.log(`  📦 Season ${season.season_number} imported (${season.episode_count} episodes)`);
      }

    } catch (err) {
      console.error(`❌ Error importing ${title}:`, err.message);
    }
  }

  console.log("✅ Batch import complete.");
  process.exit();
})();
