// ─── HTTP Methods ──────────────────────────────────────────────────────────────
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// ─── Generic API Response envelope ────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode: number;
}

// Dans @/api/types.ts, remplace PaginatedResponse par :
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ─── Request options ───────────────────────────────────────────────────────────
export interface RequestOptions {
  withAuth?: boolean;
  signal?: AbortSignal;
}

// ─── Token pair ────────────────────────────────────────────────────────────────
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
