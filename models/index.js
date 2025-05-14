const sequelize = require('../config/database');
const User = require('./user');
const Movie = require('./movie');
const UserList = require('./userList');
const ListMovie = require('./listMovie');
const Review = require('./review');
const MoviePreference = require('./moviePreference');
const Statistic = require('./statistics');
const Season = require('./season');
const Episode = require('./episode');

// Relationships
User.hasMany(UserList, { foreignKey: 'user_id', as: 'lists' });
UserList.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

UserList.belongsToMany(Movie, { through: ListMovie, foreignKey: 'list_id', as: 'movies' });
Movie.belongsToMany(UserList, { through: ListMovie, foreignKey: 'movie_id', as: 'lists' });


User.hasMany(Review, { foreignKey: 'user_id' });
Movie.hasMany(Review, { foreignKey: 'movie_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id' });
Review.belongsTo(Movie, { foreignKey: 'movie_id', as: 'movie' });


Movie.hasMany(Season, { foreignKey: 'series_id', as: 'seasons' });
Season.belongsTo(Movie, { foreignKey: 'series_id', as: 'series' });
Season.hasMany(Episode, { foreignKey: 'season_id', as: 'episodes' });
Episode.belongsTo(Season, { foreignKey: 'season_id', as: 'season' });

User.hasOne(MoviePreference, { foreignKey: 'user_id', as: 'preferences' });
MoviePreference.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

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
  Season,
  Episode,
  sequelize
};
