import { create } from 'zustand';

interface Section {
  id: string;
  type: string;
  count: number;
  difficulty: string;
  marksPerQuestion: number;
}

interface FormState {
  title: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  additionalInstructions: string;
  files: File[];
  sections: Section[];
  setTitle: (t: string) => void;
  setDescription: (d: string) => void;
  setDueDate: (d: string) => void;
  setTotalMarks: (m: number) => void;
  setAdditionalInstructions: (i: string) => void;
  setFiles: (f: File[]) => void;
  addSection: () => void;
  updateSection: (id: string, updates: Partial<Section>) => void;
  removeSection: (id: string) => void;
  resetForm: () => void;
}

const initialFormState = {
  title: '',
  description: '',
  dueDate: '',
  totalMarks: 0,
  additionalInstructions: '',
  files: [] as File[],
  sections: [{ id: '1', type: 'MCQ', count: 5, difficulty: 'Medium', marksPerQuestion: 1 }],
};

export const useFormStore = create<FormState>((set) => ({
  ...initialFormState,
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setDueDate: (dueDate) => set({ dueDate }),
  setTotalMarks: (totalMarks) => set({ totalMarks }),
  setAdditionalInstructions: (additionalInstructions) => set({ additionalInstructions }),
  setFiles: (files) => set({ files }),
  addSection: () => set((state) => ({
    sections: [...state.sections, { id: Date.now().toString(), type: 'MCQ', count: 5, difficulty: 'Medium', marksPerQuestion: 1 }]
  })),
  updateSection: (id, updates) => set((state) => ({
    sections: state.sections.map(s => s.id === id ? { ...s, ...updates } : s)
  })),
  removeSection: (id) => set((state) => ({
    sections: state.sections.filter(s => s.id !== id)
  })),
  resetForm: () => set({ ...initialFormState, sections: [{ id: '1', type: 'MCQ', count: 5, difficulty: 'Medium', marksPerQuestion: 1 }] }),
}));

interface JobState {
  jobId: string | null;
  status: string;
  result: unknown;
  setJobId: (id: string) => void;
  setStatus: (status: string) => void;
  setResult: (result: unknown) => void;
  resetJob: () => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobId: null,
  status: 'idle',
  result: null,
  setJobId: (jobId) => set({ jobId }),
  setStatus: (status) => set({ status }),
  setResult: (result) => set({ result }),
  resetJob: () => set({ jobId: null, status: 'idle', result: null }),
}));
