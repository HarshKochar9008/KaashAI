import React from 'react';

export default function GenerationProgress({ status }: { status: string }) {
  const isDone = status.toLowerCase() === 'completed';
  const isError = status.toLowerCase().includes('error') || status.toLowerCase().includes('failed');

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="text-center relative z-10">
          {!isDone && !isError && (
            <div className="mb-8 relative flex justify-center">
              <div className="w-20 h-20 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin shadow-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
            </div>
          )}
          {isDone && <div className="text-6xl mb-6 bounce-in">🎯</div>}
          {isError && <div className="text-6xl mb-6 text-red-500">❌</div>}
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {isDone ? 'Generation Complete!' : isError ? 'Generation Failed' : 'Crafting Exam...'}
          </h2>
          
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-6 flex items-center justify-center gap-3">
             {!isDone && !isError && <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>}
             <p className="text-slate-600 font-medium text-sm">{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
