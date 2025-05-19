import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/authSlice';
import {
  AppBar, Toolbar, TextField, Button, Container,
  Typography, Box, InputAdornment, IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link } from 'react-router-dom';
import '../style/RegisterPage.css';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth || {});
  const [showPassword, setShowPassword] = useState(false);
  const { t, i18n } = useTranslation();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      dispatch(registerUser(values));
    },
  });

  const toggleLanguage = () => {
  const newLang = i18n.language === 'en' ? 'gr' : 'en';
  i18n.changeLanguage(newLang);
};

useEffect(() => {
  if (auth.status === 'succeeded' && !auth.token) {
    // Registration success: redirect to login
    navigate('/login');
  } else if (auth.token && auth.status === 'succeeded') {
    // Already logged in: redirect to user-home
    navigate('/user-home');
  }
}, [auth.token, auth.status, navigate]);


  return (
    <div className="login">
      <AppBar position="static" className="appbar" elevation={0}>
        <Toolbar className="toolbar">
  <Box display="flex" alignItems="center">
    <Link to="/home">
      <img src="/logo.png" alt="CineVerse Logo" className="logo-img fade-in" />
    </Link>
  </Box>

  <IconButton onClick={toggleLanguage} color="inherit">
    <LanguageIcon />
  </IconButton>
</Toolbar>

      </AppBar>

      <Container maxWidth="sm" className="login-container">
        <Typography variant="h4" gutterBottom align="center">
          {t('register')}
        </Typography>

        <form onSubmit={formik.handleSubmit} className="register-form">
          <TextField
            label={t('username')}
            name="username"
            type="text"
            value={formik.values.username}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
            required
          />
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="login-button"
          >
            {t('register')}
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
            {t('registering')}
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

export default RegisterPage;
