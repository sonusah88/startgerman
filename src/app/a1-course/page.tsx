'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Lock, PlayCircle, BookA, Bot, Home, Map, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { getRoadmap } from '@/actions/user';

type LessonStatus = 'completed' | 'current' | 'locked' | 'review';

interface Lesson { id: number; title: string; type: string; status: LessonStatus; content?: any; }
interface RoadmapNodeProps { title: string; subtitle: string; status: LessonStatus; lessons: Lesson[]; index: number; id: number; }

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/roadmap', label: 'Roadmap', icon: Map },
  { href: '/a1-course', label: 'A1 Video Course', icon: Video, active: true },
  { href: '/dictionary', label: 'Dictionary', icon: BookA },
  { href: '/tutor', label: 'AI Tutor', icon: Bot },
];

export default function A1CoursePage() {
  const [roadmapData, setRoadmapData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRoadmap().then(data => {
      // Filter for A1 Video Course (modules with order > 100)
      setRoadmapData(data.filter((m: any) => m.order > 100));
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 md:pl-72">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 fixed left-0 top-0 bottom-0 glass p-6 z-40">
        <Link href="/dashboard" className="flex items-center gap-3 mb-10 hover:opacity-80 transition-opacity">
          <img src="/logo.jpg" alt="StartGerman Logo" className="h-10 w-10 rounded-full shadow-lg shadow-amber-500/20 object-cover" />
          <span className="font-bold text-xl tracking-tight">StartGerman</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active ? 'bg-amber-500/10 text-amber-400' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="p-6 md:p-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-gold">A1 Video Masterclass</span>
          </h1>
          <p className="text-muted-foreground">Learn German from scratch with comprehensive video lessons.</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin" />
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-8 top-8 bottom-8 w-1 bg-gradient-to-b from-amber-500/50 via-white/10 to-transparent rounded-full" />
            <div className="space-y-12">
              {roadmapData.map((node, i) => (
                <RoadmapNode key={node.id} index={i} {...node} status="current" />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function RoadmapNode({ title, subtitle, status, lessons, index, id }: RoadmapNodeProps) {
  const isLocked = status === 'locked';
  const isActive = status === 'current';

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`relative flex gap-6 ${isLocked ? 'opacity-60 grayscale' : ''}`}
    >
      <div className="relative z-10 flex-shrink-0 mt-1">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
          isActive ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-black shadow-amber-500/30' :
          isLocked ? 'bg-secondary/50 text-muted-foreground' : 'bg-emerald-500 text-black'
        }`}>
          {isLocked ? <Lock className="w-6 h-6" /> : isActive ? <Video className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
        </div>
      </div>

      <div className="flex-1 pb-10">
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          {isActive && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />}
          
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm mb-6">{subtitle}</p>

          <div className="space-y-3">
            {lessons.map((lesson, i) => (
              <Link key={lesson.id} href={isLocked ? '#' : `/a1-course/lesson/${lesson.id}`}>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-white/5 hover:border-white/20 transition-all hover:-translate-y-0.5 cursor-pointer">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    lesson.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    lesson.status === 'current' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-muted-foreground'
                  }`}>
                    {lesson.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 font-medium text-sm">{lesson.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
