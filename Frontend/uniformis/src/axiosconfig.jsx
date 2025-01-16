// import axios from 'axios';

// const BASE_URL = 'http://localhost:8000';

// // Create an Axios instance for general API calls
// const axiosInstance = axios.create({
//   baseURL: `${BASE_URL}/api`,
// });

// // Create a specific Axios instance for product-related API calls
// const productApi = axios.create({
//   baseURL: `${BASE_URL}/api/products`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Function to add the auth token to request headers
// const addAuthToken = (config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }
//   return config;
// };

// // Attach the interceptor to both Axios instances
// axiosInstance.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
// productApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));

// export default axiosInstance; // Default export for axiosInstance
// export { productApi };       // Named export for productApi


import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// Create an Axios instance for authentication (no default headers)
const authApi = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Create an Axios instance for authenticated requests
const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Create a specific Axios instance for product-related API calls
const productApi = axios.create({
  baseURL: `${BASE_URL}/api/products`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for authenticated requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await authApi.post('/token/refresh/', {
          refresh: refreshToken
        });
        
        const { access } = response.data;
        localStorage.setItem('token', access);
        
        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export { authApi, productApi };
export default axiosInstance;