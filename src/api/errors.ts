import type { ApiErrorResponse } from './types';
import type { ToastInterface } from 'vue-toastification';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly originalError?: unknown;

  constructor(message: string, statusCode: number, originalError?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Non autorisé') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Accès refusé') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Ressource introuvable') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApiError {
  public readonly fields: string[];

  constructor(messages: string | string[], statusCode = 422) {
    const arr = Array.isArray(messages) ? messages : [messages];
    super(arr.join(', '), statusCode);
    this.name = 'ValidationError';
    this.fields = arr;
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Erreur réseau — vérifiez votre connexion') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

// ─── Factory ───────────────────────────────────────────────────────────────────
export function parseApiError(payload: ApiErrorResponse): ApiError {
  const { statusCode, message } = payload;

  switch (statusCode) {
    case 401:
      return new UnauthorizedError(Array.isArray(message) ? message[0] : message);
    case 403:
      return new ForbiddenError(Array.isArray(message) ? message[0] : message);
    case 404:
      return new NotFoundError(Array.isArray(message) ? message[0] : message);
    case 422:
    case 400:
      return new ValidationError(message, statusCode);
    default:
      return new ApiError(Array.isArray(message) ? message.join(', ') : message, statusCode);
  }
}

// ─── Store error handler ──────────────────────────────────────────────────────
export function handleApiError(error: unknown, toast: ToastInterface, fallback: string) {
  if (error instanceof UnauthorizedError) {
    toast.error('Session expirée, veuillez vous reconnecter');
  } else if (error instanceof ForbiddenError) {
    toast.error('Accès refusé');
  } else if (error instanceof NotFoundError) {
    toast.error('Ressource introuvable');
  } else if (error instanceof ValidationError) {
    toast.error(error.fields.length > 1 ? error.fields.join(' — ') : error.message);
  } else if (error instanceof NetworkError) {
    toast.error('Erreur réseau — vérifiez votre connexion');
  } else if (error instanceof ApiError) {
    toast.error(error.message || fallback);
  } else {
    toast.error(fallback);
  }

  console.error(fallback, error);
}
