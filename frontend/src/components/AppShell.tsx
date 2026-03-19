"use client";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AuthProvider from './AuthProvider';
import { useAuthStore } from '@/store/authStore';

const PUBLIC_PATHS = ['/', '/login', '/signup'];

type DashboardTheme = 'light' | 'dark';

function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: DashboardTheme;
  onToggle: () => void;
}) {
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border transition text-sm font-medium"
      style={{
        background: 'var(--dash-input)',
        borderColor: 'var(--dash-border-2)',
        color: 'var(--dash-fg)',
      }}
      aria-label="Toggle dashboard theme"
    >
      <span className="flex items-center gap-2">
        {isDark ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0112 21.75a9.75 9.75 0 01-9.75-9.75 9.718 9.718 0 016.748-9.252A7.501 7.501 0 0018 15a7.47 7.47 0 003.752.002z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6.75 6.75 0 100-13.5 6.75 6.75 0 000 13.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.5 12H3M21 12h-1.5M6.343 6.343l-1.06-1.06M18.718 18.718l-1.06-1.06M6.343 17.657l-1.06 1.06M18.718 5.282l-1.06 1.06" />
          </svg>
        )}
        <span>Theme</span>
      </span>

      <span
        className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs border"
        style={{ borderColor: 'var(--dash-border-2)', color: 'var(--dash-muted)' }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: isDark ? '#60a5fa' : '#0f172a' }}
        />
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}

function Sidebar({
  showDashboardThemeToggle,
  dashboardTheme,
  onToggleDashboardTheme,
}: {
  showDashboardThemeToggle: boolean;
  dashboardTheme: DashboardTheme;
  onToggleDashboardTheme: () => void;
}) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter(); 
  const navItems = [
    {
      href: '/dashboard',
      label: 'Home',
      active: pathname === '/dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      href: '/profile',
      label: 'Profile',
      active: pathname === '/profile',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      ),
    },
    {
      href: '/groups',
      label: 'My Groups',
      active: pathname === '/groups',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m10.116 0A5.971 5.971 0 0018 18.72m-12 0a5.971 5.971 0 01.941-3.197m0 0A5.995 5.995 0 0112 12.75a5.995 5.995 0 015.058 2.772M15 7.5a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-12 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
    },
    {
      href: '/dashboard',
      label: 'Assignments',
      active: pathname === '/dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      href: '/toolkit',
      label: "AI Teacher's Toolkit",
      active: pathname === '/toolkit',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.455L14.25 6l1.035-.259a3.375 3.375 0 002.455-2.455L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.455L21.75 6l-1.035.259a3.375 3.375 0 00-2.455 2.455zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ),
    },
    {
      href: '/library',
      label: 'My Library',
      active: pathname === '/library',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className="w-64 flex flex-col justify-between m-3 rounded-xl border hidden md:flex z-50 h-[calc(100dvh-1.5rem)] sticky top-3"
      style={{
        background: 'var(--dash-surface)',
        borderColor: 'var(--dash-border-2)',
      }}
    >
      <div className="p-5">
        <Link href="/dashboard" className="flex items-center gap-2.5 mb-8 px-1">
          <Image src="/logo1.png" alt="KaashAI" width={28} height={28} className="rounded-md" />
          <div className="flex flex-col">
          <h1 className="text-lg font-bold tracking-tight" style={{ color: 'var(--dash-fg)' }}>
            Kaash<span className="text-brand-400">AI</span>
          </h1>
          <h2 className="text-xs" style={{ color: 'var(--dash-muted-2)' }}>powered by VedaAI</h2>
          </div>

        </Link>
        
        <Link
          href="/create"
          className="w-full font-semibold rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 mb-6 transition text-sm border"
          style={{ background: 'var(--dash-fg)', color: 'var(--dash-bg)', borderColor: 'var(--dash-border-2)' }}
        >
          <span className="text-lg leading-none">+</span> New Assignment
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm font-medium ${
                item.active
                  ? 'border'
                  : ''
              }`}
              style={
                item.active
                  ? { color: 'var(--dash-fg)', background: 'var(--dash-input)', borderColor: 'var(--dash-border-2)' }
                  : { color: 'var(--dash-muted)', background: 'transparent' }
              }
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {showDashboardThemeToggle ? (
          <div className="mt-5">
            <ThemeToggle theme={dashboardTheme} onToggle={onToggleDashboardTheme} />
          </div>
        ) : null}
      </div>

      <div className="p-5">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm mb-4 px-3 py-2 cursor-pointer transition w-full text-left rounded-lg"
          style={{ color: 'var(--dash-muted)' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Sign Out
        </button>
        <div
          className="rounded-xl p-3.5 flex items-center gap-3 border"
          style={{ background: 'var(--dash-input)', borderColor: 'var(--dash-border-2)' }}
        >
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-purple-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div onClick={() => router.push('/profile')} className="overflow-hidden">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--dash-fg)' }}>{user?.name}</p>
            <p className="text-xs truncate" style={{ color: 'var(--dash-muted-2)' }}>{user?.institution || user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileNav({
  showDashboardThemeToggle,
  dashboardTheme,
  onToggleDashboardTheme,
}: {
  showDashboardThemeToggle: boolean;
  dashboardTheme: DashboardTheme;
  onToggleDashboardTheme: () => void;
}) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Home' },
    { href: '/groups', label: 'My Groups' },
    { href: '/dashboard', label: 'Assignments' },
    { href: '/toolkit', label: "AI Teacher's Toolkit" },
    { href: '/library', label: 'My Library' },
    { href: '/profile', label: 'Profile' },
    { href: '/create', label: 'Create Assignment' },
  ];

  return (
    <>
      <header
        className="md:hidden sticky top-0 z-50 backdrop-blur-xl border-b"
        style={{
          background: 'color-mix(in oklab, var(--dash-bg) 80%, transparent)',
          borderColor: 'var(--dash-border-2)',
        }}
      >
        <div className="h-14 flex items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/logo1.png" alt="KaashAI" width={24} height={24} className="rounded-md" />
            <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--dash-fg)' }}>
              Kaash<span className="text-brand-400">AI</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-10 h-10 rounded-xl border transition flex items-center justify-center"
            style={{ borderColor: 'var(--dash-border)', background: 'var(--dash-input)' }}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" style={{ color: 'var(--dash-fg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`md:hidden fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-[86vw] max-w-sm border-l shadow-2xl transition-transform ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ background: 'var(--dash-surface)', borderColor: 'var(--dash-border)' }}
        >
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--dash-border-2)' }}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-purple-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--dash-fg)' }}>{user?.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--dash-muted-2)' }}>{user?.institution || user?.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-10 h-10 rounded-xl border transition flex items-center justify-center"
              style={{ borderColor: 'var(--dash-border)', background: 'var(--dash-input)', color: 'var(--dash-fg)' }}
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4">
            <Link
              href="/create"
              onClick={() => setOpen(false)}
              className="w-full bg-white text-black font-semibold rounded-xl py-3 px-4 flex items-center justify-center gap-2 mb-5 hover:bg-zinc-200 transition text-sm"
            >
              <span className="text-lg leading-none">+</span> New Assignment
            </Link>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition text-sm font-medium border`}
                    style={
                      active
                        ? { color: 'var(--dash-fg)', background: 'var(--dash-input)', borderColor: 'var(--dash-border-2)' }
                        : { color: 'var(--dash-muted)', background: 'transparent', borderColor: 'transparent' }
                    }
                  >
                    <span>{item.label}</span>
                    <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                );
              })}
            </nav>

            {showDashboardThemeToggle ? (
              <div className="mt-4">
                <ThemeToggle
                  theme={dashboardTheme}
                  onToggle={() => {
                    onToggleDashboardTheme();
                  }}
                />
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="mt-6 w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl py-3 hover:bg-red-500/15 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Sign Out
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

function AuthenticatedHeader() {
  const { user } = useAuthStore();

  return (
    <header className="h-14 hidden md:flex items-center justify-between px-6 lg:px-8">
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
  const isDashboard = !isPublic;
  const [dashboardTheme, setDashboardTheme] = React.useState<DashboardTheme>('light');

  React.useEffect(() => {
    if (!isDashboard) return;
    try {
      const saved = window.localStorage.getItem('kaash.dashboardTheme');
      if (saved === 'dark' || saved === 'light') setDashboardTheme(saved);
      else setDashboardTheme('light');
    } catch {
      setDashboardTheme('light');
    }
  }, [isDashboard]);

  const toggleDashboardTheme = React.useCallback(() => {
    setDashboardTheme((prev) => {
      const next: DashboardTheme = prev === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem('kaash.dashboardTheme', next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  if (isPublic) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <div
        className={`flex min-h-dvh overflow-hidden ${isDashboard ? `dashboard-theme-${dashboardTheme}` : ''}`}
        style={{ background: isDashboard ? 'var(--dash-bg)' : undefined }}
      >
        <Sidebar
          showDashboardThemeToggle={isDashboard}
          dashboardTheme={dashboardTheme}
          onToggleDashboardTheme={toggleDashboardTheme}
        />
        <main
          className="flex-1 flex flex-col min-h-dvh overflow-y-auto"
          style={{ background: isDashboard ? 'var(--dash-surface-2)' : undefined, color: isDashboard ? 'var(--dash-fg)' : undefined }}
        >
          <MobileNav
            showDashboardThemeToggle={isDashboard}
            dashboardTheme={dashboardTheme}
            onToggleDashboardTheme={toggleDashboardTheme}
          />
          <AuthenticatedHeader />
          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
