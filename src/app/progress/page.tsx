'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Map, BookA, Bot, User, GraduationCap, TrendingUp, AlertTriangle, CheckCircle2, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDetailedProgress } from '@/actions/progress';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/roadmap', label: 'Roadmap', icon: Map },
  { href: '/progress', label: 'Progress', icon: TrendingUp, active: true },
  { href: '/tutor', label: 'AI Tutor', icon: Bot },
];

function CircularProgress({ value, size = 64, stroke = 5, color = '#f59e0b' }: { value: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} />
    </svg>
  );
}

const SKILLS = [
  { topic: 'Articles (der/die/das)', score: 72, color: '#3b82f6' },
  { topic: 'Cases (Akk/Dat)', score: 61, color: '#8b5cf6' },
  { topic: 'Verb Conjugation', score: 84, color: '#10b981' },
  { topic: 'Word Order', score: 57, color: '#f59e0b' },
  { topic: 'Vocabulary', score: 78, color: '#06b6d4' },
  { topic: 'Listening', score: 68, color: '#ec4899' },
  { topic: 'Speaking', score: 52, color: '#ef4444' },
  { topic: 'Writing', score: 74, color: '#14b8a6' },
];

const ERRORS = [
  { error: 'der/die confusion', severity: 'high', icon: AlertTriangle, color: 'text-red-400 bg-red-500/10', suggestion: 'Practice gender with flashcards daily' },
  { error: 'Accusative case', severity: 'medium', icon: AlertTriangle, color: 'text-orange-400 bg-orange-500/10', suggestion: 'Focus on direct object identification' },
  { error: 'Word order in questions', severity: 'high', icon: AlertTriangle, color: 'text-red-400 bg-red-500/10', suggestion: 'Review V2 word order rules' },
  { error: 'Perfekt formation', severity: 'low', icon: Target, color: 'text-yellow-400 bg-yellow-500/10', suggestion: 'Practice haben/sein + Partizip II' },
  { error: 'Modal verbs', severity: 'ok', icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10', suggestion: 'Great! Keep practicing in conversation' },
];

const LEVELS = [
  { label: 'A1.1', score: 100, color: '#10b981' },
  { label: 'A1.2', score: 72, color: '#f59e0b' },
  { label: 'A2.1', score: 32, color: '#3b82f6' },
  { label: 'A2.2', score: 0, color: '#6b7280' },
];

const FUNCTIONAL = [
  { skill: 'Can introduce myself', done: true },
  { skill: 'Can order food', done: true },
  { skill: 'Can ask directions', done: true },
  { skill: 'Can describe my family', done: true },
  { skill: 'Can tell the time', partial: true },
  { skill: 'Can describe yesterday', partial: true },
  { skill: 'Can explain a problem', done: false },
  { skill: 'Can make an appointment', done: false },
];

export default function ProgressPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const result = await getDetailedProgress();
      if (result) setData(result);
    }
    load();
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-background pb-24 md:pb-0 md:pl-72 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { levels, skills, errors, functional } = data;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 md:pl-72">
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

      <main className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-gold">Analytics</span> & Mastery
          </h1>
          <p className="text-muted-foreground">Your comprehensive learning progress overview.</p>
        </motion.div>

        {/* Level Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
          <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-5">CEFR Level Progress</h2>
          <div className="grid grid-cols-4 gap-4">
            {levels.map((level: any) => (
              <div key={level.label} className="text-center">
                <div className="relative mx-auto mb-2">
                  <CircularProgress value={level.score} size={72} stroke={5} color={level.color} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">{level.score}%</span>
                  </div>
                </div>
                <span className="text-sm font-semibold">{level.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Knowledge Map */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
            <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-5">Knowledge Map</h2>
            <div className="space-y-4">
              {skills.map((item: any, idx: number) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.topic}</span>
                    <span className="text-muted-foreground">{item.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${item.score}%` }}
                      transition={{ duration: 1, delay: 0.3 + idx * 0.08 }}
                      className="h-full rounded-full" style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Error Heatmap */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
            <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2">Error Heatmap</h2>
            <p className="text-xs text-muted-foreground mb-5">Your most frequent mistakes. The AI focuses on these.</p>
            <div className="space-y-3">
              {errors.length > 0 ? errors.map((item: any, idx: number) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + idx * 0.08 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.error}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{item.suggestion}</p>
                  </div>
                </motion.div>
              )) : (
                <p className="text-sm text-muted-foreground">No critical errors tracked yet.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Functional Skills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6">
          <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-5">Functional Skills ("Can-Do" Statements)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {functional.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  item.done ? 'bg-emerald-500/20 text-emerald-400' : item.partial ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-muted-foreground'
                }`}>
                  {item.done ? '✓' : item.partial ? '~' : '✗'}
                </div>
                <span className={`text-sm ${item.done ? 'text-foreground' : item.partial ? 'text-foreground/70' : 'text-muted-foreground'}`}>{item.skill}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 glass z-50 px-2 py-3">
        <div className="flex justify-around">
          {[{ href: '/dashboard', icon: Home, label: 'Home' }, { href: '/roadmap', icon: Map, label: 'Learn' }, { href: '/progress', icon: TrendingUp, label: 'Progress', active: true }, { href: '/tutor', icon: Bot, label: 'Tutor' }, { href: '/profile', icon: User, label: 'Profile' }].map((item) => (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${item.active ? 'text-amber-400' : 'text-muted-foreground'}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
