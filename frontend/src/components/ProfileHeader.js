// 📁 components/ProfileHeader.js

import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Input,
  Button
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const ProfileHeader = ({
  user,
  editingProfile,
  newUsername,
  setNewUsername,
  setSelectedAvatar,
  setIsAvatarValid,
  isAvatarValid,
  handleSaveUsername,
  handleSaveAvatar,
  setEditingProfile
}) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
      <Avatar src={user.avatarUrl} className="profile-avatar" sx={{ width: 64, height: 64 }}>
        {!user.avatarUrl && user.username[0].toUpperCase()}
      </Avatar>

      <Box>
        {editingProfile ? (
          <>
            <TextField
              label={t('profile.username') || 'Username'}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mb: 1 }}
            />

            <br />
            <Button variant="contained" onClick={handleSaveUsername}>
              {t('Save')}
            </Button>
          </>
        ) : (
          <Typography variant="h5">{user.username}</Typography>
        )}
        <Typography variant="subtitle1">
          Level: {user.level} ({user.reviewCount} reviews)
        </Typography>
        <Typography variant="subtitle2">{t('profile.role')}</Typography>
      </Box>

      <Box>
        <Button onClick={() => setEditingProfile(!editingProfile)}>
          {editingProfile ? t('profile.cancel') : t('profile.edit')}
        </Button>
      </Box>

      {editingProfile && (
        <Box sx={{ mt: 2 }}>
          <Input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && file.size > 1024 * 1024) {
                alert('File too large. Please upload an image smaller than 1MB.');
                setSelectedAvatar(null);
                setIsAvatarValid(false);
              } else {
                setSelectedAvatar(file);
                setIsAvatarValid(true);
              }
            }}
          />
          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={handleSaveAvatar}
          >
            {t('Save')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProfileHeader;
