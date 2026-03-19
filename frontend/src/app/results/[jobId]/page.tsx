"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ExamPaper, { type ExamResult } from '@/components/output/ExamPaper';
import { generatePDF } from '@/lib/exportPDF';
import { getAuthHeader } from '@/store/authStore';
import { useWebSocket } from '@/lib/useWebSocket';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type AssignmentResult = ExamResult;

type Assignment = {
  _id: string;
  title: string;
  status: string;
  updatedAt: string;
  createdAt?: string;
  error?: string;
  result?: AssignmentResult | null;
};

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

export default function ResultsPage() {
  const params = useParams<{ jobId: string }>();
  const jobId = params?.jobId;
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [wsMessage] = useWebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws');

  const fetchAssignment = useCallback(() => {
    if (!jobId) return;
    fetch(`${API_URL}/api/assignments/${jobId}`, {
      headers: { ...getAuthHeader() },
    })
      .then(res => res.json())
      .then(data => {
        setAssignment(data as Assignment);
        setLoading(false);
        setRegenerating(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [jobId]);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  useEffect(() => {
    if (isWsJobProgressMessage(wsMessage) && wsMessage.jobId === jobId) {
      if (wsMessage.status.toLowerCase() === 'completed') {
        setTimeout(fetchAssignment, 1000);
      }
    }
  }, [wsMessage, jobId, fetchAssignment]);

  const handleRegenerate = async () => {
    if (!jobId) return;
    setRegenerating(true);
    try {
      const res = await fetch(`${API_URL}/api/assignments/${jobId}/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      if (res.ok) {
        setAssignment((prev) => (prev ? { ...prev, status: 'pending', result: null } : prev));
      } else {
        setRegenerating(false);
      }
    } catch (err) {
      console.error(err);
      setRegenerating(false);
    }
  };

  const handleShowAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  const handleExport = () => {
    if (assignment?.result) {
      generatePDF(assignment.title, assignment.result);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 animate-pulse mt-20" style={{ color: 'var(--dash-muted)' }}>
        <div className="w-4 h-4 border-2 border-zinc-600 border-t-brand-400 rounded-full animate-spin" />
        Loading results...
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--dash-fg)' }}>Result not found.</h2>
        <button onClick={() => router.push('/dashboard')} className="text-brand-400 hover:underline text-sm font-medium">
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (regenerating || (assignment.status !== 'completed' && assignment.status !== 'failed')) {
    return (
      <div className="max-w-5xl mx-auto pb-20">
        <div className="flex flex-col items-center justify-center mt-20 gap-4">
          <div className="w-12 h-12 border-[3px] rounded-full animate-spin" style={{ borderColor: 'var(--dash-border-2)', borderTopColor: '#60a5fa' }}></div>
          <p className="font-medium" style={{ color: 'var(--dash-muted)' }}>
            {regenerating ? 'Regenerating exam paper...' : 'Processing...'}
          </p>
          <p className="text-sm" style={{ color: 'var(--dash-muted-2)' }}>This page will update automatically when ready.</p>
        </div>
      </div>
    );
  }

  if (assignment.status === 'failed') {
    return (
      <div className="max-w-5xl mx-auto pb-20">
        <div className="text-center mt-20">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--dash-fg)' }}>Generation Failed</h2>
          <p className="mb-6 text-sm" style={{ color: 'var(--dash-muted)' }}>{assignment.error || 'An unexpected error occurred.'}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleRegenerate}
              className="font-bold px-6 py-2.5 rounded-xl transition text-sm border"
              style={{ background: 'var(--dash-fg)', color: 'var(--dash-bg)', borderColor: 'var(--dash-border-2)' }}
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="font-medium px-6 py-2.5 rounded-xl transition text-sm border"
              style={{ background: 'var(--dash-input)', color: 'var(--dash-fg)', borderColor: 'var(--dash-border-2)' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Action Bar */}
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 p-5 rounded-2xl border"
        style={{ background: 'var(--dash-surface)', borderColor: 'var(--dash-border-2)' }}
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold" style={{ color: 'var(--dash-fg)' }}>{assignment.title}</h1>
            <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-green-500/20">{assignment.status}</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--dash-muted-2)' }}>
            Generated on {new Date(assignment.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Show Answers Toggle */}
          <label onClick={handleShowAnswers} className="flex items-center gap-2.5 cursor-pointer p-2 hover:bg-white/[0.04] rounded-xl transition">
            <div className={`w-10 h-5 rounded-full relative transition-colors ${showAnswers ? 'bg-brand-500' : 'bg-zinc-700'}`}>
              <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${showAnswers ? 'translate-x-5' : ''}`}></div>
            </div>
            <span className="font-medium select-none text-sm" style={{ color: 'var(--dash-muted)' }}>Answers</span>
          </label>

          {/* Regenerate Button */}
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex items-center gap-2 font-medium px-4 py-2 rounded-xl transition text-sm border disabled:opacity-40"
            style={{ background: 'var(--dash-input)', color: 'var(--dash-fg)', borderColor: 'var(--dash-border-2)' }}
          >
            <svg className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644V14.652" />
            </svg>
            Regenerate
          </button>

          {/* Export PDF */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 font-bold px-5 py-2 rounded-xl transition active:scale-95 text-sm border"
            style={{ background: 'var(--dash-fg)', color: 'var(--dash-bg)', borderColor: 'var(--dash-border-2)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Exam Paper */}
      <ExamPaper result={assignment.result as ExamResult} showAnswers={showAnswers} />
    </div>
  );
}
