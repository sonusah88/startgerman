'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Lock, PlayCircle, ChevronDown, ChevronUp, BookOpen, MessageCircle, Brain, Headphones, Home, Map, BookA, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { getRoadmap } from '@/actions/user';

type LessonStatus = 'completed' | 'current' | 'locked' | 'review';

interface Lesson { id: number; title: string; type: string; status: LessonStatus; }
interface RoadmapNodeProps { title: string; subtitle: string; status: LessonStatus; lessons: Lesson[]; index: number; }

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/roadmap', label: 'Roadmap', icon: Map, active: true },
  { href: '/dictionary', label: 'Dictionary', icon: BookA },
  { href: '/tutor', label: 'AI Tutor', icon: Bot },
];

export default function RoadmapPage() {
  const [roadmapData, setRoadmapData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRoadmap().then(data => { setRoadmapData(data); setLoading(false); });
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
            <span className="text-gradient-gold">A1</span> Roadmap
          </h1>
          <p className="text-muted-foreground">Your Goethe-aligned path to German fluency.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="relative ml-6 md:ml-8">
            {/* Glowing vertical line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/40 via-amber-500/10 to-transparent pointer-events-none" />

            <div className="space-y-5">
              {roadmapData.map((node, index) => (
                <RoadmapNode
                  key={index}
                  title={node.title}
                  subtitle={node.subtitle}
                  status={node.status as LessonStatus}
                  lessons={node.lessons}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass z-50 px-2 py-3">
        <div className="flex justify-around">
          {[
            { href: '/dashboard', icon: Home, label: 'Home' },
            { href: '/roadmap', icon: Map, label: 'Learn', active: true },
            { href: '/dictionary', icon: BookA, label: 'Dict' },
            { href: '/tutor', icon: Bot, label: 'Tutor' },
            { href: '/profile', icon: User, label: 'Profile' },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${item.active ? 'text-amber-400' : 'text-muted-foreground'}`}
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

function RoadmapNode({ title, subtitle, status, lessons, index }: RoadmapNodeProps) {
  const [isExpanded, setIsExpanded] = useState(status === 'current');

  const config = {
    completed: {
      Icon: CheckCircle2,
      dot: 'bg-emerald-500 shadow-emerald-500/40',
      card: 'border-emerald-500/20 hover:border-emerald-500/40',
      opacity: '',
    },
    current: {
      Icon: PlayCircle,
      dot: 'bg-amber-500 shadow-amber-500/40 animate-pulse',
      card: 'border-amber-500/30 glow-border-gold',
      opacity: '',
    },
    locked: {
      Icon: Lock,
      dot: 'bg-white/10',
      card: 'border-white/5 opacity-50',
      opacity: 'opacity-50',
    },
    review: {
      Icon: CheckCircle2,
      dot: 'bg-blue-500 shadow-blue-500/40',
      card: 'border-blue-500/20',
      opacity: '',
    },
  };
  const c = config[status] || config.locked;

  const lessonIcon = (type: string) => {
    switch (type) {
      case 'vocabulary': return <BookOpen className="w-4 h-4" />;
      case 'conversation': return <MessageCircle className="w-4 h-4" />;
      case 'grammar': return <Brain className="w-4 h-4" />;
      case 'listening': return <Headphones className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-8"
    >
      {/* Dot on the timeline */}
      <div className={`absolute -left-[5px] top-7 w-[10px] h-[10px] rounded-full ${c.dot} shadow-lg z-10`} />

      <div className={`glass-card rounded-2xl border transition-all duration-300 ${c.card} ${c.opacity}`}>
        <div
          className="flex justify-between items-center p-5 cursor-pointer select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4">
            <c.Icon className={`w-5 h-5 ${status === 'current' ? 'text-amber-400' : status === 'completed' ? 'text-emerald-400' : 'text-muted-foreground'}`} />
            <div>
              <h3 className="font-bold text-base">{title}</h3>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-2 border-t border-white/5 space-y-2">
                {lessons?.map((lesson, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link href={`/lesson/${lesson.id}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                          {lessonIcon(lesson.type)}
                        </div>
                        <span className="text-sm font-medium">{lesson.title}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 -rotate-90 text-muted-foreground group-hover:text-amber-400 transition-colors" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
