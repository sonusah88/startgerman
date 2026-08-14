'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { submitExamMultipleChoice, generateExamQuestion } from '@/actions/exam';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function ReadingExam({ onComplete }: { onComplete: (result: any) => void }) {
  const [selections, setSelections] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examData, setExamData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      setIsLoading(true);
      const data = await generateExamQuestion('lesen');
      setExamData(data);
      setIsLoading(false);
    };
    fetchExam();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let score = 0;
    examData.questions.forEach((q: any, i: number) => {
      if (selections[i] === q.answer) score++;
    });
    
    const grading = await submitExamMultipleChoice('lesen', score, examData.questions.length);
    setIsSubmitting(false);
    onComplete(grading);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p className="animate-pulse">Generating your unique reading exam...</p>
      </div>
    );
  }

  if (!examData || !examData.questions) {
    return (
      <div className="text-center p-8 text-red-400">Failed to generate exam. Please refresh.</div>
    );
  }

  const allAnswered = Object.keys(selections).length === examData.questions.length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8 space-y-4">
        <h3 className="font-semibold text-emerald-400 text-sm uppercase tracking-wider mb-2">Aufgabe (Reading)</h3>
        <p className="text-muted-foreground text-sm">Lesen Sie den Text und kreuzen Sie die richtige Antwort an (Read the text and select the right answer).</p>
        
        <div className="pt-4 pb-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 font-mono leading-relaxed whitespace-pre-wrap">
            {examData.context}
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        {examData.questions.map((q: any, qIndex: number) => (
          <motion.div 
            key={q.id || qIndex}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * qIndex }}
            className="glass-card rounded-2xl p-6"
          >
            <h4 className="text-lg font-medium mb-4">{qIndex + 1}. {q.question}</h4>
            <div className="space-y-2">
              {q.options.map((opt: string, oIndex: number) => {
                const isSelected = selections[qIndex] === oIndex;
                return (
                  <button
                    key={oIndex}
                    onClick={() => setSelections(prev => ({ ...prev, [qIndex]: oIndex }))}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all border ${
                      isSelected 
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-emerald-400' : 'border-white/20'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
                      </div>
                      {opt}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          size="lg"
          className="rounded-full px-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold border-0 hover:shadow-lg hover:shadow-emerald-500/25 transition-all group disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isSubmitting || !allAnswered}
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Grading...</>
          ) : (
            <>Submit <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
