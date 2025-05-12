const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Correct import

const UserList = sequelize.define('UserList', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
});

module.exports = UserList;
