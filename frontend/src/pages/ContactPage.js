import React from 'react';
import {
  TextField, Box, Typography, Container, AppBar, Toolbar, Button, IconButton
} from '@mui/material';
import '../style/ContactPage.css';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import LanguageIcon from '@mui/icons-material/Language';

const ContactPage = () => {
  const { t,i18n  } = useTranslation();
  const navigate = useNavigate();

const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'gr' : 'en';
    i18n.changeLanguage(newLang);
};

  return (
    <div className="contact-page">
      <AppBar position="fixed" className="contact-header">
        <Toolbar className="contact-toolbar">
          <Link to="/user-home">
            <img src="/logo.png" alt="CineVerse Logo" className="contact-logo" />
          </Link>
          <Box display="flex" alignItems="center" gap={2} sx={{ flexWrap: 'wrap' }}>
            <Button color="inherit" onClick={() => navigate('/user-home')}>{t('home')}</Button>
            <Button color="inherit" onClick={() => navigate('/movies')}>{t('movies')}</Button>
            <Button color="inherit" onClick={() => navigate('/series')}>{t('series')}</Button>
            <Button color="inherit" onClick={() => navigate('/profile')}>{t('profile')}</Button>
            <Button color="inherit" onClick={() => navigate('/contact')}>{t('contact')}</Button>
            <Button color="inherit" onClick={() => navigate('/leaderboard')}>{t('leaderboard.title')}</Button>
            <Button color="inherit" onClick={() => navigate('/logout')}>{t('logout')}</Button>
            <IconButton onClick={toggleLanguage} color="inherit" className="language-toggle" sx={{ ml: 1 }}>
              <LanguageIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" className="contact-container">
        <Typography variant="h4" className="contact-title">
          📬 {t('contacts.title')}
        </Typography>
        <Typography variant="body1" className="contact-subtitle">
          {t('contacts.subtitle')}
        </Typography>

        <Box component="form" className="contact-form">
          <TextField
            label={t('contacts.name')}
            variant="outlined"
            fullWidth
            required
            className="contact-input"
          />
          <TextField
            label={t('contacts.email')}
            type="email"
            variant="outlined"
            fullWidth
            required
            className="contact-input"
          />
          <TextField
            label={t('contacts.subject')}
            variant="outlined"
            fullWidth
            className="contact-input"
          />
          <TextField
            label={t('contacts.message')}
            variant="outlined"
            multiline
            rows={5}
            fullWidth
            required
            className="contact-input"
          />

          <Button variant="contained" color="primary" className="contact-submit">
            {t('contacts.send')}
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default ContactPage;
