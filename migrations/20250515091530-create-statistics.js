'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Statistics', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      total_reviews: { type: Sequelize.INTEGER, defaultValue: 0 },
      total_ratings: { type: Sequelize.INTEGER, defaultValue: 0 },
      most_watched_genre: { type: Sequelize.STRING },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Statistics');
  }
};