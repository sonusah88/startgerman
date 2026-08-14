'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertTriangle, Lightbulb, Home, Map, BookA, Bot, FileText, ChevronLeft } from 'lucide-react';
import type { LanguageToolResponse, LanguageToolMatch } from '@/lib/api/languagetool';
import { motion, AnimatePresence } from 'framer-motion';

export default function WritingPracticePage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LanguageToolResponse | null>(null);
  const [error, setError] = useState('');

  const checkGrammar = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!res.ok) {
        throw new Error('Failed to check grammar');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFix = (matchIndex: number, replacementValue: string) => {
    if (!result) return;
    
    const match = result.matches[matchIndex];
    const newText = text.substring(0, match.offset) + replacementValue + text.substring(match.offset + match.length);
    setText(newText);
    
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 md:pl-72">
      <aside className="hidden md:flex flex-col w-72 fixed left-0 top-0 bottom-0 glass p-6 z-40">
        <Link href="/dashboard" className="flex items-center gap-3 mb-10 hover:opacity-80 transition-opacity">
          <img src="/logo.jpg" alt="StartGerman Logo" className="h-10 w-10 rounded-full shadow-lg shadow-amber-500/20 object-cover" />
          <span className="font-bold text-xl tracking-tight">StartGerman</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {[
            { href: '/dashboard', label: 'Dashboard', icon: Home },
            { href: '/roadmap', label: 'Roadmap', icon: Map },
            { href: '/scenarios', label: 'Scenarios', icon: ChevronLeft },
            { href: '/scenarios/writing', label: 'Writing', icon: FileText, active: true },
            { href: '/dictionary', label: 'Dictionary', icon: BookA },
            { href: '/tutor', label: 'AI Tutor', icon: Bot },
          ].map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-amber-500/10 text-amber-400' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
              <item.icon className="w-5 h-5" /> {item.label}
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-fade-in">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-gold">Writing</span> Practice
          </h1>
          <p className="text-muted-foreground text-lg">
            Type German sentences and get instant feedback on your grammar, spelling, and case endings.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 shadow-xl"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ich helfe der Mann... (Type a sentence here)"
            className="w-full min-h-[200px] p-5 rounded-xl border border-white/10 bg-black/20 text-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all resize-none mb-6 text-foreground placeholder:text-white/20"
          />
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Powered by LanguageTool
            </p>
            <Button 
              onClick={checkGrammar} 
              disabled={loading || text.length === 0}
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-full px-8 font-bold border-0 hover:scale-105 transition-all shadow-lg hover:shadow-amber-500/25 w-full sm:w-auto"
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Check Grammar'}
            </Button>
          </div>
        </motion.div>

        {error && (
          <div className="p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 flex items-center animate-slide-up">
            <AlertTriangle className="mr-3 h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6 pt-4"
            >
              <h2 className="text-2xl font-bold flex items-center">
                Feedback
                {result.matches.length === 0 && (
                  <span className="ml-3 inline-flex items-center text-emerald-400 text-lg bg-emerald-500/10 px-3 py-1 rounded-full">
                    <CheckCircle2 className="mr-2 h-5 w-5" /> Perfect!
                  </span>
                )}
              </h2>

              {result.matches.length > 0 && (
                <div className="grid gap-4">
                  {result.matches.map((match, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: i * 0.1 }}
                      className="glass-card rounded-2xl border-l-4 border-l-amber-500 shadow-md p-6"
                    >
                      <h3 className="text-lg font-bold text-amber-400 flex items-center mb-4">
                        <Lightbulb className="mr-2 h-5 w-5" />
                        {match.message}
                      </h3>
                      
                      <div className="bg-black/40 rounded-xl p-4 font-mono text-sm mb-5 border border-white/5">
                        <span className="opacity-50">{text.substring(Math.max(0, match.offset - 25), match.offset)}</span>
                        <span className="bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded border border-amber-500/30 mx-0.5">
                          {text.substring(match.offset, match.offset + match.length)}
                        </span>
                        <span className="opacity-50">{text.substring(match.offset + match.length, Math.min(text.length, match.offset + match.length + 25))}</span>
                      </div>

                      {match.replacements.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Suggestions:</p>
                          <div className="flex flex-wrap gap-2">
                            {match.replacements.slice(0, 5).map((rep, j) => (
                              <Button
                                key={j}
                                variant="outline"
                                className="rounded-full border-amber-500/30 hover:bg-amber-500/20 hover:text-amber-400 bg-black/20"
                                onClick={() => applyFix(i, rep.value)}
                              >
                                {rep.value}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 glass z-50 px-2 py-3">
        <div className="flex justify-around">
          {[{ href: '/dashboard', icon: Home, label: 'Home' }, { href: '/roadmap', icon: Map, label: 'Learn' }, { href: '/scenarios/writing', icon: FileText, label: 'Writing', active: true }, { href: '/tutor', icon: Bot, label: 'Tutor' }, { href: '/dictionary', icon: BookA, label: 'Dict' }].map((item) => (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${item.active ? 'text-amber-400' : 'text-muted-foreground hover:text-foreground'}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
