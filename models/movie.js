const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Movie = sequelize.define('Movie', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  genre: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
});

module.exports = Movie;
