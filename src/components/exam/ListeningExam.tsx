'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { submitExamMultipleChoice, generateExamQuestion } from '@/actions/exam';
import { Loader2, ArrowRight, Play, Pause, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export function ListeningExam({ onComplete }: { onComplete: (result: any) => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selections, setSelections] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examData, setExamData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      setIsLoading(true);
      const data = await generateExamQuestion('horen');
      setExamData(data);
      setIsLoading(false);
    };
    fetchExam();
  }, []);

  const playAudio = async () => {
    if (isPlaying || !examData?.context) return;
    setIsPlaying(true);
    
    try {
      const res = await fetch('/api/tutor/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: examData.context })
      });
      
      if (!res.ok) throw new Error('TTS API failed');
      
      const data = await res.json();
      if (data.audio) {
        const audio = new Audio(`data:${data.mimeType};base64,${data.audio}`);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          // If audio element fails, fall back to native
          playNative(examData.context);
        };
        await audio.play();
        return;
      }
      throw new Error('No audio data');
    } catch (err) {
      console.warn("Backend TTS unavailable, using browser speech:", err);
      playNative(examData.context);
    }
  };

  const playNative = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.85;
      utterance.pitch = 1;
      // Try to find a German voice
      const voices = window.speechSynthesis.getVoices();
      const germanVoice = voices.find(v => v.lang.startsWith('de'));
      if (germanVoice) utterance.voice = germanVoice;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
      alert('Audio playback is not supported in this browser.');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let score = 0;
    examData.questions.forEach((q: any, i: number) => {
      if (selections[i] === q.answer) score++;
    });
    
    const grading = await submitExamMultipleChoice('horen', score, examData.questions.length);
    setIsSubmitting(false);
    onComplete(grading);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="animate-pulse">Generating your unique listening exam...</p>
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8 text-center space-y-4">
        <h3 className="font-semibold text-amber-400 text-sm uppercase tracking-wider mb-2">Aufgabe (Listening)</h3>
        <p className="text-foreground leading-relaxed max-w-lg mx-auto">Listen to the German audio and answer the following questions. You can listen as many times as you like.</p>
        
        <div className="pt-4 flex justify-center items-center gap-4">
          <Button 
            onClick={playAudio} 
            disabled={isPlaying}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 hover:shadow-lg hover:shadow-blue-500/25 transition-all text-white border-0"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </Button>
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
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-amber-400' : 'border-white/20'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />}
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
          className="rounded-full px-8 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0 hover:shadow-lg hover:shadow-amber-500/25 transition-all group disabled:opacity-50"
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
