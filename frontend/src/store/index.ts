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
