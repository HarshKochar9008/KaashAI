import React from 'react';
import { useFormStore } from '@/store';

export default function SectionConfigurator() {
  const { sections, addSection, updateSection, removeSection } = useFormStore();

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">2</span> 
        Configure Sections
      </h3>
      
      <div className="space-y-4 mb-6">
        {sections.map((section, idx) => (
          <div key={section.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group">
            {sections.length > 1 && (
              <button 
                onClick={() => removeSection(section.id)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition"
              >
                ✕
              </button>
            )}
            
            <h4 className="font-semibold text-slate-700 mb-4 pb-2 border-b border-slate-100">Section {idx + 1}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Question Type</label>
                  <select 
                     className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition"
                     value={section.type}
                     onChange={(e) => updateSection(section.id, { type: e.target.value })}
                  >
                     <option value="MCQ">Multiple Choice</option>
                     <option value="Short Answer">Short Answer</option>
                     <option value="Essay">Essay</option>
                     <option value="True/False">True / False</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Count</label>
                  <input 
                     type="number"
                     min="1"
                     max="50"
                     className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition"
                     value={section.count}
                     onChange={(e) => updateSection(section.id, { count: parseInt(e.target.value) || 1 })}
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Difficulty</label>
                  <div className="flex bg-slate-100 rounded-lg p-1">
                     {['Easy', 'Medium', 'Hard'].map((diff) => (
                        <button
                           key={diff}
                           type="button"
                           onClick={() => updateSection(section.id, { difficulty: diff })}
                           className={`flex-1 text-xs font-bold py-2 rounded-md transition ${section.difficulty === diff ? 'bg-white shadow relative text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                           {diff}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      <button 
         onClick={addSection}
         type="button"
         className="w-full border-2 border-dashed border-slate-300 rounded-2xl py-6 text-slate-500 font-semibold hover:bg-slate-50 hover:border-slate-400 hover:text-slate-700 transition flex items-center justify-center gap-2"
      >
         <span className="text-xl leading-none">+</span> Add Another Section
      </button>
    </div>
  );
}
