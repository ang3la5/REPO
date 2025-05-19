// 📁 components/PreferencesEditor.js

import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Button, Autocomplete
} from '@mui/material';
import axios from '../api/axios';
import CircularProgress from '@mui/material/CircularProgress';


const PreferencesEditor = ({ preferences, onSave }) => {
  const [genrePreference, setGenrePreference] = useState([]);
  const [favoriteActors, setFavoriteActors] = useState([]);
  const [favoriteDirectors, setFavoriteDirectors] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);

  const [actorOptions, setActorOptions] = useState([]);
  const [directorOptions, setDirectorOptions] = useState([]);
  const [loadingActors, setLoadingActors] = useState(false);
  const [loadingDirectors, setLoadingDirectors] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get('/tmdb/genres');
        setGenreOptions(Array.isArray(res.data.genres) ? res.data.genres : []);
      } catch (err) {
        console.error('Failed to fetch genres:', err);
        setGenreOptions([]);
      }
    };
    fetchGenres();
  }, []);

 useEffect(() => {
  setGenrePreference(
    Array.isArray(preferences?.genre_preference)
      ? preferences.genre_preference
      : preferences?.genre_preference
        ? preferences.genre_preference.split(',').map(s => s.trim()).filter(Boolean)
        : []
  );

  setFavoriteActors(
    preferences?.favorite_actors
      ? preferences.favorite_actors.split(',').map(s => s.trim()).filter(Boolean)
      : []
  );

  setFavoriteDirectors(
    preferences?.favorite_directors
      ? preferences.favorite_directors.split(',').map(s => s.trim()).filter(Boolean)
      : []
  );
}, [preferences]);

   const fetchPeople = async (query, setResults, setLoading) => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await axios.get(`/tmdb/people?query=${encodeURIComponent(query)}`);
      setResults(res.data.results?.map(p => p.name) || []);
    } catch (err) {
      console.error('Failed to fetch people:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async () => {
    try {
      await axios.put('/preferences', {
        genre_preference: genrePreference.join(', '),
        favorite_actors: favoriteActors.join(', '),
        favorite_directors: favoriteDirectors.join(', ')
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (onSave) onSave();
    } catch (err) {
      console.error('Failed to save preferences:', err);
    }
  };

  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Autocomplete
        multiple
        options={Array.isArray(genreOptions) ? genreOptions.map(g => g.name) : []}
        value={genrePreference || []}
        onChange={(e, newVal) => setGenrePreference(newVal || [])}
        renderInput={(params) => <TextField {...params} label="Preferred Genres" variant="outlined" />}
        fullWidth
      />

      <Autocomplete
        multiple
        freeSolo
        options={actorOptions}
        value={favoriteActors}
        onInputChange={(e, value) => fetchPeople(value, setActorOptions, setLoadingActors)}
        onChange={(e, newVal) => setFavoriteActors(newVal || [])}
        loading={loadingActors}
        renderInput={(params) => (
          <TextField {...params} label="Favorite Actors" variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingActors ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
        fullWidth
      />

     <Autocomplete
        multiple
        freeSolo
        options={directorOptions}
        value={favoriteDirectors}
        onInputChange={(e, value) => fetchPeople(value, setDirectorOptions, setLoadingDirectors)}
        onChange={(e, newVal) => setFavoriteDirectors(newVal || [])}
        loading={loadingDirectors}
        renderInput={(params) => (
          <TextField {...params} label="Favorite Directors" variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingDirectors ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
        fullWidth
      />

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Save Preferences
      </Button>
    </Box>
  );
};

export default PreferencesEditor;
