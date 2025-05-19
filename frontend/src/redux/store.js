import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import moviesReducer from './movieSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
  },
});
