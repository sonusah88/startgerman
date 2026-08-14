'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Volume2, X, Loader2, Check, RotateCcw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDueVocabulary, submitVocabularyReview } from '@/actions/study-plan';
import { PronounceButton } from '@/components/PronounceButton';

export default function VocabularyReviewPage() {
  const router = useRouter();
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const items = await getDueVocabulary();
      setQueue(items);
      setLoading(false);
    }
    loadData();
  }, []);

  const currentItem = queue[currentIndex];
  const progress = queue.length > 0 ? (currentIndex / queue.length) * 100 : 0;

  const handleNext = async (performance?: 'hard' | 'good' | 'easy') => {
    if (performance && currentItem) {
      await submitVocabularyReview(currentItem.id, performance);
    }
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
      setSelectedOption(null);
    } else {
      router.push('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">You're all caught up!</h2>
          <p className="text-muted-foreground mb-8">No vocabulary due for review right now.</p>
          <Button onClick={() => router.push('/dashboard')} className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0 px-8">
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4 relative z-10">
        <Link href="/dashboard" className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-white/5 transition-all">
          <X className="w-6 h-6" />
        </Link>
        <div className="flex-1 max-w-xl h-3 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
            initial={{ width: 0 }} animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <span className="text-sm text-muted-foreground font-mono">{currentIndex + 1}/{queue.length}</span>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {currentItem.type === 'recall' ? (
              <div className="space-y-6">
                {/* Flashcard */}
                <div
                  className="w-full aspect-[4/3] cursor-pointer relative"
                  onClick={() => setIsFlipped(true)}
                  style={{ perspective: '1000px' }}
                >
                  <motion.div
                    className="w-full h-full relative"
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Front */}
                    <div className="absolute inset-0 glass-card rounded-3xl flex flex-col items-center justify-center p-8 backface-hidden">
                      <p className="text-sm text-muted-foreground uppercase tracking-[0.2em] font-semibold mb-6">Translate</p>
                      <p className="text-4xl md:text-5xl font-bold text-center">{currentItem.englishMeaning}</p>
                      <p className="mt-8 text-sm text-muted-foreground">Tap to reveal</p>
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent border border-amber-500/30 backface-hidden"
                      style={{ transform: 'rotateY(180deg)' }}>
                      <div className="absolute top-4 right-4">
                        <PronounceButton text={currentItem.germanWord} className="p-3 bg-white/10 hover:bg-white/20 w-12 h-12" />
                      </div>
                      <p className="text-4xl md:text-5xl font-bold text-center">
                        {currentItem.article && <span className="text-xl mr-2 font-normal text-amber-400">{currentItem.article}</span>}
                        {currentItem.germanWord}
                      </p>
                      {currentItem.plural && <p className="mt-4 text-lg text-muted-foreground">Plural: {currentItem.plural}</p>}
                    </div>
                  </motion.div>
                </div>

                {/* Rating Buttons */}
                <AnimatePresence>
                  {isFlipped && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                      <Button size="lg" className="flex-1 py-7 rounded-2xl text-base font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all" onClick={() => handleNext('hard')}>
                        <RotateCcw className="w-4 h-4 mr-2" /> Hard
                      </Button>
                      <Button size="lg" className="flex-1 py-7 rounded-2xl text-base font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all" onClick={() => handleNext('good')}>
                        Good
                      </Button>
                      <Button size="lg" className="flex-1 py-7 rounded-2xl text-base font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all" onClick={() => handleNext('easy')}>
                        Easy <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Multiple Choice Mode */
              <div className="space-y-8 text-center">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-[0.2em] font-semibold mb-6">Select the meaning</p>
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-4xl md:text-5xl font-bold text-amber-400">{currentItem.germanWord}</p>
                    <PronounceButton text={currentItem.germanWord} className="p-3 bg-white/5 hover:bg-white/10 w-12 h-12" />
                  </div>
                </div>
                <div className="grid gap-3">
                  {currentItem.options?.map((option: string) => {
                    let style = 'glass-card border-white/5 hover:border-white/15 hover:bg-white/[0.05]';
                    if (selectedOption) {
                      if (option === currentItem.englishMeaning) style = 'border-emerald-500/50 bg-emerald-500/10';
                      else if (option === selectedOption) style = 'border-red-500/50 bg-red-500/10';
                      else style = 'glass-card border-white/5 opacity-50';
                    }
                    return (
                      <motion.button key={option} whileHover={!selectedOption ? { scale: 1.02 } : {}} whileTap={!selectedOption ? { scale: 0.98 } : {}}
                        className={`w-full text-left py-4 px-6 rounded-2xl border text-lg font-medium transition-all duration-200 ${style}`}
                        onClick={() => { if (!selectedOption) { setSelectedOption(option); setTimeout(() => handleNext('good'), 1200); } }}
                      >
                        {option}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `.backface-hidden { backface-visibility: hidden; }` }} />
    </div>
  );
}
