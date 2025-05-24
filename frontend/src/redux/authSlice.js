import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct way


// ✅ Decode the token and extract user info
const token = localStorage.getItem('token');
let user = null;

try {
  user = token ? jwtDecode(token) : null;
} catch (e) {
  console.error("Invalid token", e);
  localStorage.removeItem('token'); // clean up corrupted token
  user = null;
}

// ✅ Define initial state using decoded user
const initialState = {
  user,
  token,
  status: 'idle',
  error: null,
};

// ✅ Thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/users/register', userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post('/users/login', credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// ✅ Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = jwtDecode(action.payload.token); // ✅ use token to decode user
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = jwtDecode(action.payload.token); // ✅ use token to decode user
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
