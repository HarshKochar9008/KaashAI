"use client";

import React from "react";

export default function CreateAssignmentMobile() {
  return (
    <div className="min-h-screen bg-[#EDEEFA] flex flex-col md:hidden">
      {/* Scrollable card */}
      <main className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="bg-[#F4F5FB] rounded-3xl shadow-sm p-4 space-y-6">
          {/* Assignment details */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-900">
              Assignment Details
            </h2>

            {/* Upload box */}
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center py-6 text-center">
              <div className="w-10 h-10 rounded-full bg-[#F4F5FB] flex items-center justify-center mb-2">
                <span className="text-xl text-gray-500">⤒</span>
              </div>
              <p className="text-[11px] text-gray-600 font-medium">
                Choose a file or drag &amp; drop it here
              </p>
              <p className="text-[10px] text-gray-400">
                JPEG, PNG, upto 10MB
              </p>
              <button className="mt-3 px-4 py-1.5 rounded-full bg-black text-white text-[11px] font-semibold">
                Browse Files
              </button>
            </div>

            <p className="text-[11px] text-gray-500 text-left">
              Upload images of your preferred documents / image
            </p>
          </section>

          {/* Due date */}
          <section className="space-y-2">
            <label className="text-[11px] font-semibold text-gray-800">
              Due Date
            </label>
            <button className="w-full h-11 rounded-xl bg-white border border-gray-200 px-3 flex items-center justify-between text-[11px] text-gray-400">
              <span>Choose a chapter</span>
              <span className="text-base text-gray-500">📅</span>
            </button>
          </section>

          {/* Question type */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-semibold text-gray-800">
              Question Type
            </h3>

            {/* Block 1: MCQ */}
            <div className="rounded-2xl bg-white border border-gray-200 px-3 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-900">
                  Multiple Choice Questions
                </span>
                <button className="text-[12px] text-gray-400">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500">
                    No. of Questions
                  </p>
                  <div className="flex items-center justify-between h-9 rounded-full bg-[#F4F5FB] border border-gray-200 px-2">
                    <button className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs text-gray-700">
                      −
                    </button>
                    <span className="text-xs font-semibold text-gray-900">
                      4
                    </span>
                    <button className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500">Marks</p>
                  <div className="flex items-center justify-between h-9 rounded-full bg-[#F4F5FB] border border-gray-200 px-2">
                    <button className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs text-gray-700">
                      −
                    </button>
                    <span className="text-xs font-semibold text-gray-900">
                      4
                    </span>
                    <button className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Block 2: Short Questions */}
            <div className="rounded-2xl bg-white border border-gray-200 px-3 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-900">
                  Short Questions
                </span>
                <button className="text-[12px] text-gray-400">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500">
                    No. of Questions
                  </p>
                  <div className="flex items-center justify-between h-9 rounded-full bg-[#F4F5FB] border border-gray-200 px-2">
                    <button className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs text-gray-700">
                      −
                    </button>
                    <span className="text-xs font-semibold text-gray-900">
                      4
                    </span>
                    <button className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500">Marks</p>
                  <div className="flex items-center justify-between h-9 rounded-full bg-[#F4F5FB] border border-gray-200 px-2">
                    <button className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs text-gray-700">
                      −
                    </button>
                    <span className="text-xs font-semibold text-gray-900">
                      4
                    </span>
                    <button className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Add question type button */}
            <button className="mt-1 flex items-center gap-2 text-[11px] font-semibold text-gray-700">
              <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-xs">
                +
              </span>
              Add Question Type
            </button>
          </section>
        </div>
      </main>

      {/* Bottom summary & navigation */}
      <footer className="fixed bottom-0 inset-x-0 bg-white shadow-[0_-4px_14px_rgba(0,0,0,0.06)] px-5 py-3">
        <div className="flex items-center justify-between text-[11px] text-gray-600 mb-1.5">
          <span>Total Questions : 25</span>
          <span>Total Marks : 60</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex-1 h-10 rounded-full border border-gray-300 text-[11px] font-medium text-gray-700">
            Previous
          </button>
          <button className="flex-1 h-10 rounded-full bg-black text-white text-[11px] font-semibold">
            Next
          </button>
        </div>
      </footer>
    </div>
  );
}

