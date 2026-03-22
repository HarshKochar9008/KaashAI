"use client";
import React from 'react';
import Link from 'next/link';

export default function GroupsPage() {
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

        <h2 className="text-[38px] leading-none font-semibold text-[#2D2D2D] mb-3">No assignments yet</h2>
        <p className="text-[15px] leading-7 text-[#77797F] max-w-[320px] mb-8">
          Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
        <Link href="/create" className="bg-[#111216] text-white font-semibold rounded-full py-3.5 px-9 text-[16px] shadow-[0_3px_8px_rgba(0,0,0,0.2)]">
          + Create Your First Assignment
        </Link>
      </div>

      <div className="hidden md:block max-w-4xl mx-auto">
        <div className="rounded-2xl border p-8 text-center" style={{ background: 'var(--dash-surface)', borderColor: 'var(--dash-border-2)' }}>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--dash-fg)' }}>My Groups</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--dash-muted)' }}>
            Coming soon. Your class groups will appear here.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-semibold border"
              style={{ background: 'var(--dash-fg)', color: 'var(--dash-bg)', borderColor: 'var(--dash-border-2)' }}
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

