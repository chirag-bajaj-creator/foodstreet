import axios from 'axios';

const API_URL = '/api/admin-auth';

export const checkAdminEmailExists = async (email) => {
  const response = await axios.post(`${API_URL}/check-email`, { email });
  return response.data.exists;
};

export const registerAdmin = async (email, password) => {
  const response = await axios.post(`${API_URL}/register`, { email, password });
  return response.data;
};

export const loginAdmin = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminId');
};
