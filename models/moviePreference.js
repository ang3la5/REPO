const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MoviePreference = sequelize.define('MoviePreference', {
  genre_preference: { type: DataTypes.STRING },
  favorite_actors: { type: DataTypes.TEXT },
  favorite_directors: { type: DataTypes.TEXT },
});

module.exports = MoviePreference;
