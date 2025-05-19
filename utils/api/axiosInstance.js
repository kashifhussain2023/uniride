import axios from 'axios';
import { getSession } from 'next-auth/react';

const getToken = async () => {
  const session = await getSession();
  const token = session?.user?.data?.token_code;
  return token;
};

const axiosInstance = axios.create({
  baseURL: process.env.NEW_API_URL,
});

axiosInstance.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else if (
      config.data &&
      typeof config.data === 'object' &&
      !(config.data instanceof URLSearchParams)
    ) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
