"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function NoAssignmentsMobile() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [profileOpen, setProfileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#F2F3F7] flex flex-col md:hidden">
      {/* Top app bar */}
      <header className="sticky top-0 z-50 px-3 pt-3 pb-2">
        <div className="h-12 rounded-2xl bg-white border border-black/5 shadow-[0_1px_6px_rgba(0,0,0,0.08)] flex items-center justify-between px-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) router.back();
                else router.push("/dashboard");
              }}
              className="w-8 h-8 rounded-full bg-white border border-[#ECECEC] flex items-center justify-center"
              aria-label="Go back"
            >
              <svg className="w-4 h-4 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <svg
              className="w-4 h-4 text-[#8A8F98] flex-shrink-0"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="1.5" y="1.5" width="3.5" height="3.5" rx="1" fill="currentColor" />
              <rect x="6.5" y="1.5" width="3.5" height="3.5" rx="1" fill="currentColor" />
              <rect x="11.5" y="1.5" width="3.5" height="3.5" rx="1" fill="currentColor" />
              <rect x="1.5" y="6.5" width="3.5" height="3.5" rx="1" fill="currentColor" />
              <rect x="6.5" y="6.5" width="3.5" height="3.5" rx="1" fill="currentColor" />
              <rect x="11.5" y="6.5" width="3.5" height="3.5" rx="1" fill="currentColor" />
            </svg>

            <h2 className="text-[14px] font-semibold text-[#6B7280] leading-none truncate">Assignment</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative w-8 h-8 rounded-full bg-transparent flex items-center justify-center"
              aria-label="Notifications"
            >
              <svg className="w-4 h-4 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute top-[6px] right-[6px] w-1.5 h-1.5 rounded-full bg-[#FF5A2A]" />
            </button>

            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full px-2 py-1 bg-white border border-[#ECECEC] text-[#1A1A1A]"
              aria-label="Open profile menu"
            >
              <Image
                src="/Avatar.png"
                alt="User avatar"
                width={28}
                height={28}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
              />
              <span className="text-[13px] font-semibold text-[#1A1A1A] max-w-[110px] truncate">
                {user?.name || "John Doe"}
              </span>
              <svg className="w-4 h-4 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {profileOpen && (
        <div
          className="fixed inset-0 z-[60]"
          onClick={() => setProfileOpen(false)}
          role="presentation"
        >
          <div
            className="absolute right-6 top-[66px] w-44 bg-white rounded-xl shadow-md border border-black/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="menu"
          >
            <button
              type="button"
              onClick={() => { setProfileOpen(false); router.push("/settings"); }}
              className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Settings
            </button>
            <button
              type="button"
              onClick={() => { setProfileOpen(false); router.push("/profile"); }}
              className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => { setProfileOpen(false); router.push("/login"); }}
              className="w-full text-left px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 px-6 pt-8 pb-24 flex flex-col items-center text-center">
        <div className="w-40 h-40 mb-6 relative">
          <div className="absolute inset-0 rounded-3xl bg-white shadow-md flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#F5F5F8] flex items-center justify-center relative">
              <span className="absolute w-12 h-12 rounded-full bg-white shadow-sm"></span>
              <span className="relative w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="w-6 h-6 rounded-full border-[4px] border-red-400 border-x-transparent rotate-45 inline-block"></span>
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-[17px] font-semibold text-gray-900 mb-2">
          No assignments yet
        </h1>
        <p className="text-[12px] leading-relaxed text-gray-500 max-w-xs mb-8">
          Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>

        <button className="px-8 py-3 rounded-full bg-black text-white font-semibold text-[13px] shadow-md">
          Create Your First Assignment
        </button>
      </main>

      {/* Floating + button */}
      <button className="fixed bottom-20 right-6 w-12 h-12 rounded-full bg-black text-white text-2xl leading-none flex items-center justify-center shadow-xl">
        +
      </button>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 inset-x-0 h-16 bg-black rounded-t-3xl flex items-center justify-around text-[11px]">
        <button className="flex flex-col items-center gap-1 text-gray-300">
          <span className="w-5 h-5 rounded-md bg-white/10 block"></span>
          <span>Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-white">
          <span className="w-5 h-5 rounded-md bg-white block"></span>
          <span className="font-medium">My Groups</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-300">
          <span className="w-5 h-5 rounded-md bg-white/10 block"></span>
          <span>Library</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-300">
          <span className="w-5 h-5 rounded-md bg-white/10 block"></span>
          <span>AI Toolkit</span>
        </button>
      </nav>
    </div>
  );
}

