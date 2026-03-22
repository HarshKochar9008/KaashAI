"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStore, useJobStore } from '@/store';
import GenerationProgress from '@/components/ui/GenerationProgress';
import { useWebSocket } from '@/lib/useWebSocket';
import { getAuthHeader } from '@/store/authStore';
import CreateAssignmentMobile from '@/components/mobile/CreateAssignmentMobile';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

export default function CreateAssignmentPage() {
  const router = useRouter();
  const {
    title, dueDate, additionalInstructions,
    files, sections,
    setTitle, setDueDate, setAdditionalInstructions, setFiles, addSection, updateSection, removeSection,
  } = useFormStore();
  const { jobId, status, setJobId, setStatus } = useJobStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [wsMessage] = useWebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws');
  const questionTypeOptions = [
    'Multiple Choice Questions',
    'Short Questions',
    'Diagram/Graph-Based Questions',
    'Numerical Problems',
    'True/False',
    'Long Answer',
  ];

  const totalQuestions = useMemo(() => sections.reduce((sum, section) => sum + section.count, 0), [sections]);
  const computedTotalMarks = useMemo(
    () => sections.reduce((sum, section) => sum + section.count * section.marksPerQuestion, 0),
    [sections]
  );

  useEffect(() => {
    if (isWsJobProgressMessage(wsMessage)) {
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

  useEffect(() => {
    if (!title.trim()) {
      setTitle('Assignment');
    }
  }, [title, setTitle]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const section of sections) {
      if (section.count < 1) {
        newErrors[`section_${section.id}_count`] = 'Count must be at least 1';
      }
      if (section.marksPerQuestion < 1) {
        newErrors[`section_${section.id}_marks`] = 'Marks must be at least 1';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const appendFiles = (incoming: File[]) => {
    const accepted = incoming.filter((file) => {
      const allowedType =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'application/pdf' ||
        file.type === 'text/plain';
      const allowedSize = file.size <= 10 * 1024 * 1024;
      return allowedType && allowedSize;
    });
    if (accepted.length > 0) setFiles([...files, ...accepted]);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      appendFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      appendFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setStatus('Uploading and Starting Job...');
    const effectiveTitle = title.trim() || 'Assignment';

    const formData = new FormData();
    formData.append('title', effectiveTitle);
    formData.append('description', 'Generated from assignment dashboard form');
    formData.append('sections', JSON.stringify(sections));
    if (dueDate) formData.append('dueDate', dueDate);
    if (computedTotalMarks > 0) formData.append('totalMarks', computedTotalMarks.toString());
    if (additionalInstructions) formData.append('additionalInstructions', additionalInstructions);

    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const res = await fetch(`${API_URL}/api/assignments`, {
        method: 'POST',
        headers: { ...getAuthHeader() },
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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(err);
      setStatus(`Error: ${message}`);
      setIsSubmitting(false);
    }
  };

  const desktop = (
    <div className="hidden md:block max-w-5xl mx-auto pb-12">
      <form
        onSubmit={handleSubmit}
        className="rounded-[24px] border p-5 lg:p-7"
        style={{ background: '#F6F6F7', borderColor: '#D7D7D9' }}
      >
        <section className="space-y-5">
          <div>
            <h2 className="text-[28px] leading-tight font-semibold text-[#18181B]">Assignment Details</h2>
            <p className="text-sm text-[#7A7A85] mt-1">Basic information about your assignment</p>
          </div>

          <div
            className={`rounded-[22px] border-2 border-dashed bg-[#F3F3F4] px-6 py-10 text-center transition ${
              isDragging ? 'border-[#8A8A96]' : 'border-[#D1D1D4]'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={onDrop}
          >
            <button
              type="button"
              aria-label="Upload files"
              onClick={() => fileInputRef.current?.click()}
              className="mx-auto w-8 h-8 rounded-full flex items-center justify-center text-[#1C1C1C]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V5.25m0 0l-3.75 3.75M12 5.25l3.75 3.75M4.5 15.75v1.5A2.25 2.25 0 006.75 19.5h10.5a2.25 2.25 0 002.25-2.25v-1.5" />
              </svg>
            </button>
            <p className="text-[20px] text-[#222226] mt-1">Choose a file or drag &amp; drop it here</p>
            <p className="text-sm text-[#8A8A94] mt-1">JPEG, PNG, upto 10MB</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-5 rounded-full border border-[#E2E2E4] bg-white px-5 py-2 text-sm font-medium text-[#222226]"
            >
              Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,.pdf,.txt"
              className="hidden"
              onChange={onFileInputChange}
            />
          </div>

          <p className="text-center text-sm text-[#8A8A94]">
            Upload images of your preferred document/image
          </p>

          {files.length > 0 ? (
            <div className="rounded-xl border border-[#E1E1E4] bg-white p-3 space-y-2">
              {files.map((file, idx) => (
                <div key={`${file.name}-${idx}`} className="flex items-center justify-between rounded-lg bg-[#F6F6F7] px-3 py-2">
                  <p className="text-sm text-[#33353A] truncate">{file.name}</p>
                  <button
                    type="button"
                    onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                    className="text-[#6D7078] hover:text-[#222226]"
                    aria-label="Remove uploaded file"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          <div>
            <label className="block text-base font-semibold text-[#1F222A] mb-2.5">Due Date</label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-12 rounded-full border border-[#D5D5D8] bg-white px-4 pr-11 text-sm text-[#1F222A] focus:outline-none"
              />
              <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6D7078]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3.75V6m7.5-2.25V6M3.75 8.25h16.5M6 4.5h12A2.25 2.25 0 0120.25 6.75v11.25A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6.75A2.25 2.25 0 016 4.5z" />
              </svg>
            </div>
          </div>

          <div className="pt-1">
            <div className="grid grid-cols-[1fr_116px_116px] gap-4 items-end mb-2">
              <h3 className="text-base font-semibold text-[#1F222A]">Question Type</h3>
              <p className="text-sm text-[#1F222A] text-center">No. of Questions</p>
              <p className="text-sm text-[#1F222A] text-center">Marks</p>
            </div>

            <div className="space-y-3">
              {sections.map((section) => (
                <div key={section.id} className="grid grid-cols-[1fr_116px_116px] gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <select
                        value={section.type}
                        onChange={(e) => updateSection(section.id, { type: e.target.value })}
                        className="w-full h-12 rounded-full border border-[#D7D7DB] bg-white pl-4 pr-10 text-[15px] text-[#2A2D34] appearance-none focus:outline-none"
                      >
                        {questionTypeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D7078]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {sections.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeSection(section.id)}
                        className="w-7 h-7 rounded-full text-[#4A4A52] hover:bg-white"
                        aria-label="Remove question type"
                      >
                        ×
                      </button>
                    ) : (
                      <span className="w-7 h-7" />
                    )}
                  </div>

                  <div>
                    <div className="h-12 rounded-full border border-[#E0E0E3] bg-white px-2.5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => updateSection(section.id, { count: Math.max(1, section.count - 1) })}
                        className="w-7 h-7 rounded-full border border-[#ECECEF] text-[#8B8D95]"
                      >
                        −
                      </button>
                      <span className="text-[#1F222A] text-sm font-medium">{section.count}</span>
                      <button
                        type="button"
                        onClick={() => updateSection(section.id, { count: section.count + 1 })}
                        className="w-7 h-7 rounded-full border border-[#ECECEF] text-[#8B8D95]"
                      >
                        +
                      </button>
                    </div>
                    {errors[`section_${section.id}_count`] ? (
                      <p className="text-[11px] text-red-500 mt-1">{errors[`section_${section.id}_count`]}</p>
                    ) : null}
                  </div>

                  <div>
                    <div className="h-12 rounded-full border border-[#E0E0E3] bg-white px-2.5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => updateSection(section.id, { marksPerQuestion: Math.max(1, section.marksPerQuestion - 1) })}
                        className="w-7 h-7 rounded-full border border-[#ECECEF] text-[#8B8D95]"
                      >
                        −
                      </button>
                      <span className="text-[#1F222A] text-sm font-medium">{section.marksPerQuestion}</span>
                      <button
                        type="button"
                        onClick={() => updateSection(section.id, { marksPerQuestion: section.marksPerQuestion + 1 })}
                        className="w-7 h-7 rounded-full border border-[#ECECEF] text-[#8B8D95]"
                      >
                        +
                      </button>
                    </div>
                    {errors[`section_${section.id}_marks`] ? (
                      <p className="text-[11px] text-red-500 mt-1">{errors[`section_${section.id}_marks`]}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addSection()}
              className="mt-4 inline-flex items-center gap-2 text-[#1F222A] text-[15px] font-medium"
            >
              <span className="w-7 h-7 rounded-full bg-[#1E2129] text-white flex items-center justify-center text-lg leading-none">+</span>
              Add Question Type
            </button>
          </div>

          <div className="pt-2">
            <label className="block text-base font-semibold text-[#1F222A] mb-2.5">
              Additional Information (For better output)
            </label>
            <div className="relative">
            <textarea
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                className="w-full h-24 rounded-2xl border border-[#D8D8DC] bg-white px-4 py-3 pr-12 text-sm text-[#2A2D34] placeholder:text-[#A1A1AB] resize-none focus:outline-none"
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
              />
              <button type="button" className="absolute right-4 bottom-3 text-[#4B4F58]" aria-label="Voice input">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5a2.25 2.25 0 00-2.25 2.25v4.5a2.25 2.25 0 104.5 0v-4.5A2.25 2.25 0 0012 4.5zM6.75 10.5a5.25 5.25 0 1010.5 0M12 15.75v3.75m-3 0h6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="pt-1">
            <p className="text-right text-[24px] font-medium text-[#2A2D34]">Total Questions : {totalQuestions}</p>
            <p className="text-right text-[24px] font-medium text-[#2A2D34]">Total Marks : {computedTotalMarks}</p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="h-11 px-6 rounded-full border border-[#D7D7DB] bg-white text-[#2A2D34] text-[15px] font-medium inline-flex items-center gap-2"
            >
              <span>←</span>
              Previous
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-7 rounded-full bg-[#111318] text-white text-[15px] font-medium inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Next
              <span>→</span>
            </button>
          </div>
        </section>
      </form>

      {isSubmitting && <GenerationProgress status={status} />}
    </div>
  );

  return (
    <>
      {desktop}
      <CreateAssignmentMobile />
    </>
  );
}
