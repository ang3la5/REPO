// server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Use direct sequelize import
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection and Synchronization
(async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL Connected with Sequelize");
    await sequelize.sync({ alter: true });
    console.log("Database synchronized");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
})();

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
