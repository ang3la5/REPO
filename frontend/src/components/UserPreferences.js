import React from 'react';
import {
  Box, Typography, IconButton, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PreferencesEditor from './PreferencesEditor';
import { useTranslation } from 'react-i18next';

const UserPreferences = ({
  preferences,
  editingPrefs,
  setEditingPrefs,
  showSavedMessage,
  handleSavePreferences
}) => {
  const { t } = useTranslation();

   const genres = preferences?.genre_preference
    ? preferences.genre_preference.split(',').map(g => g.trim())
    : [];

  const favoriteActors = preferences?.favorite_actors
    ? preferences.favorite_actors.split(',').map(a => a.trim())
    : [];

  const favoriteDirectors = preferences?.favorite_directors
    ? preferences.favorite_directors.split(',').map(d => d.trim())
    : [];

  return (
    <Box className="profile-section">
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="h6">{t('preferences.title')}</Typography>
        <IconButton size="small" onClick={() => setEditingPrefs(!editingPrefs)}>
          <EditIcon fontSize="small" />
        </IconButton>
        {showSavedMessage && (
          <Typography variant="body2" className="preferences-saved-message">
            {t('preferences.saved')}
          </Typography>
        )}
      </Box>

      
      {!editingPrefs && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
          <Box>
            <Typography variant="subtitle2">{t('preferences.genres')}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {genres.map((genre, idx) => (
                <Chip key={idx} label={genre} />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2">{t('preferences.actors')}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {favoriteActors.map((actor, idx) => (
                <Chip key={idx} label={actor} />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2">{t('preferences.directors')}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {favoriteDirectors.map((director, idx) => (
                <Chip key={idx} label={director} />
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {editingPrefs && (
        <PreferencesEditor preferences={preferences} onSave={handleSavePreferences} />
      )}
    </Box>
  );
};
export default UserPreferences;
