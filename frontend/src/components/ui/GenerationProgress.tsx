import React from 'react';

export default function GenerationProgress({ status }: { status: string }) {
  const isDone = status.toLowerCase() === 'completed';
  const isError = status.toLowerCase().includes('error') || status.toLowerCase().includes('failed');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-100 rounded-2xl p-10 max-w-md w-full shadow-2xl relative overflow-hidden border border-white/[0.08]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-purple-500"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl"></div>

        <div className="text-center relative z-10">
          {!isDone && !isError && (
            <div className="mb-8 relative flex justify-center">
              <div className="w-16 h-16 border-[3px] border-white/[0.06] border-t-brand-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-brand-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.5)]"></div>
              </div>
            </div>
          )}
          {isDone && (
            <div className="mb-6 w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          )}
          {isError && (
            <div className="mb-6 w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}

          <h2 className="text-xl font-bold text-white mb-1">
            {isDone ? 'Generation Complete!' : isError ? 'Generation Failed' : 'Crafting Your Exam...'}
          </h2>
          <p className="text-zinc-500 text-sm mb-6">
            {isDone ? 'Redirecting to results...' : isError ? 'Something went wrong' : 'This may take a moment'}
          </p>

          <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 flex items-center justify-center gap-3">
            {!isDone && !isError && <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>}
            <p className="text-zinc-400 font-medium text-sm">{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
