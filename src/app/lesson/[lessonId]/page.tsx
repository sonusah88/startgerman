'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X, Check, Loader2, ArrowRight, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateLessonPlan } from '@/actions/lesson';
import { useParams } from 'next/navigation';

export default function LessonPlayerPage() {
  const router = useRouter();
  const params = useParams();
  const lessonIdStr = params.lessonId as string;
  const [LESSON_STEPS, setLessonSteps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const res = await fetch('/api/tutor/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.audio && data.mimeType) {
        const audioBytes = atob(data.audio);
        const audioArray = new Uint8Array(audioBytes.length);
        for (let i = 0; i < audioBytes.length; i++) audioArray[i] = audioBytes.charCodeAt(i);
        const blob = new Blob([audioArray], { type: data.mimeType });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
        audio.onerror = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
        await audio.play();
        return;
      }
    } catch (e) {
      console.warn('TTS failed', e);
    }
    // Fallback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    async function loadSteps() {
      if (!lessonIdStr) return;
      
      const steps = await generateLessonPlan(parseInt(lessonIdStr));
      if (steps && steps.length > 0) {
        const processedSteps = steps.map((s: any) => {
          if (s.type === 'practice' && s.content.options) {
            return { ...s, content: { ...s.content, options: [...s.content.options].sort(() => Math.random() - 0.5) } };
          }
          return s;
        });
        setLessonSteps(processedSteps);
      }
      setIsLoading(false);
    }
    loadSteps();
  }, [lessonIdStr]);

  // Autoplay TTS when a vocabulary (input) step loads
  useEffect(() => {
    if (LESSON_STEPS.length > 0 && currentStep < LESSON_STEPS.length) {
      const step = LESSON_STEPS[currentStep];
      if (step.type === 'input' && step.content?.word) {
        // Small delay to ensure the UI transition has started
        const timeout = setTimeout(() => {
          handleSpeak(step.content.word);
        }, 500);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentStep, LESSON_STEPS]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Preparing your lesson...</p>
        </div>
      </div>
    );
  }

  if (LESSON_STEPS.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-xl font-bold">No lessons available today</p>
          <p className="text-muted-foreground">Add words from the Dictionary to start learning!</p>
          <Button asChild className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0">
            <Link href="/dictionary">Open Dictionary</Link>
          </Button>
        </div>
      </div>
    );
  }

  const step = LESSON_STEPS[currentStep];
  const progress = ((currentStep) / LESSON_STEPS.length) * 100;

  const handleCheck = () => {
    if (step.type === 'practice') {
      setIsAnswerChecked(true);
      setIsCorrect(selectedOption === step.content.correct);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    if (currentStep < LESSON_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setIsCorrect(false);
    } else {
      router.push('/lesson/complete');
    }
  };

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
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <span className="text-sm text-muted-foreground font-mono">{currentStep + 1}/{LESSON_STEPS.length}</span>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {step.type === 'input' && (
              <motion.div 
                className="text-center space-y-6 w-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              >
                <p className="text-sm font-semibold text-amber-400 uppercase tracking-[0.2em]">{step.content.title}</p>
                <div className="glass-card rounded-3xl p-8 md:p-12 w-full max-w-xl mx-auto relative group flex flex-col items-center">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
                    <div className={`font-bold text-foreground text-center ${step.content.word?.length > 12 ? 'text-3xl md:text-4xl' : 'text-5xl md:text-6xl'}`}>
                      {step.content.word}
                    </div>
                    <button 
                      onClick={() => handleSpeak(step.content.word)}
                      disabled={isSpeaking}
                      className={`shrink-0 p-3 rounded-full transition-all ${isSpeaking ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/50 scale-110' : 'bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 hover:scale-105'}`}
                    >
                      <Volume2 className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="text-xl md:text-2xl text-muted-foreground">{step.content.meaning}</div>
                </div>
                {step.content.example && (
                  <motion.div 
                    className="glass-subtle rounded-2xl p-5 max-w-lg mx-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <p className="text-lg italic text-foreground/80">{step.content.example}</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step.type === 'grammar' && (
              <div className="text-center space-y-6">
                <p className="text-sm font-semibold text-blue-400 uppercase tracking-[0.2em]">Grammar</p>
                <h2 className="text-3xl md:text-4xl font-bold">{step.content.title}</h2>
                <div className="glass-card rounded-2xl p-8 text-left whitespace-pre-wrap text-lg leading-relaxed">
                  {step.content.text}
                </div>
              </div>
            )}

            {step.type === 'practice' && (
              <div className="space-y-8">
                <h2 className="text-2xl md:text-3xl font-bold text-center leading-snug">{step.content.question}</h2>
                <div className="grid gap-3">
                  {step.content.options?.map((option: string) => {
                    let optionStyle = 'glass-card border-white/5 hover:border-white/15 hover:bg-white/[0.05]';
                    if (isAnswerChecked) {
                      if (option === step.content.correct) optionStyle = 'border-emerald-500/50 bg-emerald-500/10 shadow-emerald-500/10';
                      else if (option === selectedOption) optionStyle = 'border-red-500/50 bg-red-500/10';
                      else optionStyle = 'glass-card border-white/5 opacity-50';
                    } else if (selectedOption === option) {
                      optionStyle = 'border-amber-500/50 bg-amber-500/10 shadow-amber-500/10';
                    }

                    return (
                      <motion.button
                        key={option}
                        whileHover={!isAnswerChecked ? { scale: 1.02 } : {}}
                        whileTap={!isAnswerChecked ? { scale: 0.98 } : {}}
                        className={`w-full text-left py-4 px-6 rounded-2xl border text-lg font-medium transition-all duration-200 ${optionStyle}`}
                        onClick={() => !isAnswerChecked && setSelectedOption(option)}
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

      {/* Footer */}
      <footer className={`p-6 border-t transition-all duration-300 ${
        isAnswerChecked
          ? (isCorrect ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5')
          : 'border-white/5'
      }`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <AnimatePresence>
              {isAnswerChecked && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-3 font-bold text-lg ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}
                >
                  {isCorrect ? (
                    <><div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Check className="w-5 h-5" /></div> Excellent!</>
                  ) : (
                    <><div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center"><X className="w-5 h-5" /></div> {step.content.correct}</>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            size="lg"
            className={`px-10 py-6 text-lg rounded-full font-bold transition-all border-0 group ${
              isAnswerChecked
                ? (isCorrect ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white')
                : (step.type === 'practice' && !selectedOption
                  ? 'bg-white/10 text-muted-foreground cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:shadow-lg hover:shadow-amber-500/25')
            }`}
            onClick={isAnswerChecked || step.type !== 'practice' ? handleNext : handleCheck}
            disabled={step.type === 'practice' && !selectedOption && !isAnswerChecked}
          >
            {isAnswerChecked || step.type !== 'practice' ? 'Continue' : 'Check'}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
