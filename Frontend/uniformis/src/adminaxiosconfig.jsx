import axios from 'axios';

const BASE_URL='http://localhost:8000/api';

const adminAxiosInstance = axios.create({
  baseURL: BASE_URL,
});

const productApi = axios.create({
  baseURL: `${BASE_URL}/products`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const addAuthToken= (config) => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers['Authorization'] = `Bearer ${adminToken}`;
    }
    return config;
  }

adminAxiosInstance.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
productApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));

export default adminAxiosInstance;
export {productApi}