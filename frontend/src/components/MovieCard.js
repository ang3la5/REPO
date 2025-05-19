import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const MovieCard = ({ movie }) => (
  <Card sx={{ width: 250, m: 1 }}>
    <CardContent>
      <Typography variant="h6">{movie.title}</Typography>
      <Typography variant="body2" color="text.secondary">{movie.genre}</Typography>
    </CardContent>
  </Card>
);

export default MovieCard;
