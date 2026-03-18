"use client";
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';

const PUBLIC_PATHS = ['/', '/login', '/signup'];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, loadUser } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!loading && !user && !PUBLIC_PATHS.includes(pathname)) {
      router.replace('/login');
    }
  }, [loading, user, pathname, router]);

  if (loading && !PUBLIC_PATHS.includes(pathname)) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <Image src="/logo1.png" alt="KaashAI" width={48} height={48} className="animate-pulse rounded-lg" />
          <p className="text-zinc-600 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  if (!user) return null;

  return <>{children}</>;
}
