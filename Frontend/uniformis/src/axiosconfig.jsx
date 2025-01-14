import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

// Create an Axios instance for general API calls
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Create a specific Axios instance for product-related API calls
const productApi = axios.create({
  baseURL: `${BASE_URL}/products`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to add the auth token to request headers
const addAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

// Attach the interceptor to both Axios instances
axiosInstance.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
productApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));

export default axiosInstance; // Default export for axiosInstance
export { productApi };       // Named export for productApi
