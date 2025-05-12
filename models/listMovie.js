const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ListMovie = sequelize.define('ListMovie', {
  list_id: { type: DataTypes.INTEGER, allowNull: false },
  movie_id: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = ListMovie;
