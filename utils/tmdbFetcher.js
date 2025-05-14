const axios = require('axios');
require('dotenv').config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: TMDB_API_KEY }
});

// Fetch movie by title
async function fetchMovieByTitle(title) {
  const res = await tmdb.get('/search/movie', {
    params: { query: title }
  });

  if (!res.data.results.length) return null;

  const movie = res.data.results[0];

  // Get full details (includes genres, runtime, etc.)
  const full = await tmdb.get(`/movie/${movie.id}`, {
    params: { append_to_response: 'credits' }
  });

  return {
    title: full.data.title,
    description: full.data.overview,
    genre: full.data.genres.map(g => g.name).join(', '),
    type: 'movie',
    actors: full.data.credits.cast.slice(0, 5).map(a => a.name).join(', '),
    directors: full.data.credits.crew.filter(p => p.job === 'Director').map(d => d.name).join(', ')
  };
}

async function fetchFullSeriesData(title) {
  const search = await tmdb.get('/search/tv', {
    params: { query: title }
  });

  if (!search.data.results.length) return null;

  const series = search.data.results[0];

  const full = await tmdb.get(`/tv/${series.id}`, {
    params: { append_to_response: 'credits,seasons' }
  });

  return {
    tmdb_id: series.id,
    title: full.data.name,
    description: full.data.overview,
    genre: full.data.genres.map(g => g.name).join(', ') || 'Unknown',
    type: 'series',
    actors: full.data.credits.cast.slice(0, 5).map(a => a.name).join(', '),
    directors: full.data.credits.crew.filter(p => p.job === 'Director').map(d => d.name).join(', '),
    seasons: full.data.seasons
  };
}


module.exports = { fetchMovieByTitle, fetchFullSeriesData };
