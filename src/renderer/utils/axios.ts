import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_URL,
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
    } else if (error.response && error.response.status === 500) {
      // localStorage.clear(); // [info]: this is temporary for logout users
    }
    return Promise.reject(error);
  },
);

export default api;
