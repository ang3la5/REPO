const axios = require('axios');
require('dotenv').config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: TMDB_API_KEY }
});

exports.searchTMDb = async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ message: "Missing query parameter" });

  try {
    const searchRes = await tmdb.get('/search/multi', { params: { query } });
    const results = searchRes.data.results.filter(r =>
      r.media_type === 'movie' || r.media_type === 'tv'
    ).slice(0, 6); // limit to 6 for performance

    // Fetch full details for each result
    const fullResults = await Promise.all(results.map(async (item) => {
      const type = item.media_type;
      const id = item.id;

      try {
        const detailRes = await tmdb.get(`/${type}/${id}`, {
          params: { append_to_response: 'credits' }
        });

        const data = detailRes.data;

        const genres = data.genres?.map(g => g.name) || [];
        const actors = data.credits?.cast?.slice(0, 5).map(a => a.name) || [];
        const directors = data.credits?.crew
          ?.filter(p => p.job === 'Director')
          .map(d => d.name) || [];

        return {
          id: data.id,
          title: data.title || data.name,
          description: data.overview,
          genre: genres,
          actors,
          directors,
          type,
          posterUrl: data.poster_path
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
            : null
        };
      } catch (err) {
        console.error(`Failed to fetch details for TMDb ${type} ${id}:`, err.message);
        return null;
      }
    }));

    const cleaned = fullResults.filter(r => r !== null);
    res.status(200).json(cleaned);

  } catch (err) {
    console.error('TMDb search failed:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getTVGenres = async (req, res) => {
  try {
    const tmdbRes = await axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_API_KEY}&language=en-US`);
    res.json(tmdbRes.data);
  } catch (err) {
    console.error('TMDb TV genres error:', err);
    res.status(500).json({ error: 'Failed to fetch TV genres' });
  }
};

exports.discoverTVByGenre = async (req, res) => {
  const genre = req.query.with_genres;
  try {
    const tmdbRes = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=${genre}&language=en-US`);
    res.json(tmdbRes.data);
  } catch (err) {
    console.error('TMDb discover TV error:', err);
    res.status(500).json({ error: 'Failed to fetch TV shows' });
  }
};


exports.getMovieGenres = async (req, res) => {
  try {
    const tmdbRes = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`);
    res.json(tmdbRes.data);
  } catch (err) {
    console.error('TMDb movie genres error:', err);
    res.status(500).json({ error: 'Failed to fetch movie genres' });
  }
};



exports.discoverMoviesByGenre = async (req, res) => {
  const genre = req.query.with_genres;
  try {
    const tmdbRes = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genre}&language=en-US`);
    res.json(tmdbRes.data);
  } catch (err) {
    console.error('TMDb discover movie error:', err);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};
