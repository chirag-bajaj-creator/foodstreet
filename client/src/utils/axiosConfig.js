import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: apiURL,
  timeout: 10000
});

export default axiosInstance;
