// 📁 components/UserLists.js
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import axios from '../api/axios';
import React, { useState } from 'react';

import {
  Box, Typography, Tabs, Tab, Card, CardMedia, CardContent, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';

const UserLists = ({
  lists,
  selectedListIndex,
  setSelectedListIndex,
  selectedList,
  newListOpen,
  setNewListOpen,
  newListName,
  setNewListName,
  handleCreateList,
  fetchUserLists
}) => {
  const { t } = useTranslation();
  const [editListOpen, setEditListOpen] = useState(false);
  const [editListName, setEditListName] = useState('');
  const [editListId, setEditListId] = useState(null);

  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [movieToRemove, setMovieToRemove] = useState(null);
  const [removeFeedback, setRemoveFeedback] = useState('');

  const handleRemoveMovieFromList = async (movieId, movieTitle) => {
    try {
      await axios.delete(`/lists/${lists[selectedListIndex].id}/movie/${movieId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRemoveFeedback(t('lists.movieRemoved', { title: movieTitle }));
      fetchUserLists();
    } catch (err) {
      console.error('Failed to remove movie from list:', err);
      setRemoveFeedback(t('lists.movieRemoveFailed', { title: movieTitle }));
    }
  };

  return (
    <Box className="profile-section">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">{t('lists.myLists')}</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={() => setNewListOpen(true)}
        >
           {t('lists.newList')}
        </Button>
      </Box>

      {lists.length > 0 && (
        <>
          <Tabs
              value={selectedListIndex}
              onChange={(e, newVal) => setSelectedListIndex(newVal)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 2 }}
            >
              {lists.map((list, idx) => (
                <Tab
                  key={list.id}
                  label={list.name}
                  value={idx}
                  sx={{ mr: 2 }}
                />
              ))}
          </Tabs>


          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            {!lists[selectedListIndex]?.isDefault && (
              <>
                <IconButton
                  size="small"
                  onClick={() => {
                    setEditListName(lists[selectedListIndex].name);
                    setEditListId(lists[selectedListIndex].id);
                    setEditListOpen(true);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={async () => {
                    if (window.confirm(t('lists.confirmDeleteList'))) {
                      try {
                        await axios.delete(`/lists/${lists[selectedListIndex].id}`, {
                          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                        });
                        fetchUserLists();
                        setSelectedListIndex(0);
                      } catch (err) {
                        alert(t('lists.errorDeletingList'));
                      }
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>

          <Box className="profile-carousel">
            {selectedList?.movies?.map((movie) => (
              <Card key={movie.id} sx={{ minWidth: 200 }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={movie.posterUrl || 'https://via.placeholder.com/200x300'}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {movie.title}
                  </Typography>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      setMovieToRemove({ id: movie.id, title: movie.title });
                      setConfirmRemoveOpen(true);
                    }}
                  >
                    {t('lists.remove')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}

      {lists.length === 0 && (
        <Typography variant="body2">{t('lists.noLists')}</Typography>
      )}

      <Dialog open={newListOpen} onClose={() => setNewListOpen(false)}>
        <DialogTitle>{t('lists.createNew')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('lists.listName')}
            fullWidth
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewListOpen(false)}>{t('cancel')}</Button>
          <Button onClick={handleCreateList} variant="contained">{t('create')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editListOpen} onClose={() => setEditListOpen(false)}>
        <DialogTitle>{t('lists.editList')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t('lists.listName')}
            value={editListName}
            onChange={(e) => setEditListName(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditListOpen(false)}>{t('cancel')}</Button>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                await axios.put(`/lists/${editListId}`, { name: editListName }, {
                  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setEditListOpen(false);
                fetchUserLists();
              } catch (err) {
                alert(t('lists.errorUpdatingList'));
              }
            }}
          >
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmRemoveOpen} onClose={() => setConfirmRemoveOpen(false)}>
        <DialogTitle>{t('lists.removeMovie')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('lists.confirmRemoveMovie', { title: movieToRemove?.title })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRemoveOpen(false)}>{t('cancel')}</Button>
          <Button
            color="error"
            onClick={async () => {
              if (movieToRemove) {
                await handleRemoveMovieFromList(movieToRemove.id, movieToRemove.title);
                setConfirmRemoveOpen(false);
              }
            }}
          >
            {t('remove')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!removeFeedback}
        autoHideDuration={3000}
        onClose={() => setRemoveFeedback('')}
      >
        <Alert onClose={() => setRemoveFeedback('')} severity="info" sx={{ width: '100%' }}>
          {removeFeedback}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserLists;
