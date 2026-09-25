import axios from 'axios';

// Default API URL configured with production Render backend fallback and local dev proxy
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://peernotes-7ptp.onrender.com/api'
    : '/api');

export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('peernotes_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If receiving unauthorized, clean up invalid or expired token
    if (error.response && error.response.status === 401) {
      const currentToken = localStorage.getItem('peernotes_token');
      if (currentToken) {
        localStorage.removeItem('peernotes_token');
      }
    }
    return Promise.reject(error);
  }
);

// Utility to resolve asset URLs (e.g. /uploads/image.png)
export const getAssetUrl = (filePath) => {
  if (!filePath) return '';
  if (
    filePath.startsWith('http://') ||
    filePath.startsWith('https://') ||
    filePath.startsWith('blob:') ||
    filePath.startsWith('data:')
  ) {
    return filePath;
  }
  const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return SERVER_BASE_URL ? `${SERVER_BASE_URL}${normalizedPath}` : normalizedPath;
};

export default api;
