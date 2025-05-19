const { Movie, Review, MoviePreference } = require('../models');
const { Op } = require('sequelize');
const axios = require('axios');
const { getPersonIdByName, getGenreIdByName } = require('../utils/tmdbFetcher');

const TMDB_API_KEY = process.env.TMDB_API_KEY;

exports.getRecommendations = async (req, res) => {
  const userId = req.user.id;

  try {
    const prefs = await MoviePreference.findOne({ where: { user_id: userId } });
    console.log('Raw prefs:', prefs);

    const userReviews = await Review.findAll({
      where: { user_id: userId },
      include: [{ model: Movie, as: 'movie', attributes: ['genre', 'title'] }]
    });

    const reviewedTitles = userReviews.map(r =>
      r.movie?.title?.toLowerCase().trim()
    ).filter(Boolean);

    const genreCount = {};
    userReviews.forEach(r => {
      const g = r.movie?.genre;
      if (g) genreCount[g] = (genreCount[g] || 0) + 1;
    });

    let topGenre = null;
    let maxCount = 0;
    for (const g in genreCount) {
      if (genreCount[g] > maxCount) {
        topGenre = g;
        maxCount = genreCount[g];
      }
    }

    // 🎯 Resolve genres
    const genreIds = [];
    const userGenres = prefs?.genre_preference?.split(',').map(g => g.trim()) || [];
    for (const g of userGenres) {
      const id = getGenreIdByName(g);
      if (id && !genreIds.includes(id)) genreIds.push(id);
    }

    const topGenreId = getGenreIdByName(topGenre);
    if (topGenreId && !genreIds.includes(topGenreId)) {
      genreIds.push(topGenreId);
    }

    // 👥 Resolve people
    const actorNames = prefs?.favorite_actors?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const directorNames = prefs?.favorite_directors?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const allNames = [...actorNames, ...directorNames];
    const peopleIds = [];

    for (const name of allNames) {
      const id = await getPersonIdByName(name);
      if (id) peopleIds.push(id);
    }

    console.log('Genres:', genreIds);
    console.log('People:', peopleIds);
    console.log('Reviewed titles:', reviewedTitles);

    const baseParams = {
      api_key: TMDB_API_KEY,
      sort_by: 'popularity.desc',
      language: 'en-US',
      page: 1
    };

    const filteredParams = { ...baseParams };
    if (genreIds.length) filteredParams.with_genres = genreIds.join(',');
    if (peopleIds.length) filteredParams.with_people = peopleIds.join(',');

    const [movieRes, tvRes] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/discover/movie`, { params: filteredParams }),
      axios.get(`https://api.themoviedb.org/3/discover/tv`, { params: filteredParams })
    ]);

    const scoreResults = (items, isTV = false) => {
      return (items || []).map(item => {
        const title = (item.title || item.name || '').toLowerCase().trim();
        if (reviewedTitles.includes(title)) return null;

        const genreScore = item.genre_ids?.reduce((sum, id) => sum + (genreIds.includes(id) ? 2 : 0), 0) || 0;
        const personScore = peopleIds.length ? 3 : 0; // basic weight if people matched in query

        const score = genreScore + personScore;

        return {
          id: item.id,
          title: isTV ? item.name : item.title,
          posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
          type: isTV ? 'tv' : 'movie',
          score,
          popularity: item.popularity || 0
        };
      }).filter(Boolean).sort((a, b) => b.score - a.score || b.popularity - a.popularity).slice(0, 10);
    };

    let recommendedMovies = scoreResults(movieRes.data.results);
    let recommendedTV = scoreResults(tvRes.data.results, true);

    // 🔁 Fallback: genre only
    if (!recommendedMovies.length && genreIds.length) {
      const genreOnlyParams = { ...baseParams, with_genres: genreIds.join(',') };
      const fallbackMovieRes = await axios.get(`https://api.themoviedb.org/3/discover/movie`, { params: genreOnlyParams });
      recommendedMovies = scoreResults(fallbackMovieRes.data.results);
    }

    if (!recommendedTV.length && genreIds.length) {
      const genreOnlyParams = { ...baseParams, with_genres: genreIds.join(',') };
      const fallbackTVRes = await axios.get(`https://api.themoviedb.org/3/discover/tv`, { params: genreOnlyParams });
      recommendedTV = scoreResults(fallbackTVRes.data.results, true);
    }

    if (!recommendedMovies.length) {
      const fallbackMovieRes = await axios.get(`https://api.themoviedb.org/3/discover/movie`, { params: baseParams });
      recommendedMovies = scoreResults(fallbackMovieRes.data.results);
    }

    if (!recommendedTV.length) {
      const fallbackTVRes = await axios.get(`https://api.themoviedb.org/3/discover/tv`, { params: baseParams });
      recommendedTV = scoreResults(fallbackTVRes.data.results, true);
    }

    res.json({ movies: recommendedMovies, tvShows: recommendedTV });

  } catch (err) {
    console.error('TMDb recommendation error:', err.message);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
};
