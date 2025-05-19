'use strict';


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Episodes', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      number: { type: Sequelize.INTEGER, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      season_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Seasons', key: 'id' },
        onDelete: 'CASCADE'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Episodes');
  }
};