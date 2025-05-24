import React, { useState } from 'react';
import {
  TextField, Box, Typography, Container, AppBar, Toolbar, Button, IconButton, Snackbar, Alert
} from '@mui/material';
import '../style/ContactPage.css';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import LanguageIcon from '@mui/icons-material/Language';
import axios from '../api/axios'; // ✅ your custom axios instance

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'gr' : 'en';
    i18n.changeLanguage(newLang);
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/contact', formData);
      setAlert({ open: true, severity: 'success', message: t('contacts.success') });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error.response?.data || error.message);
      setAlert({ open: true, severity: 'error', message: t('contacts.error') });
    }
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

        <Box component="form" onSubmit={handleSubmit} className="contact-form">
          <TextField
            label={t('contacts.name')}
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            className="contact-input"
          />
          <TextField
            label={t('contacts.email')}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            className="contact-input"
          />
          <TextField
            label={t('contacts.subject')}
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            className="contact-input"
          />
          <TextField
            label={t('contacts.message')}
            name="message"
            value={formData.message}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={5}
            fullWidth
            required
            className="contact-input"
          />

          <Button type="submit" variant="contained" color="primary" className="contact-submit">
            {t('contacts.send')}
          </Button>
        </Box>
      </Container>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ContactPage;
