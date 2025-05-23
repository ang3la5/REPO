const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email:    { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role:     { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },

  // ✅ Add this line:
  avatarUrl: { type: DataTypes.STRING, allowNull: true }
}, {
  timestamps: true,
});

module.exports = User;
