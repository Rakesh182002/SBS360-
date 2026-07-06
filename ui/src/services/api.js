import axios from 'axios';
import store from '../redux/store';
import { logoutSuccess, updateAccessToken } from '../redux/slices/authSlice';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

 export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Request interceptor: attach bearer access token
API.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: intercept 401s and refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and request wasn't already retried
    if (
      error.response && 
      error.response.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const state = store.getState();
      const refreshVal = state.auth.refreshToken;

      if (!refreshVal) {
        store.dispatch(logoutSuccess());
        return Promise.reject(error);
      }

      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
        const res = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken: refreshVal
        });

        const { accessToken } = res.data.data;
        
        store.dispatch(updateAccessToken({ accessToken }));
        processQueue(null, accessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        store.dispatch(logoutSuccess());
        return Promise.reject(refreshError);
      }
    }

    // Standardize error formats for catch blocks
    const customError = {
      status: error.response ? error.response.status : 500,
      message: error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Network or internal server error.',
      errors: error.response && error.response.data && error.response.data.errors
        ? error.response.data.errors
        : null
    };

    return Promise.reject(customError);
  }
);

export default API;
