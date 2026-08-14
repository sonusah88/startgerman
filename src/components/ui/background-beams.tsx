'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center ${className}`}
    >
      <div className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%] z-0">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="w-full h-full opacity-30"
          style={{
            background:
              'conic-gradient(from 0deg at 50% 50%, rgba(245, 158, 11, 0) 0deg, rgba(245, 158, 11, 0.1) 120deg, rgba(245, 158, 11, 0) 140deg, rgba(59, 130, 246, 0.1) 240deg, rgba(59, 130, 246, 0) 260deg)',
          }}
        />
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 w-full h-full opacity-20"
          style={{
            background:
              'conic-gradient(from 180deg at 50% 50%, rgba(16, 185, 129, 0) 0deg, rgba(16, 185, 129, 0.1) 120deg, rgba(16, 185, 129, 0) 140deg, rgba(245, 158, 11, 0.1) 240deg, rgba(245, 158, 11, 0) 260deg)',
          }}
        />
      </div>
      {/* Replaced heavy backdrop-blur-[100px] with a simple CSS mask gradient for 60fps performance */}
      <div className="absolute inset-0 z-10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] bg-background/90" />
    </div>
  );
};
