export interface Salon {
  id: number;
  name: string;
  description: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  image_url?: string;
  opening_hours?: Record<string, any>;
  latitude?: number;
  longitude?: number;
  staff?: Staff[];
  services?: Service[];
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: number;
  salon_id: number;
  name: string;
  description?: string;
  image_url?: string;
  specialties?: string[];
  experience_years?: number;
  working_hours?: Record<string, any>;
  is_active: boolean;
  salon?: Salon;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  salon_id: number;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  category?: string;
  is_active: boolean;
  salon?: Salon;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  role: 'customer' | 'admin' | 'staff';
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: number;
  salon_id: number;
  staff_id: number;
  user_id: number;
  service_id: number;
  reservation_date: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  total_price: number;
  salon?: Salon;
  staff?: Staff;
  user?: User;
  service?: Service;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}
