// Example: 20250515091001-create-users.js

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


// 20250515091002-create-movies.js

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


// 20250515091003-create-reviews.js

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


// 20250515091004-create-userlists.js

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserLists', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
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
    await queryInterface.dropTable('UserLists');
  }
};


// 20250515091005-create-moviepreferences.js

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MoviePreferences', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      genre_preference: { type: Sequelize.STRING },
      favorite_actors: { type: Sequelize.STRING },
      favorite_directors: { type: Sequelize.STRING },
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
    await queryInterface.dropTable('MoviePreferences');
  }
};