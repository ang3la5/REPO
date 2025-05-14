const { sequelize, Movie } = require('../models');
const { fetchMovieByTitle } = require('../utils/tmdbFetcher');
require('dotenv').config();

const movieTitles = [
  "La La Land"
];

(async () => {
  await sequelize.authenticate();
  console.log("✅ Connected to database");

  for (const title of movieTitles) {
    try {
      const exists = await Movie.findOne({ where: { title } });
      if (exists) {
        console.log(`⚠️ Skipping: "${title}" already exists`);
        continue;
      }

      const movie = await fetchMovieByTitle(title);
      if (!movie) {
        console.log(`❌ Not found on TMDb: "${title}"`);
        continue;
      }

      await Movie.create(movie);
      console.log(`✅ Imported: "${title}"`);
    } catch (err) {
      console.error(`❌ Failed to import "${title}":`, err.message);
    }
  }

  console.log("🎬 Movie batch import complete.");
  process.exit();
})();
