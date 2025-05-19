'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserLists', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      isDefault: { type: Sequelize.BOOLEAN, defaultValue: false }, 
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
     await queryInterface.removeColumn('UserLists', 'isDefault');
    await queryInterface.removeColumn('UserLists', 'description');
  }
};