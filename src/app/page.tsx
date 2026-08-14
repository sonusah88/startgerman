'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Brain, Mic, GraduationCap, Sparkles as SparklesIcon, Globe } from 'lucide-react';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { SparklesCore } from '@/components/ui/sparkles';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

const fadeUp: any = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.12, duration: 1, ease: [0.16, 1, 0.3, 1] }
  })
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: i * 0.12,
    }
  })
};

const staggerItem: any = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  }
};

const features = [
  { icon: BookOpen, title: 'Goethe Curriculum', desc: 'Structured A1–A2 modules aligned with official Goethe-Institut standards', color: 'from-amber-500 to-orange-500' },
  { icon: Brain, title: 'Spaced Repetition', desc: 'Scientifically proven SRS algorithm adapts to your memory patterns', color: 'from-blue-500 to-indigo-500' },
  { icon: Mic, title: 'AI Conversation', desc: 'Practice real German dialogue with a 3D AI tutor who speaks back', color: 'from-emerald-500 to-teal-500' },
  { icon: GraduationCap, title: 'Exam Preparation', desc: 'Mock Goethe exams for Lesen, Hören, Schreiben, and Sprechen', color: 'from-purple-500 to-pink-500' },
  { icon: SparklesIcon, title: '8,000+ Words', desc: 'Comprehensive dictionary powered by rep12.com API with instant lookup', color: 'from-rose-500 to-red-500' },
  { icon: Globe, title: 'Real Scenarios', desc: 'Learn practical German for ordering food, asking directions, and more', color: 'from-cyan-500 to-blue-500' },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="px-6 py-5 flex items-center justify-between relative z-20 glass-subtle"
      >
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/logo.jpg" alt="StartGerman Logo" className="h-10 w-10 rounded-full shadow-lg shadow-amber-500/20 object-cover" />
          <span className="font-bold text-xl tracking-tight">StartGerman</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Log in
          </Link>
          <Button className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all hover:scale-105 border-0" asChild>
            <Link href="/onboarding">Start Learning</Link>
          </Button>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center relative py-20">
        <BackgroundBeams />

        <div className="max-w-4xl space-y-8 relative z-10 w-full flex flex-col items-center">
          <motion.div
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-amber-400 mb-4"
          >
            <SparklesIcon className="w-4 h-4" />
            Goethe-Institut aligned · A1–A2
          </motion.div>

          <div className="relative w-full max-w-3xl flex flex-col items-center justify-center">
            {/* Core Sparkles effect behind text */}
            <div className="absolute inset-0 w-full h-full">
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={1200}
                className="w-full h-full"
                particleColor="#f59e0b"
              />
            </div>
            
            <motion.h1
              custom={1} initial="hidden" animate="visible" variants={fadeUp}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] relative z-10 mb-4"
            >
              Master German,{' '}
              <span className="text-gradient-gold">don't just study it.</span>
            </motion.h1>
          </div>

          <motion.p
            custom={2} initial="hidden" animate="visible" variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            A structured German learning system with AI tutoring, real conversation practice, spaced repetition, and Goethe exam preparation.
          </motion.p>

          <motion.div
            custom={3} initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 relative z-20"
          >
            <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-7 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold hover:shadow-xl hover:shadow-amber-500/30 transition-all hover:scale-105 border-0 group relative overflow-hidden" asChild>
              <Link href="/onboarding">
                <span className="relative z-10 flex items-center">
                  Start Learning Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Button shine effect */}
                <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 py-7 rounded-full border-white/10 hover:bg-white/5 hover:border-white/20 transition-all" asChild>
              <Link href="/tutor">Try AI Tutor</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            custom={4} initial="hidden" animate="visible" variants={staggerContainer}
            className="flex items-center justify-center gap-8 pt-12 text-sm w-full relative z-20"
          >
            {[['8,000+', 'Words'], ['200+', 'Lessons'], ['8', 'Modules'], ['Free', 'Forever']].map(([val, label]) => (
              <motion.div key={label} className="text-center" variants={staggerItem}>
                <div className="text-2xl font-bold text-foreground">{val}</div>
                <div className="text-muted-foreground">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section className="px-6 pb-24 pt-12 max-w-6xl mx-auto w-full relative z-20 bg-background">
        <TextGenerateEffect words="Why choose DeutschApp?" className="text-3xl md:text-5xl text-center mb-16" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <CardContainer key={feature.title} className="w-full h-full" containerClassName="py-0">
              <CardBody className="w-full h-full rounded-2xl glass-card p-6 group/card hover:border-white/15 hover:shadow-2xl hover:shadow-amber-500/10 transition-all">
                <CardItem translateZ="50" className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </CardItem>
                <CardItem translateZ="60" as="h3" className="text-xl font-bold mb-3">
                  {feature.title}
                </CardItem>
                <CardItem translateZ="40" as="p" className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </section>
    </div>
  );
}
