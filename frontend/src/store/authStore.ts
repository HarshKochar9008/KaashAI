import { create } from 'zustand';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface User {
  _id: string;
  name: string;
  email: string;
  institution: string;
  location: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  signup: (name: string, email: string, password: string, institution?: string, location?: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loadUser: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'institution' | 'location'>>) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('vedaai_token') : null,
  loading: true,
  error: null,

  signup: async (name, email, password, institution, location) => {
    set({ error: null, loading: true });
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, institution, location }),
      });
      const data = await res.json();
      if (!res.ok) {
        set({ error: data.error, loading: false });
        return false;
      }
      localStorage.setItem('vedaai_token', data.token);
      set({ user: data.user, token: data.token, loading: false });
      return true;
    } catch {
      set({ error: 'Network error. Please try again.', loading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ error: null, loading: true });
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        set({ error: data.error, loading: false });
        return false;
      }
      localStorage.setItem('vedaai_token', data.token);
      set({ user: data.user, token: data.token, loading: false });
      return true;
    } catch {
      set({ error: 'Network error. Please try again.', loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('vedaai_token');
    set({ user: null, token: null, loading: false });
  },

  loadUser: async () => {
    const token = get().token;
    if (!token) {
      set({ loading: false });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        localStorage.removeItem('vedaai_token');
        set({ user: null, token: null, loading: false });
        return;
      }
      const data = await res.json();
      set({ user: data.user, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  updateProfile: async (updates) => {
    const token = get().token;
    if (!token) return false;
    set({ error: null });
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) {
        set({ error: data.error || 'Failed to update profile' });
        return false;
      }
      set({ user: data.user });
      return true;
    } catch {
      set({ error: 'Network error. Please try again.' });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export function getAuthHeader(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('vedaai_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
