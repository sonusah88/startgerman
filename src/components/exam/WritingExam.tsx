'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { submitExamWriting, generateExamQuestion } from '@/actions/exam';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function WritingExam({ onComplete }: { onComplete: (result: any) => void }) {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examData, setExamData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      setIsLoading(true);
      const data = await generateExamQuestion('schreiben');
      setExamData(data);
      setIsLoading(false);
    };
    fetchExam();
  }, []);

  const handleSubmit = async () => {
    if (!answer) return;
    setIsSubmitting(true);
    // Combine the prompt with the answer so the grader knows what the task was
    const fullText = `Prompt: ${examData.scenario}\nUser Answer: ${answer}`;
    const grading = await submitExamWriting('schreiben', fullText);
    setIsSubmitting(false);
    onComplete(grading);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="animate-pulse">Generating your unique writing prompt...</p>
      </div>
    );
  }

  if (!examData || !examData.points) {
    return (
      <div className="text-center p-8 text-red-400">Failed to generate exam. Please refresh.</div>
    );
  }

  const wordCount = answer.split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold text-amber-400 text-sm uppercase tracking-wider mb-3">Aufgabe (Writing)</h3>
        <p className="text-foreground leading-relaxed">{examData.scenario}</p>
        <ul className="list-none mt-3 space-y-2">
          {examData.points.map((item: string, i: number) => (
            <li key={i} className="flex items-center gap-2 text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">Write about 30 words.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
        <Textarea
          placeholder="Ihre Antwort (Your answer)..."
          className="min-h-[280px] text-lg p-5 resize-none rounded-2xl bg-secondary/30 border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${wordCount >= 25 ? 'text-emerald-400' : 'text-muted-foreground'}`}>
            {wordCount} / 30 words
          </span>
          <Button
            size="lg"
            className="rounded-full px-8 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0 hover:shadow-lg hover:shadow-amber-500/25 transition-all group disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isSubmitting || answer.length < 10}
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Grading...</>
            ) : (
              <>Submit <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
