'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, BookOpen, BarChart3, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LessonCompletePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Celebratory glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/[0.06] rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-md"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          className="w-28 h-28 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="w-14 h-14 text-emerald-400" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold mb-3">
          <span className="text-gradient-gold">Sehr gut!</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-lg text-muted-foreground mb-10">
          You've completed your daily lesson. Keep this streak going!
        </motion.p>

        {/* Stats summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex justify-center gap-6 mb-10">
          {[
            { label: 'XP earned', value: '+25', icon: Sparkles, color: 'text-amber-400' },
            { label: 'Words learned', value: '8', icon: BookOpen, color: 'text-blue-400' },
            { label: 'Accuracy', value: '87%', icon: BarChart3, color: 'text-emerald-400' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-4 text-center min-w-[90px]">
              <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="flex flex-col gap-3">
          <Button size="lg" className="w-full rounded-full py-7 text-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0 hover:shadow-lg hover:shadow-amber-500/25 transition-all group" asChild>
            <Link href="/dashboard">
              Continue <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full rounded-full py-7 text-lg border-white/10 hover:bg-white/5" asChild>
            <Link href="/vocabulary/review">Review Vocabulary</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
