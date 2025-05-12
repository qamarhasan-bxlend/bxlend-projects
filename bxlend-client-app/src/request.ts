import axios from 'axios';

import { AUTH_URL, NODE_ENV } from 'src/configs';

const api = axios.create({
  baseURL: NODE_ENV === 'development' ? AUTH_URL : undefined,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const request = {
  get: (endpoint, options = {}) => {
    return api.get(endpoint, options);
  },
  post: (endpoint, data, options = {}) => {
    // @ts-expect-error Note: expected ts issue
    const headers = { ...options.headers };

    // If data is FormData, set the Content-Type to multipart/form-data
    if (data instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    }

    return api.post(endpoint, data, { ...options, headers });
  },
  put: (endpoint, data, options = {}) => {
    // @ts-expect-error Note: expected ts issue
    const headers = { ...options.headers };

    // If data is FormData, set the Content-Type to multipart/form-data
    if (data instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    }

    return api.put(endpoint, data, { ...options, headers });
  },
  patch: (endpoint, data, options = {}) => {
    return api.patch(endpoint, data, options);
  },
  delete: (endpoint, options = {}) => {
    return api.delete(endpoint, options);
  },
  options: (endpoint, options = {}) => {
    return api.options(endpoint, options);
  },
  head: (endpoint, options = {}) => {
    return api.head(endpoint, options);
  },
};

export default request;
