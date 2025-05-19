import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovies } from '../redux/movieSlice'; // ✅ adjust path if needed

const MovieList = () => {
  const dispatch = useDispatch();

  const { data = [], status = 'idle', error } = useSelector((state) => state.movies || {});

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMovies());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <p>Loading movies...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Movie List</h2>
      <ul>
        {data.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default MovieList;
