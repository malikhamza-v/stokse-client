import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://cryptokuff.com/api',
  baseURL: 'http://localhost:8000/api',
});

// eslint-disable-next-line func-names
api.interceptors.request.use(async function (config) {
  config.headers['device-type'] = 'desktop';
  config.headers.Authorization = `Bearer ${
    localStorage.getItem('token') || null
  }`;

  return config;
});

export default api;
