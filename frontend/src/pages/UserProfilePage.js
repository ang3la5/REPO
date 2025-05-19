// src/pages/UserProfilePage.js
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, AppBar, Toolbar, Button, Container, IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import axios from '../api/axios';
import '../style/ProfilePage.css';
import ProfileHeader from '../components/ProfileHeader';
import UserLists from '../components/UserLists';
import UserReviews from '../components/UserReviews';
import UserPreferences from '../components/UserPreferences';
import { Snackbar, Alert } from '@mui/material';

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAvatarValid, setIsAvatarValid] = useState(true);
  const [preferences, setPreferences] = useState(null);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [lists, setLists] = useState([]);
  const [selectedListIndex, setSelectedListIndex] = useState(0);
  const [editingPrefs, setEditingPrefs] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReviewText, setEditedReviewText] = useState('');
  const [editedReviewRating, setEditedReviewRating] = useState(5);
  const [reviewActionMessage, setReviewActionMessage] = useState('');
  const [newListOpen, setNewListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'gr' : 'en';
    i18n.changeLanguage(newLang);
  };


  const fetchUserPreferences = async () => {
  try {
    const res = await axios.get('/preferences', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setPreferences(res.data);
  } catch (err) {
    if (err.response?.status === 404) {
      // No preferences yet — initialize empty state
      setPreferences({
        genre_preference: '',
        favorite_actors: '',
        favorite_directors: '',
        genres: [],
        favoriteActors: [],
        favoriteDirectors: []
      });
    } else {
      console.error('Failed to load preferences:', err);
    }
  }
};




 const fetchUserProfile = async () => {
  try {
    const res = await axios.get('/users/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setUser(res.data);
    setNewUsername(res.data.username);
    setPreferences(res.data.preferences); // ✅ grab it from user
  } catch (err) {
    console.error('Failed to load user:', err);
  }
};

  const fetchUserReviews = async () => {
    try {
      const res = await axios.get('/reviews/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  const fetchUserLists = async () => {
    try {
      const res = await axios.get('/lists/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLists(res.data);
    } catch (err) {
      console.error('Failed to load lists:', err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserReviews();
    fetchUserLists();
    fetchUserPreferences();
  }, []);

  const handleSavePreferences = async () => {
  try {
    const res = await axios.get('/preferences', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const parsedPrefs = {
      genres: res.data.genre_preference?.split(',').map(s => s.trim()).filter(Boolean) || [],
      favoriteActors: res.data.favorite_actors?.split(',').map(s => s.trim()).filter(Boolean) || [],
      favoriteDirectors: res.data.favorite_directors?.split(',').map(s => s.trim()).filter(Boolean) || [],
      genre_preference: res.data.genre_preference,
      favorite_actors: res.data.favorite_actors,
      favorite_directors: res.data.favorite_directors
    };
    setPreferences(parsedPrefs);
    setUser(prev => ({
      ...prev,
      preferences: parsedPrefs
    }));

    setEditingPrefs(false);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  } catch (err) {
    console.error('Failed to reload preferences:', err);
  }
};


const handleSaveUsername = async () => {
  try {
    if (newUsername !== user.username) {
      await axios.put('/users/me', { username: newUsername }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      await fetchUserProfile();
      setSuccessMessage('Username updated successfully.');
    }
  } catch (err) {
    console.error('Username update failed:', err);
    setErrorMessage('Failed to update username.');
  }
};


const handleSaveAvatar = async () => {
  if (!selectedAvatar || !isAvatarValid) {
    alert("Avatar file is too large or invalid.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append('avatar', selectedAvatar);

    await axios.post('/users/avatar', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    await fetchUserProfile();
    alert(t('profileUpdated'));
  } catch (err) {
    console.error('Avatar upload failed:', err);
    alert(t('profileUpdateError'));
  }
};

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUserReviews();
      setReviewActionMessage(t('reviewDeleted'));
      setTimeout(() => setReviewActionMessage(''), 3000);
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setEditedReviewText(review.comment);
    setEditedReviewRating(review.rating);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditedReviewText('');
  };

  const handleSaveReview = async (reviewId) => {
    try {
      await axios.put(`/reviews/${reviewId}`, {
        comment: editedReviewText,
        rating: editedReviewRating
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEditingReviewId(null);
      fetchUserReviews();
      setReviewActionMessage(t('reviewEdited'));
      setTimeout(() => setReviewActionMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update review:', err);
    }
  };

  const handleCreateList = async () => {
    try {
      await axios.post('/lists', { name: newListName }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewListOpen(false);
      setNewListName('');
      fetchUserLists();
    } catch (err) {
      console.error('Failed to create list:', err);
    }
  };

  if (!user) return <Typography>{t('loading')}</Typography>;

  
  
  return (
    <Box className={`profile-page fade-in ${theme.palette.mode === 'dark' ? 'dark' : ''}`}>
      <AppBar position="static" className="profile-appbar">
        <Toolbar className="profile-toolbar">
          <Link to="/user-home">
            <img src="/logo.png" alt="CineVerse Logo" className="logo-img fade-in" />
          </Link>
          <Box display="flex" alignItems="center" gap={2}>
            <Button color="inherit" href="/user-home">{t('home')}</Button>
            <Button color="inherit" href="/movies">{t('movies')}</Button>
            <Button color="inherit" href="/series">{t('series')}</Button>
            <Button color="inherit" href="/profile">{t('profile')}</Button>
            <Button color="inherit" href="/contact">{t('contact')}</Button>
            <Button color="inherit" href="/leaderboard">{t('leaderboard.title')}</Button>
            <Button color="inherit" href="/logout">{t('logout')}</Button>
            <IconButton onClick={toggleLanguage} color="inherit">
              <LanguageIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <ProfileHeader
          user={user}
          editingProfile={editingProfile}
          newUsername={newUsername}
          setNewUsername={setNewUsername}
          setSelectedAvatar={setSelectedAvatar}
          handleSaveUsername={handleSaveUsername}
          handleSaveAvatar={handleSaveAvatar}
          setEditingProfile={setEditingProfile}
          setIsAvatarValid={setIsAvatarValid}
          isAvatarValid={isAvatarValid}
        />

        <UserLists
          lists={lists}
          selectedListIndex={selectedListIndex}
          setSelectedListIndex={setSelectedListIndex}
          selectedList={lists[selectedListIndex]}
          newListOpen={newListOpen}
          setNewListOpen={setNewListOpen}
          newListName={newListName}
          setNewListName={setNewListName}
          handleCreateList={handleCreateList}
          fetchUserLists={fetchUserLists}
        />

        <UserReviews
          reviews={reviews}
          editingReviewId={editingReviewId}
          editedReviewText={editedReviewText}
          editedReviewRating={editedReviewRating}
          setEditedReviewText={setEditedReviewText}
          setEditedReviewRating={setEditedReviewRating}
          handleEditReview={handleEditReview}
          handleSaveReview={handleSaveReview}
          handleDeleteReview={handleDeleteReview}
          handleCancelEdit={handleCancelEdit}
          reviewActionMessage={reviewActionMessage}
        />

                {preferences && (
          <UserPreferences 
            preferences={preferences}
            editingPrefs={editingPrefs}
            setEditingPrefs={setEditingPrefs}
            showSavedMessage={showSavedMessage}
            handleSavePreferences={handleSavePreferences}
          />
        )}
        <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage('')}>
          <Alert severity="success" onClose={() => setSuccessMessage('')} sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>

        <Snackbar open={!!errorMessage} autoHideDuration={3000} onClose={() => setErrorMessage('')}>
          <Alert severity="error" onClose={() => setErrorMessage('')} sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ProfilePage;
