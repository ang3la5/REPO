'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      username: { type: Sequelize.STRING, allowNull: false, unique: true },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.ENUM('user', 'admin'), defaultValue: 'user' },
      avatarUrl: { type: Sequelize.STRING },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Users');
  }
};
