'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Movies', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      genre: { type: Sequelize.STRING, allowNull: false },
      rating: { type: Sequelize.FLOAT, defaultValue: 0 },
      total_reviews: { type: Sequelize.INTEGER, defaultValue: 0 },
      type: { type: Sequelize.ENUM('movie', 'series'), allowNull: false, defaultValue: 'movie' },
      actors: { type: Sequelize.STRING },
      directors: { type: Sequelize.STRING },
      posterUrl: { type: Sequelize.STRING },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Movies');
  }
};
