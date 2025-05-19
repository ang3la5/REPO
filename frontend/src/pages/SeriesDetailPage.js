import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Container, Card, CardMedia,
  CardContent, TextField, Button, AppBar, Toolbar, IconButton,
  Rating, Snackbar, Alert, MenuItem
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LanguageIcon from '@mui/icons-material/Language';
import axios from '../api/axios';
import { useTranslation } from 'react-i18next';

const SeriesDetailPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [series, setSeries] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [lists, setLists] = useState([]);
  const [addListOpen, setAddListOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    fetchSeries();
    fetchReviews();
  }, [id]);

  const fetchSeries = async () => {
    try {
      const res = await axios.get(`/series/${id}`);
      setSeries(res.data);
    } catch (err) {
      console.error('Failed to fetch series:', err);
    }
  };


  const fetchUserLists = async () => {
    try {
      const res = await axios.get('/lists/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLists(res.data);
    } catch (err) {
      console.error('Failed to load user lists:', err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      await axios.post('/reviews', { movieId: id, comment, rating });
      setComment('');
      setRating(0);
      fetchReviews();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review.';
      setErrorMessage(msg);
      setShowError(true);
    }
  };

 const handleDelete = async (reviewId) => {
  try {
    await axios.delete(`/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchReviews(); // Refresh the review list
  } catch (err) {
    console.error('Failed to delete review:', err);
  }
};

 const handleAddToList = async () => {
    if (!selectedListId) return;
    try {
      await axios.post(`/lists/${selectedListId}/add`, {
        seriesId: series.id // Ensure backend supports this
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setAddListOpen(false);
      setSelectedListId('');
    } catch (err) {
      console.error('Failed to add series to list:', err);
    }
  };


  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'gr' : 'en';
    i18n.changeLanguage(newLang);
  };

  const poster = series?.posterUrl?.includes('http')
    ? series.posterUrl
    : `https://image.tmdb.org/t/p/w500${series?.posterUrl}`;

  const totalEpisodes = series?.seasons?.reduce((sum, season) => sum + (season.episodes?.length || 0), 0);
  if (!series) return <Typography sx={{ p: 4 }}>Loading...</Typography>;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f9f3e5', color: 'white' }}>
      <AppBar position="static" sx={{ backgroundColor: '#d86116' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/user-home">
            <img src="/logo.png" alt="CineVerse Logo" className="logo-img fade-in" />
          </Link>
          <Box>
            <Button color="inherit" href="/movies">{t('movies')}</Button>
            <Button color="inherit" href="/series">{t('series')}</Button>
            <Button color="inherit" href="/profile">{t('profile')}</Button>
            <Button color="inherit" href="/contact">{t('contact')}</Button>
            <Button color="inherit" href="/logout">{t('logout')}</Button>
            <IconButton onClick={toggleLanguage} color="inherit">
              <LanguageIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        {series && (
          <Card sx={{ backgroundColor: '#2a2a2a', color: 'white', mb: 4 }}>
            <CardMedia
              component="img"
              height="500"
              image={poster || 'https://via.placeholder.com/300x450'}
              alt={series.title}
            />
            <CardContent>
              <Typography variant="h4" fontWeight="bold">{series.title}</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>{series.description}</Typography>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                {t('genre')}: {series.genre}
              </Typography>
              <Typography variant="subtitle1">
                {t('rating')}: {series.rating?.toFixed(1) || 0} / 10
              </Typography>
              <Typography variant="subtitle1">
                📺 {t('Seasons')}: {series.seasons?.length || 0}
              </Typography>
              <Typography variant="subtitle1">
                🎞️ {t('Episodes')}: {totalEpisodes || 0}
              </Typography>
              <Button variant="outlined" sx={{ mt: 2 }} onClick={() => {
              fetchUserLists();
              setAddListOpen(true);
            }}>
              ➕ {t('addToList')}
            </Button>
            </CardContent>
          </Card>
        )}

               {addListOpen && (
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              label={t('Select A list')}
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
              fullWidth
            >
              <MenuItem value="">
                <em>{t('choose')}</em>
              </MenuItem>
              {lists.map((list) => (
                <MenuItem key={list.id} value={list.id}>
                  {list.name}
                </MenuItem>
              ))}
            </TextField>

            <Button variant="contained" onClick={handleAddToList} sx={{ mt: 2 }}>
              {t('confirmAdd')}
            </Button>
          </Box>
        )}

        

        {/* Review Form */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5">{t('Leave A Review')}</Typography>
          <Rating
            value={rating / 2}
            precision={0.5}
            onChange={(e, newValue) => setRating(newValue * 2)}
            sx={{ my: 1 }}
          />
          <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
            {rating} / 10
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('comment')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ my: 2 }}
          />
          <Button variant="contained" onClick={handleReviewSubmit}>{t('submit')}</Button>
        </Box>

        {/* Reviews Display */}
        <Typography variant="h5">{t('Reviews')}</Typography>
        {reviews.length === 0 ? (
          <Typography sx={{ mt: 2 }}>{t('No reviews yet..')}</Typography>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} sx={{ backgroundColor: '#f9f3e5', my: 2 }}>
            <CardContent>
            <Typography variant="subtitle1">
                {review.user?.username || t('Anonymous')}
            </Typography>
            <Rating value={review.rating / 2} readOnly precision={0.5} />
            <Typography variant="body2" sx={{ mt: 1 }}>{review.rating} / 10</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>{review.comment}</Typography>

           {(user && (review.user_id === user.id || user.role === 'admin')) && (
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(review.id)}
                    sx={{ mt: 1 }}
                >
                    🗑️ Delete
                </Button>
                )}
            </CardContent>
        </Card>
          ))
        )}

        {/* Snackbar for errors */}
        <Snackbar
          open={showError}
          autoHideDuration={4000}
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="warning" onClose={() => setShowError(false)} sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default SeriesDetailPage;