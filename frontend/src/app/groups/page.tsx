"use client";
import React from 'react';
import Link from 'next/link';

export default function GroupsPage() {
  return (
    <div className="max-w-4xl mx-auto">
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
  );
}

