import axios from 'axios';

const API_URL = '/api/responses';

export const submitResponse = async (email, responses) => {
  const token = localStorage.getItem('userToken');
  const response = await axios.post(`${API_URL}/submit`, { email, responses }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const getUserResponse = async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};
