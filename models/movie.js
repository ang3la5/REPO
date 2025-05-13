const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Movie = sequelize.define('Movie', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  genre: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  total_reviews: { type: DataTypes.INTEGER, defaultValue: 0 }, // optional, but useful
  type: {
    type: DataTypes.ENUM('movie', 'series'),
    allowNull: false,
    defaultValue: 'movie'
  }
});

module.exports = Movie;
