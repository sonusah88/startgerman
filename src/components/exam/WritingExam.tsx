import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { submitExamWriting, generateExamQuestion } from '@/actions/exam';
import { Loader2, ArrowRight, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function WritingExam({ onComplete }: { onComplete: (result: any) => void }) {
  const [examData, setExamData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
  const [emailAnswer, setEmailAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPart, setCurrentPart] = useState(1);

  useEffect(() => {
    const fetchExam = async () => {
      setIsLoading(true);
      const data = await generateExamQuestion('schreiben');
      setExamData(data);
      setIsLoading(false);
    };
    fetchExam();
  }, []);

  const handleFormChange = (field: string, value: string) => {
    setFormAnswers(prev => ({ ...prev, [field]: value }));
  };

  const nextPart = () => {
    if (currentPart < 2) {
      setCurrentPart(currentPart + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const fullText = \`
TEIL 1 (Formular ausfüllen):
Szenario: \${examData.teil1.scenario}
User Responses:
\${Object.entries(formAnswers).map(([k, v]) => \`- \${k}: \${v}\`).join('\\n')}

TEIL 2 (E-Mail schreiben):
Szenario: \${examData.teil2.scenario}
User Email:
\${emailAnswer}
\`;
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

  if (!examData || !examData.teil1) {
    return <div className="text-center p-8 text-red-400">Failed to generate exam. Please refresh.</div>;
  }

  const wordCount = emailAnswer.split(/\\s+/).filter(w => w.length > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-4">
        <span>Teil {currentPart} von 2</span>
        <div className="flex gap-1">
          {[1,2].map(i => (
            <div key={i} className={\`w-2 h-2 rounded-full \${currentPart >= i ? 'bg-amber-500' : 'bg-white/10'}\`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentPart} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
          <div className="glass-card rounded-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3 text-amber-400 font-semibold uppercase tracking-wider text-sm mb-4">
              <PenTool className="w-5 h-5" /> Schriftlicher Ausdruck Teil {currentPart}
            </div>
            
            {currentPart === 1 ? (
              <div className="space-y-6">
                <p className="text-foreground leading-relaxed">{examData.teil1.scenario}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {examData.teil1.fields.map((field: string, idx: number) => (
                    <div key={idx} className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">{field}</label>
                      <input 
                        type="text" 
                        value={formAnswers[field] || ''}
                        onChange={(e) => handleFormChange(field, e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        placeholder={\`Ihre Antwort...\`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-foreground leading-relaxed">{examData.teil2.scenario}</p>
                <ul className="list-none space-y-2">
                  {examData.teil2.points.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mb-4">Write about 30 words.</p>
                
                <Textarea
                  placeholder="Ihre Antwort (Your answer)..."
                  className="min-h-[250px] text-lg p-5 resize-none rounded-2xl bg-secondary/30 border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all"
                  value={emailAnswer}
                  onChange={(e) => setEmailAnswer(e.target.value)}
                />
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className={wordCount >= 25 ? 'text-emerald-400' : 'text-muted-foreground'}>
                    {wordCount} / 30 words
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end pt-4">
        <Button
          size="lg"
          className="rounded-full px-8 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0 hover:shadow-lg hover:shadow-amber-500/25 transition-all group"
          onClick={nextPart}
          disabled={isSubmitting || (currentPart === 1 ? examData.teil1.fields.some((f: string) => !formAnswers[f]) : emailAnswer.length < 10)}
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
          ) : (
            <>
              {currentPart < 2 ? 'Weiter (Next)' : 'Prüfung abgeben'} 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
