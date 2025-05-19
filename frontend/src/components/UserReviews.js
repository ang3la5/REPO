// 📁 components/UserReviews.js

import React from 'react';
import {
  Box, Typography, Card, CardContent, Stack, IconButton, TextField, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Rating from '@mui/material/Rating';
import { useTranslation } from 'react-i18next';

const UserReviews = ({
  reviews,
  editingReviewId,
  editedReviewText,
  editedReviewRating,
  setEditedReviewText,
  setEditedReviewRating,
  handleEditReview,
  handleSaveReview,
  handleDeleteReview,
  handleCancelEdit,
  reviewActionMessage
}) => {
  const { t } = useTranslation();
  return (
    <Box className="profile-section">
      <Typography variant="h6">{t('reviews.myReviews')}</Typography>

      {reviewActionMessage && (
        <Alert
          severity={reviewActionMessage === t('reviewDeleted') ? 'error' : 'success'}
          sx={{ my: 2 }}
        >
          {t(reviewActionMessage === 'Review deleted' ? 'reviewDeleted' : 'reviewEdited')}
        </Alert>
      )}

      {reviews.length === 0 ? (
        <Typography variant="body2" sx={{ mt: 2 }}>{t('reviews.none')}</Typography>
      ) : (
        reviews.map((review) => (
          <Card key={review.id} className="profile-review-card">
            <CardContent>
              <Typography fontWeight="bold">
                {review.movie?.title || t('reviews.untitled')}
              </Typography>
              <Rating value={review.rating / 2} readOnly precision={0.5} />
<Typography variant="caption">{review.rating} / 10</Typography>


              {editingReviewId === review.id ? (
                <>
                  <TextField
                    fullWidth
                    value={editedReviewText}
                    onChange={(e) => setEditedReviewText(e.target.value)}
                    multiline
                    rows={2}
                    sx={{ my: 1 }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography>{t('reviews.rating')}:</Typography>
                    <Rating
  value={editedReviewRating / 2}
  onChange={(e, newValue) => setEditedReviewRating(newValue * 2)}
  precision={0.5}
/>
<Typography variant="caption" sx={{ ml: 1 }}>{editedReviewRating} / 10</Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => handleSaveReview(review.id)} color="primary">
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={handleCancelEdit} color="secondary">
                      <CancelIcon />
                    </IconButton>
                  </Stack>
                </>
              ) : (
                <>
                  <Typography>{review.comment}</Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => handleEditReview(review)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteReview(review.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default UserReviews;
