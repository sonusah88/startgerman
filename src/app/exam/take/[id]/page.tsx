'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { use } from 'react';
import Link from 'next/link';

import { WritingExam } from '@/components/exam/WritingExam';
import { ListeningExam } from '@/components/exam/ListeningExam';
import { ReadingExam } from '@/components/exam/ReadingExam';
import { SpeakingExam } from '@/components/exam/SpeakingExam';

const EXAM_INFO: Record<string, { title: string; time: number }> = {
  'horen': { title: 'Hören (Listening)', time: 1200 },
  'lesen': { title: 'Lesen (Reading)', time: 1500 },
  'schreiben': { title: 'Schreiben (Writing)', time: 1200 },
  'sprechen': { title: 'Sprechen (Speaking)', time: 900 }
};

export default function TakeExamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const examMeta = EXAM_INFO[id] || { title: 'Mock Exam', time: 1200 };
  
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(examMeta.time);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (result) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [result]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const timePercent = (timeLeft / examMeta.time) * 100;

  if (result) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full glass-card rounded-3xl p-10"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-6">Exam Results</h2>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <motion.circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke={result.score >= 60 ? '#10b981' : '#ef4444'}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 52}
                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - result.score / 100) }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">{result.score}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              {result.score >= 60 ? (
                <><CheckCircle2 className="w-5 h-5 text-emerald-400" /><span className="font-medium text-emerald-400">Passed!</span></>
              ) : (
                <><XCircle className="w-5 h-5 text-red-400" /><span className="font-medium text-red-400">Keep Practicing</span></>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Feedback</h3>
              <p className="text-foreground/80 leading-relaxed">{result.feedback}</p>
            </div>
            {result.correctedText && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Corrected Text</h3>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-sm leading-relaxed">{result.correctedText}</div>
              </div>
            )}
            {result.transcription && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">What we heard</h3>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-sm leading-relaxed">{result.transcription}</div>
              </div>
            )}
            {result.totalQuestions !== undefined && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Score Detail</h3>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-sm leading-relaxed">
                  You got {result.correctAnswers} out of {result.totalQuestions} questions correct.
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            <Button variant="outline" className="flex-1 rounded-xl border-white/10 hover:bg-white/5" onClick={() => router.push('/exam')}>Back to Exams</Button>
            <Button className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0" onClick={() => router.push('/dashboard')}>Dashboard</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 flex items-center justify-between glass sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5" asChild>
            <Link href="/exam"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div>
            <h3 className="font-bold text-sm">{examMeta.title}</h3>
            <p className="text-xs text-muted-foreground">Goethe A1 Mock Exam</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 font-mono text-lg px-4 py-2 rounded-full ${
          timeLeft < 300 ? 'bg-red-500/10 text-red-400 animate-pulse' : 'glass'
        }`}>
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </header>

      {/* Time progress bar */}
      <div className="h-1 bg-white/5">
        <motion.div
          className={`h-full ${timeLeft < 300 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
          initial={{ width: '100%' }}
          animate={{ width: `${timePercent}%` }}
          transition={{ duration: 1 }}
        />
      </div>

      <main className="flex-1 p-6 md:p-10 max-w-3xl mx-auto w-full">
        {id === 'horen' && <ListeningExam onComplete={setResult} />}
        {id === 'lesen' && <ReadingExam onComplete={setResult} />}
        {id === 'schreiben' && <WritingExam onComplete={setResult} />}
        {id === 'sprechen' && <SpeakingExam onComplete={setResult} />}
      </main>
    </div>
  );
}
