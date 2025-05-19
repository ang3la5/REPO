const axios = require('axios');
require('dotenv').config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const TMDB_GENRES = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  'Science Fiction': 878,
  'TV Movie': 10770,
  Thriller: 53,
  War: 10752,
  Western: 37,
};



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
  directors: full.data.credits.crew.filter(p => p.job === 'Director').map(d => d.name).join(', '),
  posterUrl: full.data.poster_path
    ? `https://image.tmdb.org/t/p/w500${full.data.poster_path}`
    : null
};

}

function getGenreIdByName(genreName) {
  return TMDB_GENRES[genreName] || null;
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
  posterUrl: full.data.poster_path
    ? `https://image.tmdb.org/t/p/w500${full.data.poster_path}`
    : null,
  seasons: full.data.seasons
};

}

async function getPersonIdByName(name) {
  try {
    const res = await axios.get(`https://api.themoviedb.org/3/search/person`, {
      params: {
        api_key: TMDB_API_KEY,
        query: name
      }
    });

    const results = res.data.results;
    if (results && results.length > 0) {
      return results[0].id;
    }

    return null;
  } catch (err) {
    console.error(`Error fetching person ID for "${name}":`, err.message);
    return null;
  }
}


module.exports = { fetchMovieByTitle, fetchFullSeriesData,  getPersonIdByName,  getGenreIdByName };
