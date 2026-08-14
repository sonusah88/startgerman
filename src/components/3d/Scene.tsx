'use client';

import Image from 'next/image';

export function TutorScene({ isSpeaking = false }: { isSpeaking?: boolean }) {
  return (
    <div className="w-full h-full min-h-[400px] relative rounded-2xl overflow-hidden glass border border-white/5 flex items-center justify-center bg-black/40">
      <div className={`relative w-full h-full max-w-sm max-h-[80%] transition-transform duration-300 ${isSpeaking ? 'scale-105' : 'scale-100'}`}>
        <img 
          src="/a.gif" 
          alt="AI Tutor Avatar"
          className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        />
        
        {/* Subtle glow effect when speaking */}
        {isSpeaking && (
          <div className="absolute inset-0 bg-amber-500/10 blur-3xl -z-10 rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );
}

