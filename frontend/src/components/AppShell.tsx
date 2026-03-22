"use client";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AuthProvider from './AuthProvider';
import { useAuthStore } from '@/store/authStore';
import { FiSettings } from 'react-icons/fi';

const PUBLIC_PATHS = ['/', '/login', '/signup'];

type DashboardTheme = 'light' | 'dark';

// function ThemeToggle({
//   theme,
//   onToggle,
// }: {
//   theme: DashboardTheme;
//   onToggle: () => void;
// }) {
//   const isDark = theme === 'dark';
//   return (
//     <button
//       type="button"
//       onClick={onToggle}
//       className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border transition text-sm font-medium"
//       style={{
//         background: 'var(--dash-input)',
//         borderColor: 'var(--dash-border-2)',
//         color: 'var(--dash-fg)',
//       }}
//       aria-label="Toggle dashboard theme"
//     >
//       <span className="flex items-center gap-2">
//         {isDark ? (
//           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0112 21.75a9.75 9.75 0 01-9.75-9.75 9.718 9.718 0 016.748-9.252A7.501 7.501 0 0018 15a7.47 7.47 0 003.752.002z" />
//           </svg>
//         ) : (
//           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6.75 6.75 0 100-13.5 6.75 6.75 0 000 13.5z" />
//             <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.5 12H3M21 12h-1.5M6.343 6.343l-1.06-1.06M18.718 18.718l-1.06-1.06M6.343 17.657l-1.06 1.06M18.718 5.282l-1.06 1.06" />
//           </svg>
//         )}
//         <span>Theme</span>
//       </span>

//       <span
//         className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs border"
//         style={{ borderColor: 'var(--dash-border-2)', color: 'var(--dash-muted)' }}
//       >
//         <span
//           className="w-2 h-2 rounded-full"
//           style={{ background: isDark ? '#60a5fa' : '#0f172a' }}
//         />
//         {isDark ? 'Dark' : 'Light'}
//       </span>
//     </button>
//   );
// }

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
      href: '/groups',
      label: 'My Groups',
      active: pathname === '/groups',
      icon: (
        <Image src="/grp.png" alt="Groups" width={16} height={16} className="w-4 h-4 object-contain" />
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
        <Image src="/Book.png" alt="Library" width={16} height={16} className="w-4 h-4 object-contain" />
      ),
    },
    {
      href: '/library',
      label: 'My Library',
      active: pathname === '/library',
      icon: (
        <Image src="/Icon.png" alt="Home" width={16} height={16} className="w-4 h-4 object-contain" />
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
          <Image src="/logo1.png" alt="VedaAI" width={28} height={28} className="rounded-md" />
          <div className="flex flex-col">
          <h1 className="text-lg font-bold tracking-tight" style={{ color: 'var(--dash-fg)' }}>
            Veda<span className="text-brand-400">AI</span>
          </h1>
          </div>

        </Link>
        
        <Link
          href="/create"
          className="w-full font-semibold rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 mb-6 transition text-sm border"
          style={{ background: 'var(--dash-fg)', color: 'var(--dash-bg)', borderColor: 'var(--dash-border-2)' }}
        >
          <span className="text-lg leading-none">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.455L14.25 6l1.035-.259a3.375 3.375 0 002.455-2.455L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.455L21.75 6l-1.035.259a3.375 3.375 0 00-2.455 2.455zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
            </span> Create Assignment
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
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

        {/* {showDashboardThemeToggle ? (
          <div className="mt-5">
            <ThemeToggle theme={dashboardTheme} onToggle={onToggleDashboardTheme} />
          </div>
        ) : null} */}
      </div>

      <div className="p-5">
        <button
          onClick={() => router.push('/settings')}
          className="flex items-center gap-2 text-sm mb-4 px-3 py-2 cursor-pointer transition w-full text-left rounded-lg"
          style={{ color: 'var(--dash-muted)' }}
        >
          <FiSettings className="w-4 h-4" />
          Settings
        </button>
        <div
          className="rounded-xl p-3.5 flex items-center gap-3 border"
          style={{ background: 'var(--dash-input)', borderColor: 'var(--dash-border-2)' }}
        >
          <Image
            src="/Avatar.png"
            alt="User avatar"
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
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
  const router = useRouter();
  const [profileOpen, setProfileOpen] = React.useState(false);

  const title =
    pathname === '/create'
      ? 'Assignment'
      : pathname === '/dashboard'
        ? 'Assignments'
        : pathname === '/groups'
          ? 'My Groups'
          : pathname === '/library'
            ? 'My Library'
            : pathname === '/toolkit'
              ? "AI Teacher's Toolkit"
              : pathname === '/settings'
                ? 'Settings'
                : pathname === '/profile'
                  ? 'Profile'
                  : pathname.startsWith('/results/')
                    ? 'Result'
                    : 'Assignment';

  return (
    <>
      <header
        className="md:hidden sticky top-0 z-50 px-3 pt-3 pb-2"
      >
        <div className="h-12 rounded-2xl bg-white border border-black/5 shadow-[0_1px_6px_rgba(0,0,0,0.08)] flex items-center justify-between px-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => {
                // Prefer back navigation; fallback to dashboard if no history.
                if (typeof window !== 'undefined' && window.history.length > 1) router.back();
                else router.push('/dashboard');
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

            <h2 className="text-[14px] font-semibold text-[#6B7280] leading-none truncate">{title}</h2>
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
                {user?.name || 'John Doe'}
              </span>
              <svg className="w-4 h-4 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {profileOpen ? (
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
              onClick={() => {
                setProfileOpen(false);
                router.push('/settings');
              }}
              className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Settings
            </button>
            <button
              type="button"
              onClick={() => {
                setProfileOpen(false);
                router.push('/profile');
              }}
              className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => {
                setProfileOpen(false);
                logout();
                router.push('/login');
              }}
              className="w-full text-left px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
            >
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function MobileBottomBar() {
  const pathname = usePathname();
  const tabs = [
    { href: '/dashboard', label: 'Home', icon: (
      <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="8" height="8" rx="2" />
        <rect x="13" y="3" width="8" height="8" rx="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" />
        <rect x="13" y="13" width="8" height="8" rx="2" />
      </svg>
    ) },
    { href: '/groups', label: 'My Groups', icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 4.5h9m-9 4.5h6M6 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75z" />
      </svg>
    ) },
    { href: '/library', label: 'Library', icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75h9A2.25 2.25 0 0118.75 6v12A2.25 2.25 0 0116.5 20.25h-9A2.25 2.25 0 015.25 18V6A2.25 2.25 0 017.5 3.75zM9 7.5h6M9 11.25h6M9 15h4.5" />
      </svg>
    ) },
    { href: '/toolkit', label: 'AI Toolkit', icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3zM18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9L18 15z" />
      </svg>
    ) },
  ];

  const showFab = pathname === '/dashboard' || pathname === '/groups' || pathname === '/library' || pathname === '/toolkit';

  return (
    <>
      {showFab ? (
        <Link
          href="/create"
          className="md:hidden fixed bottom-[84px] right-5 z-50 w-12 h-12 rounded-full bg-[#F1F1F1] shadow-[0_3px_10px_rgba(0,0,0,0.15)] flex items-center justify-center text-[#FF5A2A] text-3xl leading-none"
          aria-label="Create assignment"
        >
          +
        </Link>
      ) : null}
      <nav className="md:hidden fixed left-2 right-2 bottom-2 z-50 h-[66px] rounded-[20px] bg-[#0F1012] border border-white/10 shadow-[0_6px_18px_rgba(0,0,0,0.3)] px-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-[22%] ${
                active ? 'text-white' : 'text-[#5F6368]'
              }`}
            >
              {tab.icon}
              <span className={`text-[10px] leading-none ${active ? 'font-semibold' : 'font-medium'}`}>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function AuthenticatedHeader() {
  const { user } = useAuthStore();

  return (
    <header className="h-14 hidden md:flex items-center justify-between px-6 lg:px-8">
      <div />
      <div className="flex items-center gap-3">
        <Image
          src="/Avatar.png"
          alt="User avatar"
          width={60}
          height={60}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex items-center gap-2 bg-white/[0.04] rounded-full pl-1 pr-3 py-1 border border-white/[0.06]">
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
          <div className="px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8 lg:pb-8">{children}</div>
          <MobileBottomBar />
        </main>
      </div>
    </AuthProvider>
  );
}
