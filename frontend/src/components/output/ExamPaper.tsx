import React from 'react';

export default function ExamPaper({ result, showAnswers }: { result: any, showAnswers: boolean }) {
  if (!result || !result.sections) {
    return <div className="text-slate-500 italic p-8">No content generated yet.</div>;
  }

  return (
    <div className="bg-white rounded-3xl p-10 md:p-16 border border-slate-200 shadow-xl max-w-4xl mx-auto space-y-12">
      <div className="text-center border-b-[3px] border-slate-100 pb-8 mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase leading-tight">
          {result.title || "Examination Paper"}
        </h1>
        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-sm font-semibold text-slate-500 uppercase tracking-widest">Time: 120 Mins</div>
          <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-sm font-semibold text-slate-500 uppercase tracking-widest">Max Marks: 100</div>
        </div>
      </div>

      {result.sections.map((section: any, sIdx: number) => (
        <div key={sIdx} className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-800">Section {String.fromCharCode(65 + sIdx)}: {section.section_title}</h2>
            <div className="h-0.5 bg-slate-200 flex-1"></div>
          </div>
          
          <div className="space-y-10 pl-4 md:pl-8">
            {section.questions.map((q: any, qIdx: number) => (
              <div key={qIdx} className="group relative">
                <div className="absolute -left-8 md:-left-12 top-0 w-8 md:w-10 text-right font-bold text-slate-400 text-lg">
                  {qIdx + 1}.
                </div>
                
                <h3 className="text-lg font-medium text-slate-900 leading-relaxed mb-4">{q.question}</h3>
                
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 mt-2">
                    {q.options.map((opt: string, oIdx: number) => (
                      <div key={oIdx} className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200 cursor-pointer">
                        <span className="font-bold text-slate-400 mt-0.5">{String.fromCharCode(65 + oIdx)})</span>
                        <span className="text-slate-700">{opt}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {!q.options && (
                  <div className="h-32 mt-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50"></div>
                )}

                {showAnswers && q.answer && (
                  <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-xl relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                    <div className="flex gap-2">
                      <span className="font-bold text-green-700">Answer:</span>
                      <span className="text-green-800">{q.answer}</span>
                    </div>
                    {q.explanation && (
                      <div className="mt-3 pt-3 border-t border-green-200/50 flex gap-2">
                         <span className="font-bold text-green-700 text-sm">Explanation:</span>
                         <span className="text-green-800/80 text-sm">{q.explanation}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
