'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { generateExamQuestion, submitExamMultipleChoice } from '@/actions/exam';
import { Loader2, ArrowRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ReadingExam({ onComplete }: { onComplete: (result: any) => void }) {
  const [examData, setExamData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPart, setCurrentPart] = useState(1);

  useEffect(() => {
    const fetchExam = async () => {
      setIsLoading(true);
      const data = await generateExamQuestion('lesen');
      setExamData(data);
      setIsLoading(false);
    };
    fetchExam();
  }, []);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [`${currentPart}-${questionIndex}`]: optionIndex }));
  };

  const nextPart = () => {
    if (currentPart < 3) {
      setCurrentPart(currentPart + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let totalScore = 0;
    let totalQuestions = 0;
    
    [1, 2, 3].forEach(part => {
      const teil = examData[`teil${part}`];
      if (teil && teil.questions) {
        teil.questions.forEach((q: any, i: number) => {
          totalQuestions++;
          if (answers[`${part}-${i}`] === q.answer) totalScore++;
        });
      }
    });

    const result = await submitExamMultipleChoice('lesen', totalScore, totalQuestions);
    setIsSubmitting(false);
    onComplete(result);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p className="animate-pulse">Generating your unique reading passages...</p>
      </div>
    );
  }

  if (!examData || !examData.teil1) {
    return <div className="text-center p-8 text-red-400">Failed to generate exam. Please refresh.</div>;
  }

  const currentTeil = examData[`teil${currentPart}`];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-4">
        <span>Teil {currentPart} von 3</span>
        <div className="flex gap-1">
          {[1,2,3].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full ${currentPart >= i ? 'bg-emerald-500' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentPart} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
          <div className="glass-card rounded-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3 text-emerald-400 font-semibold uppercase tracking-wider text-sm mb-4">
              <BookOpen className="w-5 h-5" /> Leseverstehen Teil {currentPart}
            </div>
            <div className="p-6 bg-white/[0.03] rounded-xl border border-white/5 font-serif text-lg leading-relaxed whitespace-pre-wrap">
              {currentTeil.context}
            </div>
          </div>

          <div className="space-y-8">
            {currentTeil.questions.map((q: any, i: number) => (
              <div key={i} className="glass-card rounded-2xl p-6 space-y-4">
                <p className="font-semibold text-lg">{i + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt: string, optIdx: number) => (
                    <Button
                      key={optIdx}
                      variant="outline"
                      className={`w-full justify-start text-left h-auto py-4 px-6 rounded-xl border-white/10 transition-all ${
                        answers[`${currentPart}-${i}`] === optIdx 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                          : 'hover:bg-white/5 hover:border-white/20'
                      }`}
                      onClick={() => handleSelect(i, optIdx)}
                    >
                      <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs mr-3 opacity-70">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end pt-4">
        <Button
          size="lg"
          className="rounded-full px-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold border-0 hover:shadow-lg hover:shadow-emerald-500/25 transition-all group"
          onClick={nextPart}
          disabled={isSubmitting || currentTeil.questions.some((_: any, i: number) => answers[`${currentPart}-${i}`] === undefined)}
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
          ) : (
            <>
              {currentPart < 3 ? 'Weiter (Next)' : 'Prüfung abgeben'} 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
