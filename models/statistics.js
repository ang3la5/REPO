const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Statistic = sequelize.define('Statistic', {
  total_reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
  total_ratings: { type: DataTypes.INTEGER, defaultValue: 0 },
  most_watched_genre: { type: DataTypes.STRING },
});

module.exports = Statistic;
