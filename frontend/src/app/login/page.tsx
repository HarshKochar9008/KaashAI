"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, error, clearError, user, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && !loading) router.replace('/dashboard');
  }, [user, loading, router]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login(email, password);
    setSubmitting(false);
    if (ok) router.replace('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-600/10 blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
            <Image src="/logo1.png" alt="KaashAI" width={40} height={40} className="rounded-lg" />
            <span className="text-2xl font-bold tracking-tight text-white">Kaash<span className="text-brand-400">AI</span></span>
          </Link>
          <h2 className="text-3xl font-extrabold text-white mb-2">Welcome back</h2>
          <p className="text-zinc-500">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/[0.04] backdrop-blur-2xl rounded-2xl p-8 border border-white/[0.08] space-y-5">
          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm rounded-xl px-4 py-3 border border-red-500/20">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 outline-none transition"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-white text-black font-semibold rounded-xl py-3 hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-zinc-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-brand-400 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
