'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Play, MessageCircle, RefreshCw, GraduationCap, BookOpen, Headphones, FileText, Mic, Brain, Languages, Home, Map, BookA, Bot, User, Flame, Gem, ChevronRight, Video, Pen, BookText, PenSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getUserProgress } from '@/actions/user';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, active: true },
  { href: '/roadmap', label: 'Roadmap', icon: Map },
  { href: '/a1-course', label: 'A1 Course', icon: Video },
  { href: '/dictionary', label: 'Dictionary', icon: BookA },
  { href: '/conjugation', label: 'Conjugation', icon: Pen },
  { href: '/reading', label: 'Reading', icon: BookOpen },
  { href: '/listening', label: 'Listening', icon: Headphones },
  { href: '/scenarios', label: 'Scenarios', icon: MessageCircle },
  { href: '/scenarios/writing', label: 'Writing', icon: FileText },
  { href: '/tutor', label: 'AI Tutor', icon: Bot },
  { href: '/vocabulary', label: 'Vocabulary', icon: Languages },
  { href: '/exam', label: 'Exam Prep', icon: GraduationCap },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

function CircularProgress({ value, size = 80, stroke = 6, color = '#f59e0b' }: { value: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      />
    </svg>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getUserProgress().then(d => { if (d) setData(d); else window.location.href = '/login'; });
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { user, progress, vocabDue, examReadiness, xp, currentStreak } = data;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend';

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 md:pl-72">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 fixed left-0 top-0 bottom-0 glass p-6 z-40">
        <Link href="/dashboard" className="flex items-center gap-3 mb-10 hover:opacity-80 transition-opacity">
          <img src="/logo.jpg" alt="StartGerman Logo" className="h-10 w-10 rounded-full shadow-lg shadow-amber-500/20 object-cover" />
          <span className="font-bold text-xl tracking-tight">StartGerman</span>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                item.active
                  ? 'bg-amber-500/10 text-amber-400 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? 'text-amber-400' : 'text-muted-foreground group-hover:text-foreground'} transition-colors`} />
              {item.label}
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </Link>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-xs">
              {user.name?.[0] || 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-foreground">{user.name || 'Student'}</p>
              <p className="text-xs text-muted-foreground">{user.currentLevel}</p>
            </div>
          </Link>
        </div>
      </aside>

      <motion.main
        initial="hidden" animate="visible" variants={stagger}
        className="p-6 md:p-10 max-w-5xl mx-auto space-y-8"
      >
        {/* Top Stats Bar */}
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 glass-card rounded-full px-4 py-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="font-bold text-sm">{currentStreak}</span>
              <span className="text-xs text-muted-foreground">day streak</span>
            </div>
            <div className="flex items-center gap-2 glass-card rounded-full px-4 py-2">
              <Gem className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-sm">{xp}</span>
              <span className="text-xs text-muted-foreground">XP</span>
            </div>
          </div>
          <div className="md:hidden">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold">
              {user.name?.[0] || 'S'}
            </div>
          </div>
        </motion.div>

        {/* Greeting */}
        <motion.div variants={fadeUp}>
          <h1 className="text-3xl md:text-4xl font-bold">
            {greeting}, <span className="text-gradient-gold">{user.name || 'Student'}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-2">Ready for your {user.dailyMinutes}-minute daily session?</p>
        </motion.div>

        {/* Continue Learning CTA */}
        <motion.div variants={fadeUp}>
          <Link href="/lesson/current"
            className="group flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 text-black fill-black" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Continue Learning</h3>
                <p className="text-sm text-muted-foreground">Continue your daily lesson</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Progress Ring */}
          <div className="glass-card rounded-2xl p-6 flex items-center gap-5">
            <div className="relative">
              <CircularProgress value={progress} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{progress}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="text-lg font-bold">{user.currentLevel}</p>
            </div>
          </div>

          {/* Vocab Due */}
          <Link href="/vocabulary/review" className="glass-card rounded-2xl p-6 group hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <RefreshCw className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Vocab Review</span>
            </div>
            <p className="text-3xl font-bold">{vocabDue}</p>
            <p className="text-sm text-muted-foreground mt-1">words due today</p>
          </Link>

          {/* Exam Readiness */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Exam Readiness</span>
            </div>
            <p className="text-3xl font-bold">{examReadiness}%</p>
            <div className="w-full h-2 bg-white/5 rounded-full mt-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${examReadiness}%` }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeUp}>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: '/tutor', icon: Bot, label: 'AI Chat', color: 'from-purple-500 to-indigo-500' },
              { href: '/dictionary', icon: BookA, label: 'Dictionary', color: 'from-blue-500 to-cyan-500' },
              { href: '/scenarios', icon: MessageCircle, label: 'Scenarios', color: 'from-emerald-500 to-teal-500' },
              { href: '/exam', icon: GraduationCap, label: 'Mock Exam', color: 'from-rose-500 to-pink-500' },
              { href: '/conjugation', icon: Pen, label: 'Conjugation', color: 'from-amber-500 to-orange-500' },
              { href: '/reading', icon: BookOpen, label: 'Reading', color: 'from-sky-500 to-indigo-500' },
              { href: '/listening', icon: Headphones, label: 'Listening', color: 'from-violet-500 to-purple-500' },
              { href: '/scenarios/writing', icon: FileText, label: 'Writing', color: 'from-teal-500 to-green-500' },
            ].map((action, index) => (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <CardContainer className="w-full h-full" containerClassName="py-0">
                  <Link href={action.href} className="w-full h-full block">
                    <CardBody className="w-full h-full glass-card rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-center group/card hover:border-white/20 transition-all hover:shadow-2xl">
                      <CardItem translateZ="40" className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover/card:scale-110 transition-transform shadow-lg`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </CardItem>
                      <CardItem translateZ="30" className="text-sm font-semibold">
                        {action.label}
                      </CardItem>
                    </CardBody>
                  </Link>
                </CardContainer>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills Overview */}
        <motion.div variants={fadeUp}>
          <h2 className="text-xl font-bold mb-4">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.skills?.map((skill: any) => {
              let Icon = BookOpen;
              if (skill.title === 'Hören') Icon = Headphones;
              if (skill.title === 'Schreiben') Icon = FileText;
              if (skill.title === 'Sprechen') Icon = Mic;
              if (skill.title === 'Grammatik') Icon = Brain;
              if (skill.title === 'Wortschatz') Icon = Languages;
              
              return (
                <div key={skill.title} className="glass-card rounded-2xl p-5 flex items-center gap-4 group hover:border-white/15 transition-all duration-300">
                  <div className="relative">
                    <CircularProgress value={skill.score} size={56} stroke={4} color={skill.color} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-4 h-4" style={{ color: skill.color }} />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{skill.title}</p>
                    <p className="text-xs text-muted-foreground">{skill.score}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass z-50 px-2 py-3">
        <div className="flex justify-around">
          {[
            { href: '/dashboard', icon: Home, label: 'Home', active: true },
            { href: '/roadmap', icon: Map, label: 'Learn' },
            { href: '/dictionary', icon: BookA, label: 'Dict' },
            { href: '/tutor', icon: Bot, label: 'Tutor' },
            { href: '/profile', icon: User, label: 'Profile' },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
                item.active ? 'text-amber-400' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
