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
  const handleSelect = (questionIndex: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [`${currentPart}-${questionIndex}`]: optionIndex }));
  };

  const nextPart = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsPlaying(false);
    
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

    const result = await submitExamMultipleChoice('horen', totalScore, totalQuestions);
    setIsSubmitting(false);
    onComplete(result);
  };

  const toggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech not supported in your browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const currentTeil = examData[`teil${currentPart}`];
    const utterance = new SpeechSynthesisUtterance(currentTeil.context);
    utterance.lang = 'de-DE';
    utterance.rate = 0.85; // slightly slower for A1

    // Try to find a good German voice
    const voices = window.speechSynthesis.getVoices();
    const deVoice = voices.find(v => v.lang.startsWith('de'));
    if (deVoice) utterance.voice = deVoice;

    utterance.onend = () => setIsPlaying(false);
    
    synthRef.current = utterance;
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="animate-pulse">Generating your unique listening tasks...</p>
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
            <div key={i} className={`w-2 h-2 rounded-full ${currentPart >= i ? 'bg-blue-500' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentPart} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
          <div className="glass-card rounded-2xl p-8 space-y-6 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-3 text-blue-400 font-semibold uppercase tracking-wider text-sm mb-2">
              <Volume2 className="w-5 h-5" /> Hörverstehen Teil {currentPart}
            </div>
            
            <div className="relative w-32 h-32 rounded-full bg-blue-500/10 flex items-center justify-center group">
              {isPlaying && (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-20" />
                  <div className="absolute inset-0 rounded-full border border-blue-400 animate-pulse opacity-40" style={{ animationDelay: '200ms' }} />
                </>
              )}
              <Button 
                onClick={toggleAudio}
                className={`w-24 h-24 rounded-full border-0 transition-all ${isPlaying ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'}`}
              >
                {isPlaying ? <Pause className="w-10 h-10 text-white" /> : <Play className="w-10 h-10 text-white ml-1" />}
              </Button>
            </div>
            <p className="text-muted-foreground font-medium">
              {isPlaying ? "Playing audio..." : "Listen to the audio track"}
            </p>
            
            {/* Context explicitly displayed during testing for AI mock */}
            <details className="mt-4 text-xs text-muted-foreground text-left w-full max-w-sm">
              <summary className="cursor-pointer hover:text-white transition-colors">Show Transcript (Cheat)</summary>
              <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/10">{currentTeil.context}</div>
            </details>
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
                          ? 'bg-blue-500/20 border-blue-500 text-blue-300' 
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
          className="rounded-full px-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold border-0 hover:shadow-lg hover:shadow-blue-500/25 transition-all group"
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
