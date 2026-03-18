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
      setFiles(Array.from(e.dataTransfer.files));
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4 text-slate-800">Upload Reference Material (PDF/TXT)</h3>
      <div 
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <span className="text-4xl block mb-4">📄</span>
        <p className="text-slate-600 font-medium mb-2">Drag and drop files here</p>
        <p className="text-slate-400 text-sm mb-6">or click to browse from your device</p>
        <div className="bg-slate-900 text-white rounded-full px-6 py-2 inline-block cursor-pointer shadow-md hover:bg-slate-800 transition md:mx-auto">Browse Files</div>
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
        <div className="mt-6 flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-slate-700">Uploaded Files</h4>
          {files.map((f, i) => (
            <div key={i} className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <span className="text-slate-800 text-sm font-medium pr-4 truncate">{f.name}</span>
              <button 
                onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                className="text-red-500 hover:text-red-700 text-sm font-bold w-6 h-6 rounded flex items-center justify-center bg-red-50 hover:bg-red-100 transition"
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
