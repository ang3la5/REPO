const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserList = sequelize.define('UserList', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.STRING,
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});


module.exports = UserList;
