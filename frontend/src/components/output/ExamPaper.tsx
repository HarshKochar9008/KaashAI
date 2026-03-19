import React from 'react';

interface Question {
  question: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  difficulty?: string;
  marks?: number;
}

interface Section {
  section_title: string;
  instruction?: string;
  questions: Question[];
}

export interface ExamResult {
  title?: string;
  totalMarks?: number;
  duration?: string;
  sections?: Section[];
}

export default function ExamPaper({ result, showAnswers }: { result: ExamResult; showAnswers: boolean }) {
  if (!result || !result.sections) {
    return <div className="text-zinc-500 italic p-8 text-center">No content generated yet.</div>;
  }

  return (
    <div id="exam-paper" className="bg-white rounded-2xl shadow-xl max-w-4xl mx-auto overflow-hidden">
      {/* Paper Header */}
      <div className="bg-slate-900 text-white px-8 md:px-12 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center tracking-tight mb-4">
          {result.title || 'Examination Paper'}
        </h1>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {result.duration && (
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-1.5 text-sm font-medium">
              <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {result.duration}
            </div>
          )}
          {result.totalMarks && (
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-1.5 text-sm font-medium">
              <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              Max Marks: {result.totalMarks}
            </div>
          )}
        </div>
      </div>

      {/* Student Info Section */}
      <div className="px-8 md:px-12 py-6 bg-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-600 whitespace-nowrap">Name:</span>
            <div className="flex-1 border-b-2 border-slate-300 pb-1 min-h-[24px]"></div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-600 whitespace-nowrap">Roll No:</span>
            <div className="flex-1 border-b-2 border-slate-300 pb-1 min-h-[24px]"></div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-600 whitespace-nowrap">Section:</span>
            <div className="flex-1 border-b-2 border-slate-300 pb-1 min-h-[24px]"></div>
          </div>
        </div>
      </div>

      {/* General Instructions */}
      <div className="px-8 md:px-12 py-4 border-b border-slate-200">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">General Instructions</p>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>All questions are compulsory unless stated otherwise.</li>
          <li>Write your answers clearly and legibly.</li>
          <li>Marks for each question are indicated alongside.</li>
        </ul>
      </div>

      {/* Question Sections */}
      <div className="px-8 md:px-12 py-8 space-y-10">
        {result.sections.map((section, sIdx) => (
          <div key={sIdx}>
            {/* Section Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-lg font-bold text-slate-800">
                  {section.section_title || `Section ${String.fromCharCode(65 + sIdx)}`}
                </h2>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>
              {section.instruction && (
                <p className="text-sm text-slate-500 italic">{section.instruction}</p>
              )}
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {section.questions.map((q, qIdx) => (
                <div key={qIdx} className="relative pl-10">
                  {/* Question Number */}
                  <div className="absolute left-0 top-0.5 w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-600">{qIdx + 1}</span>
                  </div>

                  {/* Question Content */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-[15px] font-medium text-slate-800 leading-relaxed flex-1">{q.question}</h3>
                      {q.marks && (
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 whitespace-nowrap flex-shrink-0 mt-0.5">
                          {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
                        </span>
                      )}
                    </div>

                    {/* MCQ Options */}
                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex gap-2.5 items-start p-2.5 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                            <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0 mt-0.5">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="text-sm text-slate-700 leading-relaxed">{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Answer space for non-MCQ */}
                    {(!q.options || q.options.length === 0) && (
                      <div className="mt-3 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 min-h-[80px] flex items-center justify-center">
                        <span className="text-xs text-slate-400 italic">Answer space</span>
                      </div>
                    )}

                    {/* Answer reveal */}
                    {showAnswers && q.answer && (
                      <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                        <div className="pl-3">
                          <div className="flex gap-2 items-start">
                            <span className="font-bold text-emerald-700 text-sm">Answer:</span>
                            <span className="text-emerald-800 text-sm">{q.answer}</span>
                          </div>
                          {q.explanation && (
                            <div className="mt-2 pt-2 border-t border-emerald-200/60">
                              <span className="font-bold text-emerald-700 text-xs">Explanation: </span>
                              <span className="text-emerald-700/80 text-xs">{q.explanation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-8 md:px-12 py-4 bg-slate-50 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400">Generated by KaashAI</p>
      </div>
    </div>
  );
}
