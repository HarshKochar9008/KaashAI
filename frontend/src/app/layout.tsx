import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppShell from '../components/AppShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KaashAI - AI for Educators',
  description: 'AI-powered exam generation platform built from India. Upload curriculum, generate exams instantly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
