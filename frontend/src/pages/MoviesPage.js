import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import {
  Box, AppBar, Toolbar, Button, IconButton, Typography,
  Select, MenuItem, Grid, Card, CardMedia, CardContent
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../style/MoviesPage.css';

const MoviesPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [movies, setMovies] = useState([]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'gr' : 'en';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    axios.get('/tmdb/genres/movie')
      .then(res => setGenres(res.data.genres))
      .catch(err => console.error('Genre fetch failed:', err));
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      axios.get(`/tmdb/discover/movie?with_genres=${selectedGenre}`)
        .then(res => setMovies(res.data.results))
        .catch(err => console.error('Movie fetch failed:', err));
    }
  }, [selectedGenre]);

  const handleClick = async (item) => {
  const title = item.title;

  try {
    await axios.post(`/movies/import?title=${encodeURIComponent(title)}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  } catch (err) {
    if (err.response?.status !== 409) {
      console.error('Import failed:', err);
      alert('Import failed');
      return;
    }
  }

  try {
    const res = await axios.get(`/movies?search=${encodeURIComponent(title)}`);
    const match = res.data.find(m =>
      (m.title || '').toLowerCase().trim() === title.toLowerCase().trim()
    );
    if (match) {
      navigate(`/movie/${match.id}`);
    } else {
      alert('Imported but not found in local DB');
    }
  } catch (err) {
    console.error('Search error:', err);
    alert('Failed to find movie in local DB');
  }
};

  return (
    <>
      <AppBar position="fixed" className="movies-header">
        <Toolbar className="movies-toolbar">
          <Box display="flex" alignItems="center">
            <img src="/logo.png" alt="CineVerse Logo" className="movies-logo" />
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Button color="inherit" onClick={() => navigate('/user-home')}>{t('home')}</Button>
            <Button color="inherit" onClick={() => navigate('/movies')}>{t('movies')}</Button>
            <Button color="inherit" onClick={() => navigate('/series')}>{t('series')}</Button>
            <Button color="inherit" onClick={() => navigate('/profile')}>{t('profile')}</Button>
            <Button color="inherit" onClick={() => navigate('/contact')}>{t('contact')}</Button>
            <Button color="inherit" onClick={() => navigate('/leaderboard')}>{t('leaderboard.title')}</Button>
            <Button color="inherit" onClick={() => navigate('/logout')}>{t('logout')}</Button>
            <IconButton onClick={toggleLanguage} color="inherit">
              <LanguageIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box className="movies-layout">
        <Box className="movies-page">
          <Typography variant="h4">{t('browseByGenre')}</Typography>
          <Select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            fullWidth
            sx={{ my: 2 }}
          >
            <MenuItem value="" disabled>{t('Select a genre')}</MenuItem>
            {genres.map(g => (
              <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
            ))}
          </Select>

          <Grid container spacing={2}>
            {movies.map(movie => (
              <Grid item xs={12} sm={6} md={3} key={movie.id}>
                <Card onClick={() => handleClick(movie)} sx={{ cursor: 'pointer' }}>
                  <CardMedia
                    component="img"
                    image={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <CardContent>
                    <Typography>{movie.title}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default MoviesPage;
