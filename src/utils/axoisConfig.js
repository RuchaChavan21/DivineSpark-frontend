// src/api/axiosConfig.js
import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api', // Your Spring Boot backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// IMPORTANT: Interceptor to add the auth token to every request
// You will need to implement logic to get the token from localStorage, cookies, etc.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Example: getting token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;