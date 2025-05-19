'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ListMovies', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      list_id: {
        type: Sequelize.INTEGER,
        references: { model: 'UserLists', key: 'id' },
        onDelete: 'CASCADE'
      },
      movie_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Movies', key: 'id' },
        onDelete: 'CASCADE'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ListMovies');
  }
};
