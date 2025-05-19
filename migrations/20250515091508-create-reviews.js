'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      comment: { type: Sequelize.TEXT },
      movie_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Movies', key: 'id' },
        onDelete: 'CASCADE'
      },
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
    await queryInterface.dropTable('Reviews');
  }
};
