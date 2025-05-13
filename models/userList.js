const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserList = sequelize.define('UserList', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
});

module.exports = UserList;
