'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Loader2, Home, Map, BookA, Bot, Headphones, Play, Pause, RotateCcw, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { PronounceButton } from '@/components/PronounceButton';

interface ListeningExercise {
  id: number;
  sentence: string;
  translation: string;
  difficulty: string;
  blanks: { word: string; hint: string }[];
}

const EXERCISES: ListeningExercise[] = [
  // A1.1 — Basic sentences
  { id: 1, sentence: 'Ich heiße Maria und komme aus Spanien.', translation: 'My name is Maria and I come from Spain.', difficulty: 'A1',
    blanks: [{ word: 'Spanien', hint: 'a country in southern Europe' }] },
  { id: 2, sentence: 'Ich trinke gerne Kaffee am Morgen.', translation: 'I like to drink coffee in the morning.', difficulty: 'A1',
    blanks: [{ word: 'Kaffee', hint: 'a popular hot drink' }] },
  { id: 3, sentence: 'Meine Schwester wohnt in München.', translation: 'My sister lives in Munich.', difficulty: 'A1',
    blanks: [{ word: 'Schwester', hint: 'a female sibling' }] },
  { id: 4, sentence: 'Das Wetter ist heute sehr schön.', translation: 'The weather is very nice today.', difficulty: 'A1',
    blanks: [{ word: 'Wetter', hint: 'sun, rain, clouds' }] },
  { id: 5, sentence: 'Ich möchte ein Stück Kuchen bestellen.', translation: 'I would like to order a piece of cake.', difficulty: 'A1',
    blanks: [{ word: 'Kuchen', hint: 'a sweet baked dessert' }] },
  { id: 6, sentence: 'Der Supermarkt ist neben der Apotheke.', translation: 'The supermarket is next to the pharmacy.', difficulty: 'A1',
    blanks: [{ word: 'Apotheke', hint: 'where you buy medicine' }] },
  { id: 7, sentence: 'Können Sie mir bitte helfen?', translation: 'Can you please help me?', difficulty: 'A1',
    blanks: [{ word: 'helfen', hint: 'to assist someone' }] },
  { id: 8, sentence: 'Ich stehe um sieben Uhr auf.', translation: 'I get up at seven o\'clock.', difficulty: 'A1',
    blanks: [{ word: 'sieben', hint: 'the number 7' }] },
  { id: 9, sentence: 'Wir brauchen Milch und Brot.', translation: 'We need milk and bread.', difficulty: 'A1',
    blanks: [{ word: 'Milch', hint: 'a white dairy drink' }] },
  { id: 10, sentence: 'Mein Bruder arbeitet als Ingenieur.', translation: 'My brother works as an engineer.', difficulty: 'A1',
    blanks: [{ word: 'Ingenieur', hint: 'a technical profession' }] },
  // A1.2 / A2 — Slightly harder
  { id: 11, sentence: 'Der Zug kommt um drei Uhr an.', translation: 'The train arrives at three o\'clock.', difficulty: 'A2',
    blanks: [{ word: 'Zug', hint: 'a form of public transport on tracks' }] },
  { id: 12, sentence: 'Er hat gestern einen Film gesehen.', translation: 'He watched a movie yesterday.', difficulty: 'A2',
    blanks: [{ word: 'gestern', hint: 'the day before today' }] },
  { id: 13, sentence: 'Wir fahren am Wochenende ans Meer.', translation: 'We are going to the sea on the weekend.', difficulty: 'A2',
    blanks: [{ word: 'Wochenende', hint: 'Saturday and Sunday' }] },
  { id: 14, sentence: 'Sie hat zwei Jahre in Berlin gelebt.', translation: 'She lived in Berlin for two years.', difficulty: 'A2',
    blanks: [{ word: 'gelebt', hint: 'past participle of "leben" (to live)' }] },
  { id: 15, sentence: 'Ich habe einen Termin beim Arzt.', translation: 'I have an appointment at the doctor.', difficulty: 'A2',
    blanks: [{ word: 'Termin', hint: 'a scheduled meeting or appointment' }] },
];

export default function ListeningPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSentence, setShowSentence] = useState(false);
  const [completed, setCompleted] = useState(false);

  const exercise = EXERCISES[currentIndex];
  const blank = exercise.blanks[0];
  const progress = (currentIndex / EXERCISES.length) * 100;

  const playSentence = async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    const fallbackToNative = () => {
      console.warn('High-quality TTS unavailable (rate limit/error), falling back to native');
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(exercise.sentence);
        utterance.lang = 'de-DE';
        utterance.rate = 0.65;
        
        const voices = window.speechSynthesis.getVoices();
        const deVoice = voices.find(v => v.lang === 'de-DE' && (v.name.includes('Google') || v.name.includes('Premium')))
          || voices.find(v => v.lang === 'de-DE')
          || voices.find(v => v.lang.startsWith('de'));
          
        if (deVoice) utterance.voice = deVoice;
        
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlaying(false);
      }
    };

    try {
      const res = await fetch('/api/tutor/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: exercise.sentence })
      });
      
      if (!res.ok) {
        fallbackToNative();
        return;
      }
      
      const data = await res.json();
      if (data.audio) {
        const audio = new Audio(`data:${data.mimeType};base64,${data.audio}`);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        await audio.play();
      } else {
        fallbackToNative();
      }
    } catch (err) {
      fallbackToNative();
    }
  };

  const handleCheck = () => {
    const correct = userAnswer.trim().toLowerCase() === blank.word.toLowerCase();
    setIsChecked(true);
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentIndex < EXERCISES.length - 1) {
      setCurrentIndex(i => i + 1);
      setUserAnswer('');
      setIsChecked(false);
      setIsCorrect(false);
      setShowSentence(false);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-500/25">
            <Headphones className="w-12 h-12 text-black" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Session Complete! 🎉</h1>
          <p className="text-muted-foreground text-lg mb-6">You scored {score} out of {EXERCISES.length}</p>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-8">
            <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: `${(score / EXERCISES.length) * 100}%` }} />
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => { setCurrentIndex(0); setScore(0); setCompleted(false); setUserAnswer(''); setIsChecked(false); setShowSentence(false); }}
              className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0 px-8"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/10">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

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
            { href: '/listening', label: 'Listening', icon: Headphones, active: true },
            { href: '/reading', label: 'Reading', icon: BookA },
            { href: '/tutor', label: 'AI Tutor', icon: Bot },
          ].map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-amber-500/10 text-amber-400' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
              <item.icon className="w-5 h-5" /> {item.label}
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="p-6 md:p-10 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-gold">Listening</span> Comprehension
          </h1>
          <p className="text-muted-foreground mb-8">Listen to German sentences and fill in the missing word.</p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-sm text-muted-foreground font-mono">{currentIndex + 1}/{EXERCISES.length}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
            {/* Audio Player Card */}
            <div className="glass-card rounded-2xl p-8 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-muted-foreground">
                Level: {exercise.difficulty}
              </div>

              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={playSentence}
                  disabled={isPlaying}
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-shadow"
                >
                  {isPlaying ? <Pause className="w-10 h-10 text-black" /> : <Play className="w-10 h-10 text-black ml-1" />}
                </motion.button>
              </div>
              <p className="text-muted-foreground text-sm">Tap to listen · Listen as many times as you need</p>
            </div>

            {/* Fill in the blank */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Fill in the missing word</p>
              <p className="text-xl leading-relaxed">
                {exercise.sentence.split(blank.word).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="inline-block mx-1 px-3 py-1 border-b-2 border-dashed border-amber-500 min-w-[100px] text-center">
                        {isChecked ? (
                          <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                            {isCorrect ? userAnswer : blank.word}
                          </span>
                        ) : '___'}
                      </span>
                    )}
                  </span>
                ))}
              </p>
              <p className="text-xs text-muted-foreground">💡 Hint: {blank.hint}</p>

              <div className="flex gap-3">
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type the missing word..."
                  className="flex-1 h-12 rounded-xl bg-secondary/50 border-white/10 text-lg"
                  disabled={isChecked}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !isChecked && userAnswer.trim()) handleCheck(); }}
                />
                {!isChecked ? (
                  <Button onClick={handleCheck} disabled={!userAnswer.trim()} className="h-12 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0">
                    Check
                  </Button>
                ) : (
                  <Button onClick={handleNext} className={`h-12 px-6 rounded-xl font-bold border-0 ${isCorrect ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
                    {currentIndex < EXERCISES.length - 1 ? 'Next' : 'Finish'}
                  </Button>
                )}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {isChecked && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-3 p-4 rounded-xl ${isCorrect ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                      {isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isCorrect ? 'Correct! Sehr gut!' : `Not quite. The answer is "${blank.word}"`}
                      </p>
                      <p className="text-sm text-muted-foreground">{exercise.translation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
