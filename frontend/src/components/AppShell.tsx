"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AuthProvider from './AuthProvider';
import { useAuthStore } from '@/store/authStore';

const PUBLIC_PATHS = ['/', '/login', '/signup'];

function Sidebar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      active: pathname === '/dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      href: '/create',
      label: 'Create Assignment',
      active: pathname === '/create',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 bg-surface-100 flex flex-col justify-between m-3 rounded-xl border border-white/[0.06] hidden md:flex z-50">
      <div className="p-5">
        <Link href="/dashboard" className="flex items-center gap-2.5 mb-8 px-1">
          <Image src="/logo1.png" alt="KaashAI" width={28} height={28} className="rounded-md" />
          <h1 className="text-lg font-bold tracking-tight text-white">Kaash<span className="text-brand-400">AI</span></h1>
        </Link>
        
        <Link href="/create" className="w-full bg-white text-black font-semibold rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 mb-6 hover:bg-zinc-200 transition text-sm">
          <span className="text-lg leading-none">+</span> New Assignment
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm font-medium ${
                item.active
                  ? 'text-white bg-white/[0.08] border border-white/[0.06]'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-5">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-zinc-600 hover:text-red-400 mb-4 px-3 py-2 cursor-pointer transition w-full text-left rounded-lg hover:bg-red-500/10"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Sign Out
        </button>
        <div className="bg-white/[0.04] rounded-xl p-3.5 flex items-center gap-3 border border-white/[0.06]">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-purple-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-zinc-200 truncate">{user?.name}</p>
            <p className="text-xs text-zinc-600 truncate">{user?.institution || user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function AuthenticatedHeader() {
  const { user } = useAuthStore();

  return (
    <header className="h-14 flex items-center justify-between px-8">
      <div />
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/[0.04] rounded-full flex items-center justify-center text-zinc-500 relative border border-white/[0.06]">
          <div className="w-1.5 h-1.5 bg-brand-400 rounded-full absolute -top-0.5 -right-0.5" />
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </div>
        <div className="flex items-center gap-2 bg-white/[0.04] rounded-full pl-1 pr-3 py-1 border border-white/[0.06]">
          <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-[10px]">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <span className="text-sm font-medium text-zinc-300">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (isPublic) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-black">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full overflow-y-auto bg-surface">
          <AuthenticatedHeader />
          <div className="p-8">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
