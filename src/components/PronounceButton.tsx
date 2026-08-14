'use client';

import { useState } from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PronounceButton({ text, className = '' }: { text: string; className?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent linking if inside a link
    e.stopPropagation();

    if (isPlaying) return;
    setIsPlaying(true);

    try {
      // 1. Try native browser synthesis first for lowest latency
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.rate = 0.9; // Slightly slower for language learners
        
        // Find a German voice if possible
        const voices = window.speechSynthesis.getVoices();
        const deVoice = voices.find(v => v.lang.startsWith('de'));
        if (deVoice) utterance.voice = deVoice;

        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => {
          console.warn('Native TTS failed, falling back to backend...');
          playBackendTTS();
        };

        window.speechSynthesis.speak(utterance);
        
        // Timeout safeguard just in case onend doesn't fire
        setTimeout(() => setIsPlaying(false), 3000);
        return;
      }

      // 2. Fallback to our backend API
      await playBackendTTS();
    } catch (err) {
      console.error('Playback error:', err);
      setIsPlaying(false);
    }
  };

  const playBackendTTS = async () => {
    const res = await fetch('/api/tutor/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    
    if (!res.ok) throw new Error('Backend TTS failed');
    
    const data = await res.json();
    if (data.audio) {
      const audio = new Audio(`data:${data.mimeType};base64,${data.audio}`);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      await audio.play();
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full hover:bg-amber-500/20 text-amber-500 transition-all ${className}`}
      onClick={handlePlay}
      disabled={isPlaying}
      title="Listen to pronunciation"
    >
      {isPlaying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
    </Button>
  );
}
