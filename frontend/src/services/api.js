import axios from 'axios';

// Force production API URL
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : '/api';

console.log('🔧 API Configuration Debug:');
console.log('📍 Current hostname:', window.location.hostname);
console.log('🌐 API Base URL:', API_BASE_URL);
console.log('📱 User Agent:', navigator.userAgent);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for mobile networks
  withCredentials: true, // Important for CORS
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    console.error('❌ Error Details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url
    });
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle network errors for mobile
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      console.error('📱 Network error - please check your connection');
      error.message = 'Network error. Please check your internet connection and try again.';
    }
    
    return Promise.reject(error);
  }
);

export default api;
