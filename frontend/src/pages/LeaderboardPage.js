// 📁 pages/LeaderboardPage.js
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import {
  Container, Typography, Card, CardContent, Avatar, Box, CircularProgress
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {
  AppBar, Toolbar, Button, IconButton
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { Link, useNavigate  } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../style/LeaderboardPage.css';


const LeaderboardPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleLanguage = () => {
  const newLang = i18n.language === 'en' ? 'gr' : 'en';
  i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('/users/leaderboard/reviews');
        setTopUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const medalColor = (index) => {
    return ['gold', 'silver', 'bronze'][index] || 'gray';
  };

  return (
    <Box className="profile-page fade-in">
          <AppBar position="static" className="leaderboard-appbar">
        <Toolbar className="leaderboard-toolbar">
          <Link to="/user-home">
            <img src="/logo.png" alt="CineVerse Logo" className="logo-img fade-in" />
          </Link>
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
    <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography className="leaderboard-title">
        🏆 {t('leaderboard.title')}
        </Typography>


      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        topUsers.map((user, index) => (
          <Card key={user.id} className="leaderboard-card">
            <Box sx={{ pl: 2 }}>
              <EmojiEventsIcon style={{ color: medalColor(index) }} />
            </Box>
            <Avatar
              src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}`} 
              alt={user.username}
              sx={{ width: 56, height: 56 }}
            />
            <CardContent>
              <Typography variant="h6">{user.username}</Typography>
              <Typography variant="body2">
                {t('leaderboard.reviews')}: {user.reviewCount} | {t('leaderboard.level')}: {user.level}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
    </Box>
  );
};

export default LeaderboardPage;
