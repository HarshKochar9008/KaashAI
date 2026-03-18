"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/assignments')
      .then(res => res.json())
      .then(data => {
        setAssignments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-slate-500 animate-pulse">Loading assignments...</div>;
  }

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-20">
        <div className="w-48 h-48 bg-slate-100 rounded-full flex items-center justify-center mb-6 relative">
          <div className="absolute grid grid-cols-2 gap-2 opacity-30">
             <div className="w-16 h-8 bg-slate-300 rounded-full" />
             <div className="w-8 h-8 bg-slate-300 rounded-full" />
             <div className="w-12 h-12 bg-slate-300 rounded-lg absolute" style={{left: 20, top: 40}} />
          </div>
          <span className="text-4xl">❌</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No assignments yet</h2>
        <p className="text-slate-500 text-center max-w-sm mb-8">
          Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
        <Link href="/create" className="bg-slate-900 text-white font-medium rounded-full py-3 px-6 hover:bg-slate-800 transition">
          + Create Your First Assignment
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex gap-2 items-center text-slate-700">
         <span className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
         <h2 className="text-xl font-bold leading-none">Assignments</h2>
      </div>
      <p className="text-slate-500 text-sm mb-6 pb-4 border-b border-slate-200">Manage and create assignments for your classes.</p>
      
      <div className="flex gap-4 mb-8">
         <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition">
           <span>▼</span> Filter By
         </button>
         <div className="flex-1 max-w-md relative">
           <input type="text" placeholder="Search Assignment" className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition" />
           <span className="absolute left-4 top-2.5 text-slate-400">🔍</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map((assignment: any) => (
          <div key={assignment._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group">
            <div className="flex justify-between items-start mb-8">
               <h3 className="text-lg font-bold text-slate-800">{assignment.title}</h3>
               <Link href={`/results/${assignment._id}`} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition">
                 ⋮
               </Link>
            </div>
            
            <div className="flex justify-between items-center text-sm">
               <span className="text-slate-500 font-medium">Assigned on: <span className="text-slate-700">{new Date(assignment.createdAt).toLocaleDateString()}</span></span>
               <span className="font-semibold px-3 py-1 bg-slate-100 rounded-full text-slate-600 shadow-sm">{assignment.status}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-12 pb-12">
        <Link href="/create" className="bg-slate-900 text-white font-medium rounded-full py-3 px-8 hover:bg-slate-800 transition shadow-lg">
          + Create Assignment
        </Link>
      </div>
    </div>
  );
}
