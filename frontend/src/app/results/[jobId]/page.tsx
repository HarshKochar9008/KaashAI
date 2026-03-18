"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ExamPaper from '@/components/output/ExamPaper';
import { generatePDF } from '@/lib/exportPDF';

export default function ResultsPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetch(`http://localhost:3001/api/assignments/${jobId}`)
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
    return <div className="text-slate-500 animate-pulse text-center mt-20">Loading results...</div>;
  }

  if (!assignment || !assignment.result) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-slate-800">Result not found or not ready.</h2>
        <button onClick={() => router.push('/')} className="mt-4 text-orange-600 hover:underline">Return to Home</button>
      </div>
    );
  }
  const handleShowAnswers = () => {
    console.log('Show Answers clicked');
    setShowAnswers(!showAnswers);
  };

  const handleExport = () => {
    generatePDF(assignment.title, assignment.result);
    setPdfGenerated(true);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{assignment.title}</h1>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{assignment.status}</span>
          </div>
          <p className="text-slate-500">Generated on {new Date(assignment.updatedAt).toLocaleDateString()}</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <label onClick={handleShowAnswers} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-xl transition">
            <div className={`w-12 h-6 rounded-full relative transition-colors ${showAnswers ? 'bg-orange-500' : 'bg-slate-200'}`}>
               <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${showAnswers ? 'translate-x-6' : ''}`}></div>
            </div>
            <span className="font-semibold text-slate-700 select-none">Show Answers {showAnswers ? 'On' : 'Off'}</span>
          </label>
          
          <button 
            onClick={handleExport}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <span>📄</span> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-slate-50/50 p-4 md:p-8 rounded-[2rem] border border-slate-200 backdrop-blur-sm">
        <ExamPaper result={assignment.result} showAnswers={showAnswers} />
      </div>
    </div>
  );
}
