"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStore, useJobStore } from '@/store';
import FileUpload from '@/components/forms/FileUpload';
import SectionConfigurator from '@/components/forms/SectionConfigurator';
import GenerationProgress from '@/components/ui/GenerationProgress';
import { useWebSocket } from '@/lib/useWebSocket';
import { getAuthHeader } from '@/store/authStore';

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { title, description, files, sections, setTitle, setDescription } = useFormStore();
  const { jobId, status, setJobId, setStatus } = useJobStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wsMessage] = useWebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws');

  useEffect(() => {
    if (wsMessage && wsMessage.type === 'job_progress') {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert('Title is required');
    if (files.length === 0) return alert('Please upload at least one file for context');

    setIsSubmitting(true);
    setStatus('Uploading and Starting Job...');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('sections', JSON.stringify(sections));
    
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const res = await fetch('http://localhost:3001/api/assignments', {
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
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Create Assignment</h2>
        <p className="text-zinc-500 max-w-lg mx-auto text-lg leading-relaxed">Let KaashAI construct a comprehensive exam tailored to your needs based on the provided curriculum.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-10 bg-white/[0.03] p-8 rounded-2xl border border-white/[0.06] backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] -z-10"></div>
        
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-zinc-200 flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-brand-500/15 text-brand-400 flex items-center justify-center text-xs font-bold border border-brand-500/20">1</span> 
            Basic Information
          </h3>
          <div className="grid grid-cols-1 gap-6 pl-10">
            <div>
              <label className="block text-sm font-semibold text-zinc-400 mb-2">Assignment Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-base bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 outline-none transition" 
                placeholder="e.g. Midterm Physics Evaluation"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-400 mb-2">Description (Optional)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 outline-none transition resize-none h-24" 
                placeholder="Add context or instructions for your exam..."
              />
            </div>
          </div>
        </div>

        <div className="pl-10 border-t border-white/[0.06] pt-10">
          <FileUpload />
        </div>

        <div className="pt-10">
          <SectionConfigurator />
        </div>

        <div className="flex justify-end pt-8 border-t border-white/[0.06]">
          <button 
            type="submit" 
            disabled={isSubmitting || !title || files.length === 0}
            className="bg-white text-black font-bold rounded-full py-3.5 px-10 hover:bg-zinc-200 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-3 active:scale-95"
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
}
