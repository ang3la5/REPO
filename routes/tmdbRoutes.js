const express = require('express');
const axios = require('axios');
const {
  searchTMDb,
  getMovieGenres,
  discoverMoviesByGenre,
  getTVGenres,
  discoverTVByGenre
} = require('../controllers/tmdbController');


const router = express.Router();
router.get('/search', searchTMDb);
// GET /api/tmdb/genres
router.get('/genres', async (req, res) => {
  const resTMDb = await axios.get(`https://api.themoviedb.org/3/genre/movie/list`, {
    params: { api_key: process.env.TMDB_API_KEY, language: 'en-US' }
  });
  res.json(resTMDb.data);
});


// GET /tmdb/people?query=Tom
router.get('/people', async (req, res) => {
  const query = req.query.query;

  if (!query) return res.status(400).json({ error: 'Missing query parameter' });

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/person`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query,
        language: 'en-US',
        page: 1
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error('TMDB person search failed:', err.message);
    res.status(500).json({ error: 'Failed to search people from TMDB' });
  }
});

router.get('/search/series', async (req, res) => {
  const query = req.query.query;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/tv`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error('TMDb search series error:', err);
    res.status(500).json({ error: 'Failed to search series' });
  }
});

router.get('/genres/movie', getMovieGenres);
router.get('/discover/movie', discoverMoviesByGenre);


router.get('/genres/tv', getTVGenres);
router.get('/discover/tv', discoverTVByGenre);


module.exports = router;
