const sequelize = require('../config/database');
const User = require('./user');
const Movie = require('./movie');
const UserList = require('./userList');
const ListMovie = require('./listMovie');
const Review = require('./review');
const MoviePreference = require('./moviePreference');
const Statistic = require('./statistics');

// Relationships
User.hasMany(UserList, { foreignKey: 'user_id' });
UserList.belongsTo(User);

UserList.belongsToMany(Movie, { through: 'ListMovie', foreignKey: 'list_id' });
Movie.belongsToMany(UserList, { through: 'ListMovie', foreignKey: 'movie_id' });

User.hasMany(Review, { foreignKey: 'user_id' });
Movie.hasMany(Review, { foreignKey: 'movie_id' });
Review.belongsTo(User);
Review.belongsTo(Movie);

User.hasOne(MoviePreference, { foreignKey: 'user_id' });
MoviePreference.belongsTo(User);

User.hasOne(Statistic, { foreignKey: 'user_id' });
Statistic.belongsTo(User);

module.exports = {
  User,
  Movie,
  UserList,
  ListMovie,
  Review,
  MoviePreference,
  Statistic,
  sequelize,
};
