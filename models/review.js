const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Review = sequelize.define('Review', {
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT },
  movie_id: { type: DataTypes.INTEGER, allowNull: false },  // 👈 add this
  user_id: { type: DataTypes.INTEGER, allowNull: false }    // 👈 add this
}, {
  timestamps: true
});



module.exports = Review;
