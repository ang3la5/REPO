'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Seasons', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      number: { type: Sequelize.INTEGER, allowNull: false },
      title: { type: Sequelize.STRING },
      series_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Movies', key: 'id' },
        onDelete: 'CASCADE'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Seasons');
  }
};