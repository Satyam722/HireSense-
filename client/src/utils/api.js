import axios from 'axios';

// Create an axios instance with the base URL of your backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ensure this matches your backend port
});

// Add a request interceptor to attach the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;