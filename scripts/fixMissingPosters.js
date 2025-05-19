// scripts/fixMissingPosters.js
const { Movie } = require('../models');
const axios = require('axios');
require('dotenv').config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const fetchPoster = async (title, type) => {
  try {
    const searchType = type === 'series' ? 'tv' : 'movie';
    const searchRes = await axios.get(`https://api.themoviedb.org/3/search/${searchType}`, {
      params: { api_key: TMDB_API_KEY, query: title }
    });

    if (!searchRes.data.results.length) return null;
    const match = searchRes.data.results[0];
    return match.poster_path ? `https://image.tmdb.org/t/p/w500${match.poster_path}` : null;
  } catch (err) {
    console.error(`Error fetching poster for "${title}":`, err.message);
    return null;
  }
};

(async () => {
  try {
    const movies = await Movie.findAll({ where: { posterUrl: null } });
    console.log(`Found ${movies.length} movies with missing posters.`);

    for (const movie of movies) {
      const posterUrl = await fetchPoster(movie.title, movie.type);
      if (posterUrl) {
        movie.posterUrl = posterUrl;
        await movie.save();
        console.log(`✅ Updated: ${movie.title}`);
      } else {
        console.log(`❌ Skipped: ${movie.title} (poster not found)`);
      }
    }

    console.log('✅ Poster update complete.');
    process.exit();
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
})();
