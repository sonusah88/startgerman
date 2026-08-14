'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Headphones, BookOpen, FileText, Mic, Play, Home, Map, BookA, Bot, User, GraduationCap, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const EXAM_SECTIONS = [
  { id: 'horen', title: 'Hören', subtitle: 'Listening', icon: Headphones, duration: '20 min', description: 'Listen to short announcements and conversations, then answer questions.', color: 'from-blue-500 to-indigo-500', tasks: 3, ready: true },
  { id: 'lesen', title: 'Lesen', subtitle: 'Reading', icon: BookOpen, duration: '25 min', description: 'Read short messages, signs, advertisements, and everyday texts.', color: 'from-emerald-500 to-teal-500', tasks: 3, ready: true },
  { id: 'schreiben', title: 'Schreiben', subtitle: 'Writing', icon: FileText, duration: '20 min', description: 'Fill in a form and write a short personal email or message.', color: 'from-amber-500 to-orange-500', tasks: 2, ready: true },
  { id: 'sprechen', title: 'Sprechen', subtitle: 'Speaking', icon: Mic, duration: '15 min', description: 'Introduce yourself, ask and answer simple questions about everyday topics.', color: 'from-purple-500 to-pink-500', tasks: 3, ready: true },
];

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/roadmap', label: 'Roadmap', icon: Map },
  { href: '/dictionary', label: 'Dictionary', icon: BookA },
  { href: '/exam', label: 'Exam Prep', icon: GraduationCap, active: true },
];

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } })
};

export default function ExamPage() {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 md:pl-72">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 fixed left-0 top-0 bottom-0 glass p-6 z-40">
        <Link href="/dashboard" className="flex items-center gap-3 mb-10 hover:opacity-80 transition-opacity">
          <img src="/logo.jpg" alt="StartGerman Logo" className="h-10 w-10 rounded-full shadow-lg shadow-amber-500/20 object-cover" />
          <span className="font-bold text-xl tracking-tight">StartGerman</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-amber-500/10 text-amber-400' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
              <item.icon className="w-5 h-5" /> {item.label}
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">Prüfungstraining</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-gold">Goethe-Zertifikat</span> A1
          </h1>
          <p className="text-muted-foreground">Prepare for your official exam with timed section simulations.</p>
        </motion.div>

        {/* Exam Sections */}
        <div className="grid md:grid-cols-2 gap-5">
          {EXAM_SECTIONS.map((section, i) => (
            <motion.div key={section.id} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
              <Link
                href={section.ready ? `/exam/take/${section.id}` : '#'}
                className={`glass-card rounded-2xl p-6 block group hover:border-white/15 transition-all duration-300 hover:-translate-y-1 ${!section.ready ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{section.duration}</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-0.5">{section.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{section.subtitle} · {section.tasks} Tasks</p>
                <p className="text-sm text-muted-foreground/70 leading-relaxed mb-4">{section.description}</p>
                <div className="flex items-center justify-between">
                  {section.ready ? (
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">Ready</span>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground bg-white/5 px-2.5 py-1 rounded-full">Coming Soon</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Full Mock Exam CTA */}
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
          <div className="rounded-2xl p-8 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Full Mock Exam</h3>
              <p className="text-muted-foreground">Take the complete 80-minute Goethe A1 simulation to get your readiness score.</p>
            </div>
            <Button size="lg" className="w-full md:w-auto px-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0 hover:shadow-lg hover:shadow-amber-500/25 transition-all group">
              Start Full Test
              <Play className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>

        {/* Exam Info */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp} className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4">About the Goethe-Zertifikat A1</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Duration', value: '80 min' },
              { label: 'Sections', value: '4' },
              { label: 'Pass Score', value: '60%' },
              { label: 'Level', value: 'A1' },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-xl bg-white/[0.03]">
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass z-50 px-2 py-3">
        <div className="flex justify-around">
          {[{ href: '/dashboard', icon: Home, label: 'Home' }, { href: '/roadmap', icon: Map, label: 'Learn' }, { href: '/dictionary', icon: BookA, label: 'Dict' }, { href: '/tutor', icon: Bot, label: 'Tutor' }, { href: '/profile', icon: User, label: 'Profile' }].map((item) => (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all text-muted-foreground">
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
