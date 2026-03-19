"use client";

import React from 'react';
import { useAuthStore } from '@/store/authStore';

export default function ProfilePage() {
  const { user, updateProfile, error, clearError } = useAuthStore();

  const [name, setName] = React.useState(user?.name ?? '');
  const [institution, setInstitution] = React.useState(user?.institution ?? '');
  const [location, setLocation] = React.useState(user?.location ?? '');
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    setName(user?.name ?? '');
    setInstitution(user?.institution ?? '');
    setLocation(user?.location ?? '');
  }, [user?._id, user?.name, user?.institution, user?.location]); // keep user edits stable unless user changes

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    clearError();
    setSaving(true);
    const ok = await updateProfile({ name, institution, location });
    setSaving(false);
    setSaved(ok);
    if (ok) {
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--dash-fg)' }}>
          Profile
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--dash-muted)' }}>
          Edit your details here.
        </p>
      </div>

      <form
        onSubmit={onSave}
        className="rounded-2xl border p-5 sm:p-6"
        style={{ background: 'var(--dash-surface)', borderColor: 'var(--dash-border-2)' }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dash-muted)' }}>
              Email
            </label>
            <input
              value={user?.email ?? ''}
              readOnly
              className="w-full rounded-xl px-4 py-3 border outline-none opacity-80"
              style={{ background: 'var(--dash-input)', borderColor: 'var(--dash-border-2)', color: 'var(--dash-fg)' }}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dash-muted)' }}>
              Full name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl px-4 py-3 border outline-none focus:ring-2 focus:ring-brand-500/30 transition"
              style={{ background: 'var(--dash-input)', borderColor: 'var(--dash-border-2)', color: 'var(--dash-fg)' }}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dash-muted)' }}>
              Institution
            </label>
            <input
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full rounded-xl px-4 py-3 border outline-none focus:ring-2 focus:ring-brand-500/30 transition"
              style={{ background: 'var(--dash-input)', borderColor: 'var(--dash-border-2)', color: 'var(--dash-fg)' }}
              placeholder="e.g. Delhi Public School"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dash-muted)' }}>
              Location
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl px-4 py-3 border outline-none focus:ring-2 focus:ring-brand-500/30 transition"
              style={{ background: 'var(--dash-input)', borderColor: 'var(--dash-border-2)', color: 'var(--dash-fg)' }}
              placeholder="e.g. Bokaro Steel City"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="min-h-[20px] text-sm">
            {error ? <span className="text-red-500">{error}</span> : null}
            {!error && saved ? <span className="text-green-600">Saved</span> : null}
          </div>
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="rounded-xl px-5 py-2.5 font-semibold border transition disabled:opacity-40"
            style={{
              background: 'var(--dash-fg)',
              color: 'var(--dash-bg)',
              borderColor: 'var(--dash-border-2)',
            }}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

