import { create } from 'zustand';

interface Section {
  id: string;
  type: string;
  count: number;
  difficulty: string;
}

interface FormState {
  title: string;
  description: string;
  files: File[];
  sections: Section[];
  setTitle: (t: string) => void;
  setDescription: (d: string) => void;
  setFiles: (f: File[]) => void;
  addSection: () => void;
  updateSection: (id: string, updates: Partial<Section>) => void;
  removeSection: (id: string) => void;
}

export const useFormStore = create<FormState>((set) => ({
  title: '',
  description: '',
  files: [],
  sections: [{ id: '1', type: 'MCQ', count: 5, difficulty: 'Medium' }],
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setFiles: (files) => set({ files }),
  addSection: () => set((state) => ({
    sections: [...state.sections, { id: Date.now().toString(), type: 'MCQ', count: 5, difficulty: 'Medium' }]
  })),
  updateSection: (id, updates) => set((state) => ({
    sections: state.sections.map(s => s.id === id ? { ...s, ...updates } : s)
  })),
  removeSection: (id) => set((state) => ({
    sections: state.sections.filter(s => s.id !== id)
  }))
}));

interface JobState {
  jobId: string | null;
  status: string;
  result: any;
  setJobId: (id: string) => void;
  setStatus: (status: string) => void;
  setResult: (result: any) => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobId: null,
  status: 'idle',
  result: null,
  setJobId: (jobId) => set({ jobId }),
  setStatus: (status) => set({ status }),
  setResult: (result) => set({ result }),
}));

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar: string | null;
  department: string | null;
  phone: string | null;
  status: 'active' | 'inactive';
  assignmentsCount: number;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  teachers: number;
  students: number;
}

interface UserState {
  users: User[];
  stats: UserStats | null;
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchUser: (id: string) => Promise<void>;
  createUser: (data: Partial<User>) => Promise<User | null>;
  updateUser: (id: string, data: Partial<User>) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
  clearError: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  stats: null,
  selectedUser: null,
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/users`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const users = await res.json();
      set({ users, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchStats: async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const stats = await res.json();
      set({ stats });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  fetchUser: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`);
      if (!res.ok) throw new Error('User not found');
      const user = await res.json();
      set({ selectedUser: user, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  createUser: async (data) => {
    set({ error: null });
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create user');
      }
      const user = await res.json();
      set((state) => ({ users: [user, ...state.users] }));
      return user;
    } catch (err: any) {
      set({ error: err.message });
      return null;
    }
  },

  updateUser: async (id, data) => {
    set({ error: null });
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update user');
      }
      const updated = await res.json();
      set((state) => ({
        users: state.users.map((u) => (u._id === id ? updated : u)),
        selectedUser: state.selectedUser?._id === id ? updated : state.selectedUser,
      }));
      return updated;
    } catch (err: any) {
      set({ error: err.message });
      return null;
    }
  },

  deleteUser: async (id) => {
    set({ error: null });
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      set((state) => ({
        users: state.users.filter((u) => u._id !== id),
        selectedUser: state.selectedUser?._id === id ? null : state.selectedUser,
      }));
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
