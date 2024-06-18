import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://cryptokuff.com/api',
  // baseURL: 'http://10.0.2.2:8000/api',
  baseURL: 'https://admin.stokse.store/api',
});

// eslint-disable-next-line func-names
api.interceptors.request.use(async function (config) {
  config.headers['device-type'] = 'desktop';
  config.headers.Authorization = `Bearer ${
    localStorage.getItem('token') || null
  }`;

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 403) {
      // window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

export default api;
