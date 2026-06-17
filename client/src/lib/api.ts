const API_BASE = '/api';

// Get stored auth token
function getToken(): string | null {
  return localStorage.getItem('shopeezz_token');
}

// Set auth token
export function setToken(token: string): void {
  localStorage.setItem('shopeezz_token', token);
}

// Remove auth token
export function removeToken(): void {
  localStorage.removeItem('shopeezz_token');
}

// Generic API request helper
async function apiRequest<T>(
  method: string,
  url: string,
  body?: unknown
): Promise<{ success: boolean; data?: T; message?: string; count?: number }> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${url}`, config);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || 'Something went wrong');
  }

  return json;
}

// ─── Auth API ────────────────────────────────────────
export const authApi = {
  register: (fullName: string, email: string, password: string) =>
    apiRequest<{ user: any; token: string }>('POST', '/auth/register', { fullName, email, password }),

  login: (email: string, password: string) =>
    apiRequest<{ user: any; token: string }>('POST', '/auth/login', { email, password }),

  getProfile: () =>
    apiRequest<any>('GET', '/auth/profile'),

  updateProfile: (updates: Record<string, unknown>) =>
    apiRequest<any>('PUT', '/auth/profile', updates),
};

// ─── Products API ────────────────────────────────────
export const productsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest<any[]>('GET', `/products${query}`);
  },

  getById: (id: string) =>
    apiRequest<any>('GET', `/products/${id}`),

  create: (data: Record<string, unknown>) =>
    apiRequest<any>('POST', '/products', data),

  update: (id: string, data: Record<string, unknown>) =>
    apiRequest<any>('PUT', `/products/${id}`, data),

  delete: (id: string) =>
    apiRequest<any>('DELETE', `/products/${id}`),
};

// ─── Categories API ──────────────────────────────────
export const categoriesApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest<any[]>('GET', `/categories${query}`);
  },

  create: (data: Record<string, unknown>) =>
    apiRequest<any>('POST', '/categories', data),

  update: (id: string, data: Record<string, unknown>) =>
    apiRequest<any>('PUT', `/categories/${id}`, data),

  delete: (id: string) =>
    apiRequest<any>('DELETE', `/categories/${id}`),
};

// ─── Cart API ────────────────────────────────────────
export const cartApi = {
  get: () =>
    apiRequest<any[]>('GET', '/cart'),

  add: (productId: string, quantity: number = 1) =>
    apiRequest<any[]>('POST', '/cart', { productId, quantity }),

  updateQuantity: (itemId: string, quantity: number) =>
    apiRequest<any>('PUT', `/cart/${itemId}`, { quantity }),

  remove: (itemId: string) =>
    apiRequest<any>('DELETE', `/cart/${itemId}`),

  clear: () =>
    apiRequest<any>('DELETE', '/cart/clear'),
};

// ─── Orders API ──────────────────────────────────────
export const ordersApi = {
  create: (data: Record<string, unknown>) =>
    apiRequest<any>('POST', '/orders', data),

  getAll: () =>
    apiRequest<any[]>('GET', '/orders'),

  getById: (id: string) =>
    apiRequest<any>('GET', `/orders/${id}`),
};

// ─── Admin API ───────────────────────────────────────
export const adminApi = {
  getConfig: () =>
    apiRequest<any>('GET', '/admin/config'),

  getStats: () =>
    apiRequest<any>('GET', '/admin/stats'),

  getUsers: () =>
    apiRequest<any[]>('GET', '/admin/users'),

  getOrders: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest<any[]>('GET', `/admin/orders${query}`);
  },

  updateOrderStatus: (id: string, status: string) =>
    apiRequest<any>('PUT', `/admin/orders/${id}`, { status }),
};
