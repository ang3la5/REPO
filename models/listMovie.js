const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ListMovie = sequelize.define('ListMovie', {
  // You can add extra metadata if you want, like:
  // addedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = ListMovie;
