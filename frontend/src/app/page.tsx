"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const features = [
  {
    title: "AI Exam Generation",
    description: "Automatically generate comprehensive exam papers from your uploaded curriculum materials using frontier AI models.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    title: "Multi-Format Questions",
    description: "Create MCQs, short answers, essays, and true/false questions with configurable difficulty levels.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    title: "Instant PDF Export",
    description: "Export beautifully formatted exam papers as PDFs, ready to print and distribute to students.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "Real-Time Progress",
    description: "Track exam generation progress in real-time with live WebSocket updates as the AI processes your content.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
];

const stats = [
  { value: "10K+", label: "Exams Generated" },
  { value: "500+", label: "Institutions" },
  { value: "< 60s", label: "Generation Time" },
  { value: "99.9%", label: "Uptime" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-4 inset-x-0 z-50 mx-auto max-w-4xl px-4">
        <div className="rounded-2xl border border-white/[0.12] bg-white/[0.05] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image style={{ background: 'transparent' }} src="/logo1.png" alt="KaashAI" width={28} height={28} className="rounded-md bg-transparent" />
            <span className="text-lg font-bold tracking-tight">Kaash<span className="text-brand-400">AI</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how-it-works" className="hover:text-white transition">How it Works</a>
            <a href="#stats" className="hover:text-white transition">Stats</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white px-4 py-2 rounded-xl transition">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm font-semibold text-black bg-white hover:bg-zinc-200 px-5 py-2 rounded-xl transition">
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-xl hover:bg-white/[0.08] transition"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white rounded-full mt-1 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
          </button>
        </div>

        {/* Mobile dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-72 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
          <div className="rounded-2xl border border-white/[0.12] bg-black/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-5 flex flex-col gap-4">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-zinc-400 hover:text-white transition py-1">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-zinc-400 hover:text-white transition py-1">How it Works</a>
            <a href="#stats" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-zinc-400 hover:text-white transition py-1">Stats</a>
            <hr className="border-white/[0.08]" />
            <div className="flex flex-col gap-3">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-zinc-400 hover:text-white text-center py-2 rounded-xl border border-white/[0.08] transition">
                Sign In
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-black bg-white hover:bg-zinc-200 text-center py-2 rounded-xl transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 bg-noise" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-brand-600/15 blur-[120px] animate-glow-pulse" />
        <div className="absolute top-40 -right-40 w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute top-60 -left-40 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[100px]" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-1.5 mb-8 backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            <span className="text-sm font-medium text-zinc-300">AI-Powered Exam Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
            AI for educators,<br />
            <span className="bg-gradient-to-r from-brand-400 via-cyan-200 to-white bg-clip-text text-transparent">
              built from India
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12">
            Upload your curriculum. Configure questions. Let KaashAI generate
            comprehensive exam papers in seconds &mdash; powered by frontier AI models.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group bg-white text-black font-semibold rounded-full px-8 py-4 text-base hover:bg-zinc-100 transition shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:shadow-[0_0_60px_rgba(59,130,246,0.25)] hover:-translate-y-0.5 active:scale-95"
            >
              Experience KaashAI
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
            <Link
              href="/login"
              className="text-zinc-300 font-semibold rounded-full px-8 py-4 text-base border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl transition hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-20 flex items-center justify-center gap-6 md:gap-10 relative z-10">
          <div className="relative animate-float group">
            <Image
              src="/logo1.png"
              alt="KaashAI"
              width={120}
              height={120}
              className="relative z-10"
            />
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-2xl font-extrabold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              KaashAI
            </span>
          </div>

          <span className="text-3xl md:text-6xl font-light text-zinc-500 select-none ">&times;</span>

          <div className="relative animate-float group" style={{ animationDelay: '0.5s' }}>
            <Image
              src="/tor.avif"
              alt="Veda AI"
              width={120}
              height={120}
              className="relative z-10 rounded-2xl"
              style={{ background: 'transparent' }}
            />
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              VedaAI
            </span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 border-y border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-zinc-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Everything you need to craft exams
            </h2>
            <p className="text-lg text-zinc-500 max-w-xl mx-auto">
              A complete AI toolkit designed for teachers who want to save time without compromising quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-white/[0.03] rounded-2xl p-8 border border-white/[0.06] hover:border-brand-500/30 hover:bg-white/[0.05] transition-all duration-300 backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-cyan-500/20 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-5 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white/[0.02] border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Three steps to your exam
            </h2>
            <p className="text-lg text-zinc-500">From curriculum to exam paper in under a minute.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload Content", desc: "Upload PDFs or text files of your syllabus, textbook chapters, or course materials." },
              { step: "02", title: "Configure Sections", desc: "Choose question types, counts, and difficulty levels. Customise every detail." },
              { step: "03", title: "Generate & Export", desc: "AI generates a complete exam paper. Review, toggle answers, and export as PDF." },
            ].map((item, i) => (
              <div key={item.step} className="text-center relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/10 to-transparent" />
                )}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-white/[0.08] flex items-center justify-center text-brand-400 font-bold text-lg mx-auto mb-5">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-brand-600/10 blur-[120px]" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
            Ready to transform<br />exam creation?
          </h2>
          <p className="text-lg text-zinc-500 mb-10 max-w-xl mx-auto">
            Join educators across India who are saving hours every week with AI-powered exam generation.
          </p>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 bg-white text-black font-semibold rounded-full px-8 py-4 text-base hover:bg-zinc-100 transition shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:shadow-[0_0_60px_rgba(59,130,246,0.25)] hover:-translate-y-0.5 active:scale-95"
          >
            Get Started Free
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 bg-gradient-to-b from-white/[0.06] via-blue-500/[0.08] to-blue-600/[0.15] border-t border-white/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/[0.05] to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <Image src="/logo1.png" alt="KaashAI" width={24} height={24} className="rounded-sm" />
            <span className="font-bold text-sm">Kaash<span className="text-brand-400">AI</span></span>
          </div>
          <p className="text-sm text-zinc-400">&copy; {new Date().getFullYear()} KaashAI. AI for educators, built from India.</p>
        </div>
      </footer>
    </div>
  );
}
