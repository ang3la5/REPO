import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import {
  AppBar, Toolbar, TextField, Button, Container, Typography,
  Box, IconButton, InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LanguageIcon from '@mui/icons-material/Language';
import '../style/LoginPage.css';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth || {});
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      dispatch(loginUser(values));
    },
  });

  useEffect(() => {
    if (auth.token && auth.status === 'succeeded') {
      navigate('/user-home');
    }
  }, [auth.token, auth.status, navigate]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'gr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="login">
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

      <Container maxWidth="sm" className="login-container">
        <Typography variant="h4" gutterBottom align="center">
          {t('login')}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            label={t('email')}
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label={t('password')}
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formik.values.password}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth className="login-button">
            {t('login')}
          </Button>

          <Button
            variant="text"
            onClick={() => navigate('/')}
            fullWidth
            className="back-button"
          >
            ← {t('backToHome')}
          </Button>
        </form>

        {auth?.status === 'loading' && (
          <Typography align="center" className="status-text">
            {t('loggingIn')}...
          </Typography>
        )}
        {auth?.error && (
          <Typography color="error" align="center" className="status-text">
            {auth.error}
          </Typography>
        )}
      </Container>
    </div>
  );
};

export default LoginPage;
