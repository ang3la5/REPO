import React from 'react';
import '../style/HomePage.css';
import {
  AppBar, Toolbar, Typography, Button, Box, Grid,
  Card, CardMedia, IconButton
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const trendingMovies = [
  { title: 'Dune', image: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg' },
  { title: 'Mandalorian', image: 'https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg' },
  { title: 'Oppenheimer', image: 'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg' },
  { title: 'Spider-Man: No Way Home', image: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg' },
  { title: 'Avatar: The Way of Water', image: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg' },
  { title: 'The Batman', image: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg' }
];

const trendingSeries = [
  { title: 'Stranger Things', image: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg' },
  { title: 'The Last of Us', image: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg' },
  { title: 'The Mandalorian', image: 'https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg' },
  { title: 'Game of Thrones', image: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg' },
  { title: 'Breaking Bad', image: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg' },
  { title: 'Loki', image: 'https://image.tmdb.org/t/p/w500/voHUmluYmKyleFkTu3lOXQG702u.jpg' }
];

const HomePage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'gr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Box className="homepage">
      <AppBar position="static" className="appbar" elevation={0}>
        <Toolbar className="toolbar">
          <Box display="flex" alignItems="center">
            <img src="/logo.png" alt="CineVerse Logo" className="logo-img" />
          </Box>

          <IconButton onClick={toggleLanguage} color="inherit">
            <LanguageIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box className="hero">
        <Typography variant="h4" className="hero-title">
          {t('homepage.hero')}
        </Typography>
        <Box mt={4}>
          <Button variant="contained" className="signup-button" onClick={() => navigate('/register')}>
            {t('signup')}
          </Button>
          <Button variant="outlined" className="login-button" onClick={() => navigate('/login')}>
            {t('login')}
          </Button>
        </Box>
      </Box>

      <Box className="trending-section">
        <Typography variant="h5" className="section-title">{t('trending.movies')}</Typography>
        <Grid container spacing={5}>
          {trendingMovies.map((movie) => (
            <Grid item xs={6} sm={3} md={2} key={movie.title}>
              <Card className="card">
                <CardMedia component="img" image={movie.image} alt={movie.title} className="card-media" />
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box className="space-section" />

        <Typography variant="h5" className="section-title">{t('trending.series')}</Typography>
        <Grid container spacing={5}>
          {trendingSeries.map((series) => (
            <Grid item xs={6} sm={3} md={2} key={series.title}>
              <Card className="card">
                <CardMedia component="img" image={series.image} alt={series.title} className="card-media" />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;
