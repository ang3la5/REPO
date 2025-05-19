import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import {
  AppBar, Toolbar, IconButton, Button, Typography,
  Select, MenuItem, Box, Grid, Card, CardMedia, CardContent
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../style/SeriesPage.css';

const SeriesPage = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [series, setSeries] = useState([]);

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'gr' : 'en';
    i18n.changeLanguage(newLang);
  };

  // Fetch TV genres on mount
  useEffect(() => {
    axios.get('/tmdb/genres/tv')
      .then(res => setGenres(res.data.genres))
      .catch(err => console.error('Failed to fetch TV genres:', err));
  }, []);

  // Fetch series when genre changes
  useEffect(() => {
    if (selectedGenre) {
      axios.get(`/tmdb/discover/tv?with_genres=${selectedGenre}`)
        .then(res => setSeries(res.data.results))
        .catch(err => console.error('Failed to fetch series:', err));
    }
  }, [selectedGenre]);

  const handleClick = async (item) => {
    const title = item.name;
    try {
      // Try importing
      await axios.post(`/series/import-series?title=${encodeURIComponent(title)}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (err) {
      if (err.response?.status !== 409) {
        console.error('Import failed:', err);
        alert('Import failed');
        return;
      }
    }

    // Fetch local DB entry
    try {
      const res = await axios.get(`/movies?search=${encodeURIComponent(title)}`);
      const match = res.data.find(m =>
        (m.title || '').toLowerCase().trim() === title.toLowerCase().trim()
      );
      if (match) {
        navigate(`/series/${match.id || match._id}`);
      } else {
        alert('Imported but not found in local DB');
      }
    } catch (err) {
      alert('Failed to find show in local DB');
    }
  };

  return (
    <Box className="series-layout">
      <AppBar position="fixed" className="series-header">
        <Toolbar className="series-toolbar">
          <img src="/logo.png" alt="Logo" className="series-logo" />
          <Box>
            <Button color="inherit" href="/user-home">{t('home')}</Button>
            <Button color="inherit" href="/movies">{t('movies')}</Button>
            <Button color="inherit" href="/series">{t('series')}</Button>
            <Button color="inherit" href="/profile">{t('profile')}</Button>
            <Button color="inherit" href="/contact">{t('contact')}</Button>
            <Button color="inherit" href="/logout">{t('logout')}</Button>
            <IconButton onClick={toggleLanguage} color="inherit" className="language-toggle">
              <LanguageIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box className="series-page">
        <Box className="series-container">
          <Typography variant="h4" className="series-title">
            {t('Browse TV Shows by Genre')}
          </Typography>

          <Select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            fullWidth
            displayEmpty
            sx={{ mb: 3 }}
          >
            <MenuItem value="" disabled>{t('Select a genre')}</MenuItem>
            {genres.map((g) => (
              <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
            ))}
          </Select>

          <Grid container spacing={2}>
            {series.map((show) => (
              <Grid item xs={12} sm={6} md={3} key={show.id}>
                <Card onClick={() => handleClick(show)} sx={{ cursor: 'pointer' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                    alt={show.name}
                  />
                  <CardContent>
                    <Typography variant="subtitle1" noWrap>
                      {show.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <footer className="series-footer">
        <Typography variant="body2">© 2025 CineVerse</Typography>
      </footer>
    </Box>
  );
};

export default SeriesPage;
