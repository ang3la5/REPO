import React, { useEffect, useState } from 'react';
import {
  TextField, Box, Typography, Container,
  Grid, Card, CardMedia, CardContent,
  AppBar, Toolbar, Button, InputAdornment, IconButton
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import axios from '../api/axios';
import '../style/UserHomePage.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useTranslation } from 'react-i18next';

const UserHomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [recommendedTV, setRecommendedTV] = useState([]);
  const [date, setDate] = useState(new Date());
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'gr' : 'en';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('TOKEN USED:', token);
        const res = await axios.get('/movies/suggestions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('📦 Backend recommendations:', res.data); // <-- ADD THIS
        setRecommendedMovies(res.data.movies || []);
        setRecommendedTV(res.data.tvShows || []);
        setFilteredResults(res.data.movies || []); // default to movies if no search
      } catch (err) {
        console.error('Failed to load personalized recommendations:', err);
      }
    };

    fetchRecommendations();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResults(suggestions);
      return;
    }

    const fetchSearch = async () => {
      try {
        const res = await axios.get(`/movies?search=${encodeURIComponent(searchTerm)}`);
        if (res.data.length > 0) {
          setFilteredResults(res.data);
        } else {
          const tmdbRes = await axios.get(`/tmdb/search?query=${encodeURIComponent(searchTerm)}`);
          setFilteredResults(tmdbRes.data);
        }
      } catch (err) {
        console.error('Search failed:', err);
      }
    };

    fetchSearch();
  }, [searchTerm, suggestions]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

 const handleMovieClick = async (item) => {
  try {
    const isTV = item.media_type === 'tv' || item.type === 'tv' || item.first_air_date;

    // Determine endpoint and display title
    const title = item.name || item.title;
    const importEndpoint = isTV
      ? `/series/import-series?title=${encodeURIComponent(title)}`
      : `/movies/import?title=${encodeURIComponent(title)}`;

    // Attempt import
    try {
      await axios.post(importEndpoint, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (err) {
      if (err.response?.status !== 409) throw err; // 409 = already exists
    }

    // Search in your local DB
    const searchRes = await axios.get(`/movies?search=${encodeURIComponent(title)}`);
    const match = searchRes.data.find(m =>
      (m.title || '').toLowerCase().trim() === title.toLowerCase().trim()
    );

    if (match) {
      const detailPath = match.type === 'series' ? 'series' : 'movie';
      navigate(`/${detailPath}/${match.id || match._id}`);
    } else {
      alert('Imported successfully but could not find it in the local DB.');
    }

  } catch (err) {
    console.error('Import failed:', err.response?.data || err.message);
    alert('Import failed: ' + (err.response?.data?.message || err.message));
  }
};



  return (
    <Box className="user-home-page fade-in">
      <AppBar position="static" className="appbar">
        <Toolbar>
          <Link to="/user-home">
            <img src="/logo.png" alt="CineVerse Logo" className="logo-img fade-in" />
          </Link>
          <Box>
            <Button color="inherit" onClick={() => navigate('/movies')}>{t('Movies')}</Button>
            <Button color="inherit" onClick={() => navigate('/series')}>{t('Series')}</Button>
            <Button color="inherit" onClick={() => navigate('/profile')}>{t('Profile')}</Button>
            <Button color="inherit" onClick={() => navigate('/contact')}>{t('Contact')}</Button>
            <Button color="inherit" onClick={() => navigate('/leaderboard')}>{t('Leaderboard')}</Button>
            <Button color="inherit" onClick={handleLogout}>{t('logout')}</Button>
            <IconButton color="inherit" onClick={toggleLanguage}>
              <LanguageIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <div className="hero">
        <h1 className="typewriter">{t('Search movies & Discover your next watch')}</h1>

        <div className="search-and-calendar">
          <div className="search-bar-container">
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: 30,
                  backgroundColor: '#ffffffcc'
                }
              }}
            />
          </div>

          <div className="calendar-wrapper">
            <Typography variant="subtitle1" align="center" gutterBottom>📅 {t('Pick a day')}</Typography>
            <Calendar onChange={setDate} value={date} locale={i18n.language === 'gr' ? 'el-GR' : 'en-US'} />
          </div>
        </div>
      </div>

      <Container maxWidth="lg">
        {searchTerm ? (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {t('search_results')}
            </Typography>
            <Grid container spacing={3}>
              {filteredResults.map((movie) => (
                <Grid item xs={6} sm={4} md={3} key={movie._id || movie.id}>
                  <Card onClick={() => handleMovieClick(movie)} className="movie-card">
                    <CardMedia
                      component="img"
                      height="300"
                      image={movie.posterUrl || 'https://via.placeholder.com/300x450'}
                      alt={movie.title || movie.name}
                    />
                    <CardContent>
                      <Typography variant="subtitle1">{movie.title || movie.name}</Typography>
                      <Typography variant="body2">
                        {Array.isArray(movie.genre)
                          ? movie.genre.join(', ')
                          : movie.genre || t('unknown_genre')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <>{!recommendedMovies.length && !recommendedTV.length && (
  <Typography variant="body1" align="center" mt={4}>
    {t('No personalized recommendations yet.')}
  </Typography>
)}

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              🎬 {t('Recommended Movies')}
            </Typography>
            <Grid container spacing={3}>
              {recommendedMovies.map((movie) => (
                <Grid item xs={6} sm={4} md={3} key={`movie-${movie.id}`}>
                  <Card onClick={() => handleMovieClick(movie)} className="movie-card">
                    <CardMedia
                      component="img"
                      height="300"
                      image={movie.posterUrl || 'https://via.placeholder.com/300x450'}
                      alt={movie.title}
                    />
                    <CardContent>
                      <Typography variant="subtitle1">{movie.title}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h5" fontWeight="bold" gutterBottom style={{ marginTop: '2rem' }}>
              📺 {t('Recommended TV Shows')}
            </Typography>
            <Grid container spacing={3}>
              {recommendedTV.map((show) => (
                <Grid item xs={6} sm={4} md={3} key={`tv-${show.id}`}>
                  <Card onClick={() => handleMovieClick(show)} className="movie-card">
                    <CardMedia
                      component="img"
                      height="300"
                      image={show.posterUrl || 'https://via.placeholder.com/300x450'}
                      alt={show.title}
                    />
                    <CardContent>
                      <Typography variant="subtitle1">{show.title}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default UserHomePage;
