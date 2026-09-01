export type role = 'user' | 'manager' | 'admin';

export type status = 'pending' | 'cancelled' | 'completed';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: role;
}

export interface Order {
  id: number;
  name: string;
  price: number;
  quantity: number;
  status: status;
}

export interface Paginate<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
