"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAuthHeader } from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type Assignment = {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/assignments`, {
      headers: { ...getAuthHeader() },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAssignments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 animate-pulse" style={{ color: 'var(--dash-muted)' }}>
        <div className="w-4 h-4 border-2 border-zinc-600 border-t-brand-400 rounded-full animate-spin" />
        Loading assignments...
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <>
        <div className="md:hidden flex flex-col items-center text-center pt-8 min-h-[65dvh]">
          <div className="relative mb-7 w-[190px] h-[190px]">
            <div className="absolute inset-0 rounded-full bg-[#E5E5E7]" />
            <div className="absolute inset-x-5 top-9 h-[92px] rounded-2xl bg-[#EFEFEF] border border-[#E1E1E1] p-3">
              <div className="h-2.5 w-9 bg-[#0F2238] rounded-full mb-2" />
              <div className="space-y-2">
                <div className="h-2 w-16 bg-[#D5D5D5] rounded-full" />
                <div className="h-2 w-20 bg-[#D5D5D5] rounded-full" />
                <div className="h-2 w-14 bg-[#D5D5D5] rounded-full" />
              </div>
            </div>
            <div className="absolute right-5 top-10 w-11 h-7 rounded-md bg-[#EBEBED] border border-[#DADADD]" />
            <div className="absolute right-9 top-[52px] w-4 h-1.5 rounded-full bg-[#AEAFB4]" />
            <div className="absolute left-[62px] top-[66px] w-[78px] h-[78px] rounded-full border-[7px] border-[#C8C0DB]">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-[#F8F5FF] flex items-center justify-center">
                  <span className="relative w-5 h-5 block">
                    <span className="absolute left-1/2 top-0 h-5 w-[4px] bg-[#FF5A5F] rounded-full -translate-x-1/2 rotate-45" />
                    <span className="absolute left-1/2 top-0 h-5 w-[4px] bg-[#FF5A5F] rounded-full -translate-x-1/2 -rotate-45" />
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute left-[130px] top-[132px] w-7 h-[9px] rounded-full bg-[#CFCADF] rotate-[42deg]" />
            <div className="absolute left-[168px] top-[128px] w-2 h-2 rounded-full bg-[#2F83BD]" />
          </div>

          <h2 className="text-[34px] leading-none font-semibold text-[#2D2D2D] mb-3">No assignments </h2>
          <p className="text-[13px] leading-7 text-[#77797F] max-w-[320px] mb-8">
            Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
          </p>
          <Link href="/create" className="bg-[#111216] text-white font-semibold rounded-full py-3.5 px-9 text-[14px] shadow-[0_3px_8px_rgba(0,0,0,0.2)]">
            + Create Assignment
          </Link>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center h-full pt-20">
          <div
            className="w-32 h-32 rounded-3xl flex items-center justify-center mb-8 border"
            style={{ background: 'var(--dash-input)', borderColor: 'var(--dash-border-2)' }}
          >
            <svg className="w-12 h-12" style={{ color: 'var(--dash-muted-2)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--dash-fg)' }}>No assignments yet</h2>
          <p className="text-center max-w-sm mb-8" style={{ color: 'var(--dash-muted)' }}>
            Create your first assignment to start generating AI-powered exam papers from your curriculum.
          </p>
          <Link href="/create" className="bg-white text-black font-semibold rounded-full py-3 px-6 hover:bg-zinc-200 transition">
            + Create Your First Assignment
          </Link>
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="mb-6 flex gap-2 items-center">
        <span className="w-2.5 h-2.5 bg-brand-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
        <h2 className="text-xl font-bold leading-none" style={{ color: 'var(--dash-fg)' }}>Assignments</h2>
      </div>
      <p className="text-sm mb-6 pb-4 border-b" style={{ color: 'var(--dash-muted)', borderColor: 'var(--dash-border-2)' }}>
        Manage and create assignments for your classes.
      </p>
      
      <div className="flex gap-3 mb-8">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition"
          style={{ background: 'var(--dash-input)', color: 'var(--dash-muted)', borderColor: 'var(--dash-border-2)' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>
          Filter
        </button>
        <div className="flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search assignments..."
            className="w-full rounded-full pl-10 pr-4 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition"
            style={{
              background: 'var(--dash-input)',
              borderColor: 'var(--dash-border-2)',
              color: 'var(--dash-fg)',
            }}
          />
          <svg className="absolute left-3.5 top-2.5 w-4 h-4" style={{ color: 'var(--dash-muted-2)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map((assignment) => (
          <Link
            key={assignment._id}
            href={`/results/${assignment._id}`}
            className="group p-6 rounded-2xl border transition-all"
            style={{ background: 'var(--dash-input)', borderColor: 'var(--dash-border-2)' }}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-base font-bold group-hover:text-brand-500 transition" style={{ color: 'var(--dash-fg)' }}>
                {assignment.title}
              </h3>
              <svg className="w-4 h-4 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" style={{ color: 'var(--dash-muted-2)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: 'var(--dash-muted-2)' }}>
                {new Date(assignment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="font-medium px-2.5 py-1 bg-brand-500/10 rounded-full text-brand-400 text-xs border border-brand-500/20">
                {assignment.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="flex justify-center mt-12 pb-12">
        <Link href="/create" className="bg-white text-black font-semibold rounded-full py-3 px-8 hover:bg-zinc-200 transition text-sm">
          + Create Assignment
        </Link>
      </div>
    </div>
  );
}
