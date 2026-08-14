'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { TutorScene } from '@/components/3d/Scene';
import { Button } from '@/components/ui/button';
import { Mic, ArrowLeft, Settings2, Keyboard, StopCircle, Loader2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { SCENARIOS } from '@/lib/scenarios';
import { Suspense } from 'react';

type Message = { sender: 'user' | 'tutor'; text: string; translation?: string };

function TutorPageContent() {
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get('scenario');
  const scenarioContext = scenarioId ? SCENARIOS.find(s => s.id === scenarioId) : null;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [textInput, setTextInput] = useState('');
  
  // If no scenario, start with default greeting. If scenario, start empty.
  const [transcript, setTranscript] = useState<Message[]>(
    scenarioContext ? [] : [{ sender: 'tutor', text: 'Hello! How can I help you practice your German today?' }]
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const isProcessingRef = useRef(false);
  const transcriptRef = useRef<Message[]>(transcript);
  const scenarioInitializedRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  // ──────────────────────────────────────────────
  // SPEECH SYNTHESIS (TTS) — Tutor speaks German
  // ──────────────────────────────────────────────
  const speakGerman = useCallback(async (text: string) => {
    if (typeof window === 'undefined') return;

    setIsSpeaking(true);
    const audioRef = { current: null as HTMLAudioElement | null };

    try {
      // Use Gemini TTS for natural German pronunciation
      const res = await fetch('/api/tutor/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (data.audio && data.mimeType) {
        // Convert base64 to audio blob and play
        const audioBytes = atob(data.audio);
        const audioArray = new Uint8Array(audioBytes.length);
        for (let i = 0; i < audioBytes.length; i++) {
          audioArray[i] = audioBytes.charCodeAt(i);
        }
        const blob = new Blob([audioArray], { type: data.mimeType });
        const url = URL.createObjectURL(blob);

        const audio = new Audio(url);
        audio.playbackRate = 0.9; // Slightly slower for clarity
        audioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
        };

        await audio.play();
        return;
      }
    } catch (e) {
      console.warn('Gemini TTS failed, falling back to browser TTS:', e);
    }

    // Fallback: use browser speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.75;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const deVoices = voices.filter(v => v.lang.startsWith('de'));
      const best =
        deVoices.find(v => /google/i.test(v.name)) ||
        deVoices.find(v => /premium|enhanced|neural/i.test(v.name)) ||
        deVoices[0];
      if (best) utterance.voice = best;

      utterance.onend   = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  }, []);

  // Pre-load browser voices as fallback
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.getVoices();
    synth.onvoiceschanged = () => synth.getVoices();
  }, []);

  // ──────────────────────────────────────────────
  // GEMINI API CALL
  // ──────────────────────────────────────────────
  const fetchTutorResponse = useCallback(async (history: Message[]) => {
    if (isProcessingRef.current) return;   // guard against double-fire
    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      const reqBody: any = { messages: history };
      if (scenarioContext) {
        reqBody.scenario = `${scenarioContext.title}: ${scenarioContext.desc}`;
      }

      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody),
      });

      const data = await res.json();
      if (data.response) {
        // If the user spoke English, the AI gives us the German translation. Let's retroactively attach it to the user's message in state!
        if (data.userGermanTranslation) {
          setTranscript(prev => {
            const newArr = [...prev];
            const lastUserIdx = newArr.findLastIndex(m => m.sender === 'user');
            if (lastUserIdx !== -1) {
              newArr[lastUserIdx] = { ...newArr[lastUserIdx], translation: data.userGermanTranslation };
            }
            return newArr;
          });
        }

        const tutorMsg: Message = { 
          sender: 'tutor', 
          text: data.response, 
          translation: data.tutorEnglish 
        };
        
        setTranscript(prev => [...prev, tutorMsg]);
        speakGerman(data.response);
      } else if (data.error) {
        // Prevent Next.js red overlay by not using console.error for API capacity issues
        console.warn('Tutor API issue:', data.error);
        const sysMsg: Message = { 
          sender: 'tutor', 
          text: "I'm sorry, my servers are a bit overloaded right now! Please try again in a moment.", 
          translation: "Entschuldigung, meine Server sind gerade etwas überlastet!" 
        };
        setTranscript(prev => [...prev, sysMsg]);
      }
    } catch (e: any) {
      console.warn('Failed to fetch tutor response:', e.message);
      const sysMsg: Message = { sender: 'tutor', text: "Connection error. Please try again." };
      setTranscript(prev => [...prev, sysMsg]);
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  }, [speakGerman, scenarioContext]);

  // Initial trigger for scenarios
  useEffect(() => {
    if (scenarioContext && transcript.length === 0 && !scenarioInitializedRef.current) {
      scenarioInitializedRef.current = true;
      fetchTutorResponse([]);
    }
  }, [scenarioContext, transcript.length, fetchTutorResponse]);

  // ──────────────────────────────────────────────
  // SEND A USER MESSAGE (shared by mic & keyboard)
  // ──────────────────────────────────────────────
  const sendUserMessage = useCallback((text: string) => {
    if (!text.trim() || isProcessingRef.current) return;
    const userMsg: Message = { sender: 'user', text: text.trim() };
    const newHistory = [...transcriptRef.current, userMsg];
    setTranscript(newHistory);
    fetchTutorResponse(newHistory);
  }, [fetchTutorResponse]);

  // ──────────────────────────────────────────────
  // SPEECH RECOGNITION (STT) — Listen to user
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'de-DE';           // listen for German
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      if (result) sendUserMessage(result);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [sendUserMessage]);

  // ──────────────────────────────────────────────
  // MIC TOGGLE
  // ──────────────────────────────────────────────
  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Cancel any ongoing TTS so the mic doesn't pick up the tutor's voice
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Could not start recognition:', e);
      }
    }
  }, [isListening]);

  // ──────────────────────────────────────────────
  // TEXT SEND
  // ──────────────────────────────────────────────
  const handleTextSend = useCallback(() => {
    if (!textInput.trim()) return;
    sendUserMessage(textInput.trim());
    setTextInput('');
  }, [textInput, sendUserMessage]);

  // ──────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* 3D Tutor Area */}
      <div className="w-full md:w-1/2 lg:w-[55%] h-[45vh] md:h-screen relative bg-gradient-to-b from-background via-background to-black/20">
        <div className="absolute top-5 left-5 z-10">
          <Button variant="ghost" size="icon" className="rounded-full glass hover:bg-white/10" asChild>
            <Link href="/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
        </div>
        <div className="absolute top-5 right-5 z-10">
          <Button variant="ghost" size="icon" className="rounded-full glass hover:bg-white/10">
            <Settings2 className="w-5 h-5" />
          </Button>
        </div>

        <TutorScene isSpeaking={isSpeaking} />

        {/* Status Overlay */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center">
          <AnimatePresence>
            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="glass-card px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2"
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-amber-400"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
                Speaking...
              </motion.div>
            )}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="glass-card px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2"
              >
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                Processing...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="w-full md:w-1/2 lg:w-[45%] h-[55vh] md:h-screen flex flex-col glass">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-white/5 bg-white/5">
          {scenarioContext ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <scenarioContext.icon className="w-5 h-5 text-amber-500" />
                <h2 className="font-bold text-lg text-amber-400">{scenarioContext.title}</h2>
              </div>
              <p className="text-xs text-muted-foreground">{scenarioContext.desc}</p>
            </div>
          ) : (
            <div>
              <h2 className="font-bold text-lg">AI Tutor</h2>
              <p className="text-xs text-muted-foreground">German conversation practice</p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {transcript.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-tr-sm font-medium shadow-md shadow-amber-500/20'
                  : 'glass-card rounded-tl-sm border-white/10'
              }`}>
                <div className={msg.translation ? "mb-1" : ""}>{msg.text}</div>
                {msg.translation && (
                  <div className={`text-xs mt-1 pt-1 border-t ${msg.sender === 'user' ? 'text-amber-900 border-amber-900/20 font-medium' : 'text-amber-400/80 border-white/10'}`}>
                    {msg.translation}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-amber-400/60"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Controls */}
        <div className="p-5 border-t border-white/5">
          {/* Quick Actions */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {['Langsamer', 'Übersetzen', 'Hinweis', 'Korrektur'].map(tag => (
              <button
                key={tag}
                onClick={() => sendUserMessage(tag)}
                className="px-3 py-1.5 rounded-full text-xs font-medium glass border-white/5 hover:bg-white/5 whitespace-nowrap transition-all"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Text Input (togglable) */}
          <AnimatePresence>
            {showKeyboard && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTextSend()}
                    placeholder="Type in German..."
                    className="flex-1 h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-amber-500/50 focus:outline-none transition-all"
                  />
                  <button
                    onClick={handleTextSend}
                    className="h-11 w-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mic + Keyboard */}
          <div className="flex items-center justify-center gap-4">
            <button
              className={`w-12 h-12 rounded-full transition-all flex items-center justify-center ${showKeyboard ? 'bg-amber-500/10 text-amber-400' : 'glass hover:bg-white/10'}`}
              onClick={() => setShowKeyboard(!showKeyboard)}
            >
              <Keyboard className="w-5 h-5" />
            </button>

            <div className="relative">
              {/* Pulse rings when listening */}
              {isListening && (
                <>
                  <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse-ring" />
                  <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
                </>
              )}
              <button
                className={`w-20 h-20 rounded-full shadow-2xl transition-all relative z-10 flex items-center justify-center ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white scale-110'
                    : 'bg-gradient-to-br from-amber-400 to-orange-500 text-black hover:shadow-amber-500/30 hover:scale-105'
                }`}
                onClick={toggleListening}
              >
                {isListening ? <StopCircle className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
              </button>
            </div>

            <div className="w-12" />
          </div>

          <p className="text-center text-xs font-medium text-muted-foreground mt-3">
            {isListening ? 'Listening... Speak now' : 'Tap the mic to speak'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TutorPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>}>
      <TutorPageContent />
    </Suspense>
  );
}
