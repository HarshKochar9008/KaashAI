"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStore, useJobStore } from '@/store';
import FileUpload from '@/components/forms/FileUpload';
import SectionConfigurator from '@/components/forms/SectionConfigurator';
import GenerationProgress from '@/components/ui/GenerationProgress';
import { useWebSocket } from '@/lib/useWebSocket';
import { getAuthHeader } from '@/store/authStore';
import CreateAssignmentMobile from '@/components/mobile/CreateAssignmentMobile';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type WsJobProgress = {
  type: 'job_progress';
  jobId: string;
  status: string;
};

function isWsJobProgressMessage(msg: unknown): msg is WsJobProgress {
  if (!msg || typeof msg !== 'object') return false;
  const rec = msg as Record<string, unknown>;
  return rec.type === 'job_progress' && typeof rec.jobId === 'string' && typeof rec.status === 'string';
}

export default function CreateAssignmentPage() {
  const router = useRouter();
  const {
    title, description, dueDate, totalMarks, additionalInstructions,
    files, sections,
    setTitle, setDescription, setDueDate, setTotalMarks, setAdditionalInstructions,
  } = useFormStore();
  const { jobId, status, setJobId, setStatus } = useJobStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [wsMessage] = useWebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws');

  useEffect(() => {
    if (isWsJobProgressMessage(wsMessage)) {
      if (wsMessage.jobId === jobId) {
        setStatus(wsMessage.status);
        if (wsMessage.status.toLowerCase() === 'completed') {
          setTimeout(() => {
            router.push(`/results/${jobId}`);
          }, 1500);
        }
      }
    }
  }, [wsMessage, jobId, router, setStatus]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title || title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    for (const section of sections) {
      if (section.count < 1) {
        newErrors[`section_${section.id}_count`] = 'Count must be at least 1';
      }
      if (section.marksPerQuestion < 1) {
        newErrors[`section_${section.id}_marks`] = 'Marks must be at least 1';
      }
    }
    if (totalMarks < 0) {
      newErrors.totalMarks = 'Total marks cannot be negative';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setStatus('Uploading and Starting Job...');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('sections', JSON.stringify(sections));
    if (dueDate) formData.append('dueDate', dueDate);
    if (totalMarks > 0) formData.append('totalMarks', totalMarks.toString());
    if (additionalInstructions) formData.append('additionalInstructions', additionalInstructions);

    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const res = await fetch(`${API_URL}/api/assignments`, {
        method: 'POST',
        headers: { ...getAuthHeader() },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setJobId(data.id);
        setStatus('Pending in Queue...');
      } else {
        setStatus(`Error: ${data.error}`);
        setIsSubmitting(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(err);
      setStatus(`Error: ${message}`);
      setIsSubmitting(false);
    }
  };

  const desktop = (
    <div className="hidden md:block max-w-4xl mx-auto pb-16">
      <div className="mb-8 sm:mb-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight" style={{ color: 'var(--dash-fg)' }}>
          Create Assignment
        </h2>
        <p className="max-w-lg mx-auto text-base sm:text-lg leading-relaxed" style={{ color: 'var(--dash-muted)' }}>
          Let KaashAI construct a comprehensive exam tailored to your needs based on the provided curriculum.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-10 p-4 sm:p-6 lg:p-8 rounded-2xl border relative overflow-hidden"
        style={{ background: 'var(--dash-surface)', borderColor: 'var(--dash-border-2)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] -z-10"></div>

        {/* Step 1: Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-3" style={{ color: 'var(--dash-fg)' }}>
            <span className="w-7 h-7 rounded-lg bg-brand-500/15 text-brand-400 flex items-center justify-center text-xs font-bold border border-brand-500/20">1</span>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 gap-6 pl-0 sm:pl-10">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dash-muted)' }}>Assignment Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: '' })); }}
                className={`w-full text-base border rounded-xl p-4 placeholder:text-zinc-400 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 outline-none transition ${errors.title ? 'border-red-500/50' : ''}`}
                style={{ background: 'var(--dash-input)', borderColor: errors.title ? 'rgba(239,68,68,0.45)' : 'var(--dash-border-2)', color: 'var(--dash-fg)' }}
                placeholder="e.g. Midterm Physics Evaluation"
              />
              {errors.title && <p className="text-red-400 text-xs mt-1.5">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dash-muted)' }}>Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-xl p-4 placeholder:text-zinc-400 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 outline-none transition resize-none h-24"
                style={{ background: 'var(--dash-input)', borderColor: 'var(--dash-border-2)', color: 'var(--dash-fg)' }}
                placeholder="Add context or instructions for your exam..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dash-muted)' }}>Due Date (Optional)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 outline-none transition"
                  style={{ background: 'var(--dash-input)', borderColor: 'var(--dash-border-2)', color: 'var(--dash-fg)', colorScheme: 'light' }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dash-muted)' }}>Total Marks (Optional)</label>
                <input
                  type="number"
                  min="0"
                  value={totalMarks || ''}
                  onChange={(e) => { setTotalMarks(parseInt(e.target.value) || 0); setErrors(prev => ({ ...prev, totalMarks: '' })); }}
                  className={`w-full border rounded-xl p-4 placeholder:text-zinc-400 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 outline-none transition`}
                  style={{ background: 'var(--dash-input)', borderColor: errors.totalMarks ? 'rgba(239,68,68,0.45)' : 'var(--dash-border-2)', color: 'var(--dash-fg)' }}
                  placeholder="e.g. 100"
                />
                {errors.totalMarks && <p className="text-red-400 text-xs mt-1.5">{errors.totalMarks}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: File Upload */}
        <div className="pt-10 border-t" style={{ borderColor: 'var(--dash-border-2)' }}>
          <h3 className="text-lg font-bold flex items-center gap-3 mb-6" style={{ color: 'var(--dash-fg)' }}>
            <span className="w-7 h-7 rounded-lg bg-brand-500/15 text-brand-400 flex items-center justify-center text-xs font-bold border border-brand-500/20">2</span>
            Reference Material
          </h3>
          <div className="pl-0 sm:pl-10">
            <FileUpload />
          </div>
        </div>

        {/* Step 3: Section Configuration */}
        <div className="pt-10 border-t" style={{ borderColor: 'var(--dash-border-2)' }}>
          <SectionConfigurator errors={errors} />
        </div>

        {/* Step 4: Additional Instructions */}
        <div className="pt-10 border-t" style={{ borderColor: 'var(--dash-border-2)' }}>
          <h3 className="text-lg font-bold flex items-center gap-3 mb-6" style={{ color: 'var(--dash-fg)' }}>
            <span className="w-7 h-7 rounded-lg bg-brand-500/15 text-brand-400 flex items-center justify-center text-xs font-bold border border-brand-500/20">4</span>
            Additional Instructions (Optional)
          </h3>
          <div className="pl-0 sm:pl-10">
            <textarea
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              className="w-full border rounded-xl p-4 placeholder:text-zinc-400 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 outline-none transition resize-none h-28"
              style={{ background: 'var(--dash-input)', borderColor: 'var(--dash-border-2)', color: 'var(--dash-fg)' }}
              placeholder="e.g. Focus on chapters 3-5, include application-based questions, avoid questions on thermodynamics..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-8 border-t" style={{ borderColor: 'var(--dash-border-2)' }}>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="font-bold rounded-full py-3.5 px-10 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-3 active:scale-95 border"
            style={{ background: 'var(--dash-fg)', color: 'var(--dash-bg)', borderColor: 'var(--dash-border-2)' }}
          >
            Generate Exam
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </form>

      {isSubmitting && <GenerationProgress status={status} />}
    </div>
  );

  return (
    <>
      {desktop}
      <CreateAssignmentMobile />
    </>
  );
}
