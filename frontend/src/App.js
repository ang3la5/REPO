import React, { useEffect } from 'react';
import './i18n';
import './App.css'; // if needed for global styles
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import UserHomePage from './pages/UserHomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import UserProfilePage from './pages/UserProfilePage';
import LeaderboardPage from "./pages/LeaderboardPage";
import MoviesPage from './pages/MoviesPage';
import SeriesPage from './pages/SeriesPage';
import Footer from './components/Footer';
import ContactPage from './pages/ContactPage';
import SeriesDetailPage from './pages/SeriesDetailPage';


const LayoutWithFooter = ({ children }) => {
  const location = useLocation();
  const hideFooterPaths = ['/login', '/register'];
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  const { i18n } = useTranslation();

  // ⬇️ Dynamically apply Greek font to body
  useEffect(() => {
    const root = document.body;
    if (i18n.language === 'gr') {
      root.classList.add('greek-active');
    } else {
      root.classList.remove('greek-active');
    }
  }, [i18n.language]);

  return (
    <>
      {children}
      {!shouldHideFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <LayoutWithFooter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/series/:id" element={<SeriesDetailPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user-home" element={<UserHomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </LayoutWithFooter>
    </Router>
  );
};

export default App;
