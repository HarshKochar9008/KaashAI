import React from 'react';
import { useFormStore } from '@/store';

export default function SectionConfigurator({ errors = {} }: { errors?: Record<string, string> }) {
  const { sections, addSection, updateSection, removeSection } = useFormStore();

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-zinc-200 flex items-center gap-3 mb-6">
        <span className="w-7 h-7 rounded-lg bg-brand-500/15 text-brand-400 flex items-center justify-center text-xs font-bold border border-brand-500/20">3</span>
        Configure Sections
      </h3>

      <div className="space-y-4 mb-6 pl-0 sm:pl-10">
        {sections.map((section, idx) => (
          <div key={section.id} className="bg-white/[0.04] p-4 sm:p-6 rounded-xl border border-white/[0.06] relative group">
            {sections.length > 1 && (
              <button
                type="button"
                onClick={() => removeSection(section.id)}
                className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            <h4 className="font-semibold text-zinc-300 mb-4 pb-2 border-b border-white/[0.06]">Section {String.fromCharCode(65 + idx)}</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Question Type</label>
                <select
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-brand-500/30 outline-none transition appearance-none cursor-pointer"
                  value={section.type}
                  onChange={(e) => updateSection(section.id, { type: e.target.value })}
                >
                  <option value="MCQ" className="bg-zinc-900">Multiple Choice</option>
                  <option value="Short Answer" className="bg-zinc-900">Short Answer</option>
                  <option value="Essay" className="bg-zinc-900">Essay</option>
                  <option value="True/False" className="bg-zinc-900">True / False</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Count</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  className={`w-full bg-white/[0.04] border rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-brand-500/30 outline-none transition ${errors[`section_${section.id}_count`] ? 'border-red-500/50' : 'border-white/[0.08]'}`}
                  value={section.count}
                  onChange={(e) => updateSection(section.id, { count: Math.max(1, parseInt(e.target.value) || 1) })}
                />
                {errors[`section_${section.id}_count`] && (
                  <p className="text-red-400 text-xs mt-1">{errors[`section_${section.id}_count`]}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Marks / Question</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  className={`w-full bg-white/[0.04] border rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-brand-500/30 outline-none transition ${errors[`section_${section.id}_marks`] ? 'border-red-500/50' : 'border-white/[0.08]'}`}
                  value={section.marksPerQuestion}
                  onChange={(e) => updateSection(section.id, { marksPerQuestion: Math.max(1, parseInt(e.target.value) || 1) })}
                />
                {errors[`section_${section.id}_marks`] && (
                  <p className="text-red-400 text-xs mt-1">{errors[`section_${section.id}_marks`]}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Difficulty</label>
                <div className="flex bg-white/[0.04] rounded-lg p-1 border border-white/[0.06]">
                  {['Easy', 'Medium', 'Hard'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => updateSection(section.id, { difficulty: diff })}
                      className={`flex-1 text-xs font-bold py-2.5 rounded-md transition ${
                        section.difficulty === diff
                          ? 'bg-white/[0.1] text-white shadow-sm border border-white/[0.1]'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs text-zinc-600">
              Subtotal: {section.count * section.marksPerQuestion} marks
            </div>
          </div>
        ))}
      </div>

      <div className="pl-0 sm:pl-10">
        <button
          onClick={addSection}
          type="button"
          className="w-full border-2 border-dashed border-white/[0.08] rounded-xl py-5 text-zinc-500 font-semibold hover:bg-white/[0.02] hover:border-white/[0.12] hover:text-zinc-400 transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Another Section
        </button>
      </div>
    </div>
  );
}
