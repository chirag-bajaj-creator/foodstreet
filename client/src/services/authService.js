import axios from 'axios';

const API_URL = '/api/auth';

export const checkEmailExists = async (email) => {
  const response = await axios.post(`${API_URL}/check-email`, { email });
  return response.data.exists;
};

export const registerUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/register`, { email, password });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userId');
};
