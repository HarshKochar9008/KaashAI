"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStore, useJobStore } from '@/store';
import FileUpload from '@/components/forms/FileUpload';
import SectionConfigurator from '@/components/forms/SectionConfigurator';
import GenerationProgress from '@/components/ui/GenerationProgress';
import { useWebSocket } from '@/lib/useWebSocket';

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
        <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Create Assignment</h2>
        <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">Let VedaAI construct a comprehensive exam tailored to your needs based on the provided curriculum.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-12 bg-white/50 p-8 rounded-[2rem] border border-slate-100 shadow-xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-[100px] -z-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] -z-10 opacity-50"></div>
        
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold shadow-sm">1</span> 
            Basic Information
          </h3>
          <div className="grid grid-cols-1 gap-6 pl-11">
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Assignment Title</label>
               <input 
                 type="text" 
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 className="w-full text-lg bg-white border border-slate-200 rounded-xl p-4 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition shadow-sm placeholder:text-slate-300" 
                 placeholder="e.g. Midterm Physics Evaluation"
                 required 
               />
             </div>
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Description (Optional)</label>
               <textarea 
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 className="w-full bg-white border border-slate-200 rounded-xl p-4 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition shadow-sm resize-none h-24 placeholder:text-slate-300" 
                 placeholder="Add context or instructions for your view..."
               />
             </div>
          </div>
        </div>

        <div className="pl-11 border-t border-slate-100 pt-10">
          <FileUpload />
        </div>

        <div className="pt-10">
          <SectionConfigurator />
        </div>

        <div className="flex justify-end pt-8 border-t border-slate-100">
           <button 
             type="submit" 
             disabled={isSubmitting || !title || files.length === 0}
             className="bg-slate-900 text-white font-bold rounded-full py-4 px-10 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 active:scale-95"
           >
             Generate Exam <span>→</span>
           </button>
        </div>
      </form>

      {isSubmitting && <GenerationProgress status={status} />}
    </div>
  );
}
