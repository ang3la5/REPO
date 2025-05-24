import axios from 'axios';
import { logout } from '../redux/authSlice';


const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust if different
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { store } = require('../redux/store'); // ✅ Dynamically import
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
