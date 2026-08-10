const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  _count?: { products: number };
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  createdAt: string;
  user?: { id: string; name: string; email: string };
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  categoryId: string;
  category?: Category;
  reviews?: Review[];
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  createdAt: string;
  user?: { id: string; name: string; email: string };
}

export const getAuthToken = () => localStorage.getItem('token');

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; message: string; data?: T }> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (err: any) {
    throw new Error(err.message || 'Network error');
  }
}

export const api = {
  // Auth
  register: (body: any) => request<{ user: User; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request<{ user: User; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getProfile: () => request<User>('/auth/me'),

  // Categories
  getCategories: () => request<Category[]>('/categories'),
  createCategory: (body: any) => request<Category>('/categories', { method: 'POST', body: JSON.stringify(body) }),
  deleteCategory: (id: string) => request(`/categories/${id}`, { method: 'DELETE' }),

  // Products
  getProducts: (params?: { categoryId?: string; search?: string }) => {
    const qParams = new URLSearchParams();
    if (params?.categoryId) qParams.append('categoryId', params.categoryId);
    if (params?.search) qParams.append('search', params.search);
    const q = qParams.toString();
    return request<Product[]>(`/products${q ? `?${q}` : ''}`);
  },
  getProductById: (id: string) => request<Product>(`/products/${id}`),
  createProduct: (body: any) => request<Product>('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id: string, body: any) => request<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id: string) => request(`/products/${id}`, { method: 'DELETE' }),

  // Reviews
  getReviews: (productId?: string) => request<Review[]>(`/reviews${productId ? `?productId=${productId}` : ''}`),
  createReview: (body: any) => request<Review>('/reviews', { method: 'POST', body: JSON.stringify(body) }),
  deleteReview: (id: string) => request(`/reviews/${id}`, { method: 'DELETE' }),

  // Orders
  getOrders: () => request<Order[]>('/orders'),
  createOrder: (body: any) => request<Order>('/orders', { method: 'POST', body: JSON.stringify(body) }),
  updateOrderStatus: (id: string, status: string) => request<Order>(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  deleteOrder: (id: string) => request(`/orders/${id}`, { method: 'DELETE' }),

  // Users (Admin)
  getUsers: () => request<User[]>('/users'),
  deleteUser: (id: string) => request(`/users/${id}`, { method: 'DELETE' }),
};
