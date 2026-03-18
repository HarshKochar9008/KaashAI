"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ExamPaper from '@/components/output/ExamPaper';
import { generatePDF } from '@/lib/exportPDF';
import { getAuthHeader } from '@/store/authStore';

export default function ResultsPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetch(`http://localhost:3001/api/assignments/${jobId}`, {
        headers: { ...getAuthHeader() },
      })
        .then(res => res.json())
        .then(data => {
          setAssignment(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-zinc-500 animate-pulse mt-20">
        <div className="w-4 h-4 border-2 border-zinc-600 border-t-brand-400 rounded-full animate-spin" />
        Loading results...
      </div>
    );
  }

  if (!assignment || !assignment.result) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-white mb-3">Result not found or not ready.</h2>
        <button onClick={() => router.push('/dashboard')} className="text-brand-400 hover:underline text-sm font-medium">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleShowAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  const handleExport = () => {
    generatePDF(assignment.title, assignment.result);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 bg-white/[0.03] p-6 rounded-2xl border border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">{assignment.title}</h1>
            <span className="bg-green-500/10 text-green-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-green-500/20">{assignment.status}</span>
          </div>
          <p className="text-zinc-500 text-sm">Generated on {new Date(assignment.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <label onClick={handleShowAnswers} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/[0.04] rounded-xl transition">
            <div className={`w-11 h-6 rounded-full relative transition-colors ${showAnswers ? 'bg-brand-500' : 'bg-zinc-700'}`}>
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${showAnswers ? 'translate-x-5' : ''}`}></div>
            </div>
            <span className="font-medium text-zinc-300 select-none text-sm">Answers {showAnswers ? 'On' : 'Off'}</span>
          </label>
          
          <button 
            onClick={handleExport}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded-xl hover:bg-zinc-200 transition active:scale-95 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white/[0.02] p-4 md:p-8 rounded-2xl border border-white/[0.06]">
        <ExamPaper result={assignment.result} showAnswers={showAnswers} />
      </div>
    </div>
  );
}
