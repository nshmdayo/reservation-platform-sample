import axios from 'axios';
import { AuthResponse, LoginRequest, RegisterRequest, Salon, Reservation } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8082/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add authentication token)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If authentication error, remove token from local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Beauty Salon API
export const salonAPI = {
  getSalons: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/salons', { params });
    return response.data;
  },

  getSalon: async (id: number): Promise<Salon> => {
    const response = await api.get(`/salons/${id}`);
    return response.data;
  },

  getAvailableSlots: async (salonId: number, params: { staff_id?: number; date: string }) => {
    const response = await api.get(`/salons/${salonId}/slots`, { params });
    return response.data;
  },
};

// Reservation API
export const reservationAPI = {
  getReservations: async (): Promise<Reservation[]> => {
    const response = await api.get('/reservations');
    return response.data;
  },

  getReservation: async (id: number): Promise<Reservation> => {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },

  createReservation: async (data: Partial<Reservation>): Promise<Reservation> => {
    const response = await api.post('/reservations', data);
    return response.data;
  },

  updateReservation: async (id: number, data: Partial<Reservation>): Promise<Reservation> => {
    const response = await api.put(`/reservations/${id}`, data);
    return response.data;
  },

  cancelReservation: async (id: number) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
  },
};

export default api;
