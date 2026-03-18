import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VedaAI - ExamCraft',
  description: 'AI Teacher Toolkit',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 flex h-screen overflow-hidden`}>
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-xl flex flex-col justify-between m-4 rounded-xl relative border border-slate-100 hidden md:flex z-50">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 bg-orange-600 rounded-md flex items-center justify-center text-white font-bold text-lg">V</div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">VedaAI</h1>
            </div>
            
            <Link href="/create" className="w-full bg-slate-900 text-white rounded-full py-3 px-4 flex items-center justify-center gap-2 mb-8 hover:bg-slate-800 transition shadow-[0_0_15px_rgba(0,0,0,0.2)]">
              <span className="text-xl leading-none">+</span> Create Assignment
            </Link>

            <nav className="space-y-2">
              <Link href="/" className="flex items-center gap-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 px-4 py-2.5 rounded-lg transition">
                 Home
              </Link>
              <div className="flex items-center gap-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 px-4 py-2.5 rounded-lg transition">
                 My Groups
              </div>
              <Link href="/" className="flex items-center gap-3 text-orange-600 bg-orange-50 px-4 py-2.5 rounded-lg transition font-medium">
                 Assignments
                 <span className="ml-auto bg-orange-500 text-white text-xs py-0.5 px-2 rounded-full">10</span>
              </Link>
              <Link href="/users" className="flex items-center gap-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 px-4 py-2.5 rounded-lg transition">
                 Users
              </Link>
              <div className="flex items-center gap-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 px-4 py-2.5 rounded-lg transition">
                 AI Teacher&apos;s Toolkit
              </div>
              <div className="flex items-center gap-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 px-4 py-2.5 rounded-lg transition">
                 My Library
              </div>
            </nav>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3 text-slate-500 hover:text-slate-900 mb-6 px-4 py-2 cursor-pointer transition">
               Settings
            </div>
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3 border border-slate-100">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0"></div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 truncate">Jain University</p>
                <p className="text-xs text-slate-500 truncate">Bangalore</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto">
          {/* Top header */}
          <header className="h-16 flex items-center justify-between px-8 bg-transparent">
             <div className="flex items-center gap-3">
               <span className="text-slate-400"></span>
               <span className="text-slate-500 text-sm font-medium">Home</span>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-500">
                  {/* bell icon */}
                  <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-2" />
                  🔔
                </div>
                <div className="flex items-center gap-2 bg-white rounded-full pl-1 pr-3 py-1 shadow-sm border border-slate-100">
                  <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-700">John Doe</span>
                </div>
             </div>
          </header>

          <div className="p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
