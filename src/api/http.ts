/**
 * http.ts
 * Wrapper typé autour d'Axios avec interceptors déjà attachés.
 * Utilise toujours ce module plutôt qu'apiClient directement.
 */
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
// Import with side-effects: registers interceptors
import './interceptors';
import apiClient from './client';

async function get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return await apiClient.get<T>(url, config);
}

async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
  return await apiClient.post<T>(url, data, config);
}

async function put<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
  return await apiClient.put<T>(url, data, config);
}

async function patch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
  return await apiClient.patch<T>(url, data, config);
}

async function del<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return await apiClient.delete<T>(url, config);
}

export const http = { get, post, put, patch, delete: del };
