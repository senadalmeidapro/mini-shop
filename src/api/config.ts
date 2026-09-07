const getBaseURL = () => {
  const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  // Ensure it ends with /api/v1
  // return rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/$/, '')}/api`;
  return rawUrl;
};

export const API_CONFIG = {
  baseURL: getBaseURL(),
  timeout: Number(import.meta.env.VITE_API_TIMEOUT ?? 15_000),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

export const TOKEN_STORAGE_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
} as const;
