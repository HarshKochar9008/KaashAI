import React, { useRef, useState } from 'react';
import { useFormStore } from '@/store';

export default function FileUpload() {
  const { files, setFiles } = useFormStore();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter(
        f => f.type === 'application/pdf' || f.type === 'text/plain'
      );
      if (validFiles.length > 0) setFiles([...files, ...validFiles]);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  return (
    <div className="w-full">
      <p className="text-sm text-zinc-500 mb-4">Upload PDF or text files for the AI to base questions on. This is optional -- if no files are provided, the AI will generate general questions.</p>
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${isDragging ? 'border-brand-400 bg-brand-500/5' : 'border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.15]'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <p className="text-zinc-300 font-medium mb-1">Drag and drop files here</p>
        <p className="text-zinc-600 text-sm mb-4">or click to browse from your device</p>
        <div className="bg-white/[0.06] text-zinc-300 rounded-lg px-5 py-2 inline-block text-sm font-medium border border-white/[0.08] hover:bg-white/[0.1] transition">Browse Files</div>
        <input
          type="file"
          multiple
          accept=".pdf,.txt"
          className="hidden"
          ref={fileInputRef}
          onChange={handleChange}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-5 flex flex-col gap-2">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Uploaded Files</h4>
          {files.map((f, i) => (
            <div key={i} className="flex justify-between items-center bg-white/[0.04] border border-white/[0.06] p-3.5 rounded-xl">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <span className="text-zinc-300 text-sm font-medium truncate">{f.name}</span>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFiles(files.filter((_, idx) => idx !== i)); }}
                className="text-zinc-600 hover:text-red-400 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
