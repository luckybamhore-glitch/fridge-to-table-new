import axios from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken, notifyAuthFailure } from '../lib/tokenStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
  withCredentials: true, // sends/receives the httpOnly refresh-token cookie
});

// A separate, interceptor-free instance for the refresh call itself.
// If this went through axiosClient's own response interceptor, a failed
// refresh would try to refresh itself.
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 12000,
});

axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Concurrent requests that all 401 at once should trigger exactly one
// refresh call, not one each — every caller awaits the same promise.
let refreshPromise = null;

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post('/auth/refresh')
      .then((response) => {
        const token = response.data?.accessToken;
        setAccessToken(token);
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthEndpoint = originalRequest?.url?.startsWith('/auth/');

    if (status === 401 && !isAuthEndpoint && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        }
      } catch {
        clearAccessToken();
        notifyAuthFailure();
      }
    }

    console.error('API Error Response:', error?.response || error?.message);
    return Promise.reject(error?.response?.data || { message: error.message || 'API request failed' });
  }
);

export default axiosClient;

