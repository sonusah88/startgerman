'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

export const SparklesCore = ({
  id,
  background,
  minSize,
  maxSize,
  particleDensity,
  className,
  particleColor,
}: {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
}) => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const p = [];
      const density = particleDensity || 50;
      for (let i = 0; i < density; i++) {
        p.push({
          id: i,
          x: random(0, 100),
          y: random(0, 100),
          size: random(minSize || 1, maxSize || 3),
          delay: random(0, 20) / 10,
          duration: random(10, 30) / 10,
        });
      }
      setParticles(p);
    };
    generateParticles();
  }, [maxSize, minSize, particleDensity]);

  return (
    <div
      className={className}
      style={{
        background: background || 'transparent',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            opacity: 0,
            scale: 0,
            x: `${particle.x}%`,
            y: `${particle.y}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            backgroundColor: particleColor || '#FFF',
          }}
        />
      ))}
    </div>
  );
};
