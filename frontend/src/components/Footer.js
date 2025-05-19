import React from 'react';
import '../style/Footer.css';
import { Facebook, Instagram, LinkedIn } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';


const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="cineverse-footer">
      <div className="footer-top">
        <div className="footer-logo">
          <img src="/logo.png" alt="CineVerse Logo" />
          <h3>CineVerse</h3>
          <p>Your gateway to movies, shows, and reviews.</p>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>📧 int02578@uoi.gr or int02585@uoi.gr</p>
          <p>📞 +30 698 564 0970 or +30 694 992 5460</p>
          <p>📍 CineVerse HQ, Arta, Greece</p>
        </div>

        <div className="footer-section">
          <h4>Navigation</h4>
          <ul>
            <li><a href="/user-home">Home</a></li>
            <li><a href="/movies">Movies</a></li>
            <li><a href="/series">Series</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://www.facebook.com/aggeliki.stathonikou"><Facebook /></a>
            <a href="https://www.instagram.com/_aggeliki.st_/"><Instagram /></a>
            <a href="https://www.linkedin.com/in/aggeliki-stathonikou-302b65189"><LinkedIn /></a>
          </div>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <p>© 2025 CineVerse. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
