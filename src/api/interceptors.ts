import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import apiClient from './client';
import { API_CONFIG, TOKEN_STORAGE_KEYS } from './config';
import { parseApiError, UnauthorizedError, NetworkError } from './errors';
import type { ApiErrorResponse } from './types';

// State for refresh queue
let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.withCredentials = true; // IMPORTANT for cross-origin if needed

    // Attach JWT access token if available
    const token = localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response) {
      return Promise.reject(new NetworkError());
    }

    const { status, data } = error.response;

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH);
        if (!refreshToken) {
          throw new Error('No refresh token found');
        }

        // Call backend refresh endpoint with body token
        const response = await axios.post<{
          accessToken: string;
          refreshToken: string;
        }>(
          `${API_CONFIG.baseURL}/auth/refresh`,
          { token: refreshToken },
          { withCredentials: true },
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Save new tokens
        localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS, accessToken);
        localStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH, newRefreshToken);

        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        // Clear tokens on failure so user is prompted to login again
        localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS);
        localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH);

        return Promise.reject(new UnauthorizedError('Session expirée'));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(parseApiError(data ?? { message: error.message, statusCode: status }));
  },
);

export default apiClient;
