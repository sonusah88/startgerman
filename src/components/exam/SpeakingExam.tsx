'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { submitExamSpeaking, generateExamQuestion } from '@/actions/exam';
import { Loader2, ArrowRight, Mic, Square, Play, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export function SpeakingExam({ onComplete }: { onComplete: (result: any) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [examData, setExamData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchExam = async () => {
      setIsLoading(true);
      const data = await generateExamQuestion('sprechen');
      setExamData(data);
      setIsLoading(false);
    };
    fetchExam();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAudioUrl(null);
      setAudioBlob(null);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      alert("Please allow microphone access to take the speaking exam.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.play();
    }
  };

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioBlob(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;
    setIsSubmitting(true);
    
    // Convert blob to base64
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64data = (reader.result as string).split(',')[1];
      const grading = await submitExamSpeaking(base64data, 'audio/webm');
      setIsSubmitting(false);
      onComplete(grading);
    };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <p className="animate-pulse">Generating your unique speaking prompt...</p>
      </div>
    );
  }

  if (!examData || !examData.points) {
    return (
      <div className="text-center p-8 text-red-400">Failed to generate exam. Please refresh.</div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8 text-center space-y-4">
        <h3 className="font-semibold text-purple-400 text-sm uppercase tracking-wider mb-2">Aufgabe (Speaking)</h3>
        <p className="text-foreground text-lg leading-relaxed max-w-lg mx-auto font-medium">{examData.scenario}</p>
        <div className="text-muted-foreground text-sm max-w-md mx-auto space-y-1 mt-4">
          {examData.points.map((pt: string, i: number) => (
            <p key={i}>• {pt}</p>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-10 flex flex-col items-center justify-center min-h-[300px]">
        
        {!audioUrl ? (
          <div className="space-y-6 flex flex-col items-center">
            <div className={`relative flex items-center justify-center w-32 h-32 rounded-full ${isRecording ? 'bg-red-500/10' : 'bg-white/5'}`}>
              {isRecording && <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-50" />}
              <Button
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-24 h-24 rounded-full border-0 transition-all ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-purple-500 hover:bg-purple-600 text-white hover:scale-105'}`}
              >
                {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-10 h-10" />}
              </Button>
            </div>
            <p className="text-muted-foreground font-medium">
              {isRecording ? "Recording... Click to stop" : "Click to start recording"}
            </p>
          </div>
        ) : (
          <div className="space-y-8 flex flex-col items-center w-full">
            <div className="flex items-center gap-4">
              <Button 
                onClick={playRecording} 
                disabled={isPlaying}
                className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white border-0"
              >
                {isPlaying ? <Loader2 className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>
              <Button 
                onClick={resetRecording} 
                variant="outline"
                className="h-16 px-6 rounded-full border-white/10 hover:bg-white/5 text-muted-foreground"
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Retake
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      <div className="flex justify-end pt-4">
        <Button
          size="lg"
          className="rounded-full px-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold border-0 hover:shadow-lg hover:shadow-purple-500/25 transition-all group disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isSubmitting || !audioUrl}
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Grading...</>
          ) : (
            <>Submit Audio <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
