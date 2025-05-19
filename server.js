// server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Use direct sequelize import
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const seriesRoutes = require('./routes/seriesRoutes');
const preferenceRoutes = require('./routes/preferenceRoutes');
const listRoutes = require('./routes/listRoutes');
const statRoutes = require('./routes/statRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const seriesImportRoutes = require('./routes/seriesImportRoutes');
const seasonRoutes = require('./routes/seasonRoutes');
const episodeRoutes = require('./routes/episodeRoutes');
const movieImportRoutes = require('./routes/movieImportRoutes');
const tmdbRoutes = require('./routes/tmdbRoutes');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection and Synchronization
(async () => {
  try {
    await sequelize.authenticate();
console.log("✅ MySQL connection established (Sequelize)");

  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
})();

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/stats', statRoutes);
app.use('/api/movies', recommendationRoutes); 
app.use('/api/series', seriesImportRoutes);
app.use('/api/seasons', seasonRoutes);
app.use('/api/episodes', episodeRoutes);
app.use('/api/movies', movieImportRoutes);
app.use('/api/tmdb', tmdbRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
