'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Globe, BookOpen, Clock, Mic, GraduationCap, Sparkles } from 'lucide-react';

const STEPS = [
  {
    id: 'level', question: 'What is your German level?', icon: Globe,
    options: [
      { label: 'Absolute beginner', value: 'A1.1', desc: 'I know no German at all' },
      { label: 'A1', value: 'A1.2', desc: 'I know some basics' },
      { label: 'A1+', value: 'A2.1', desc: 'I can introduce myself and handle simple tasks' },
      { label: 'A2', value: 'A2.2', desc: 'I can communicate in routine situations' },
    ]
  },
  {
    id: 'goal', question: 'Why are you learning German?', icon: GraduationCap,
    options: [
      { label: 'Work', value: 'work', desc: 'For my career in Germany' },
      { label: 'University', value: 'university', desc: 'To study in Germany' },
      { label: 'Living in Germany', value: 'germany', desc: 'I moved or plan to move' },
      { label: 'Goethe Exam', value: 'goethe', desc: 'To pass A1 or A2 certification' },
      { label: 'Travel', value: 'travel', desc: 'For vacations and trips' },
      { label: 'Personal interest', value: 'interest', desc: 'I love the language and culture' },
    ]
  },
  {
    id: 'time', question: 'How much time can you study daily?', icon: Clock,
    options: [
      { label: '15 minutes', value: '15', desc: 'Short focused sessions' },
      { label: '30 minutes', value: '30', desc: 'Balanced daily practice' },
      { label: '45 minutes', value: '45', desc: 'Intensive study sessions' },
      { label: '60+ minutes', value: '60', desc: 'Deep immersive learning' },
    ]
  },
  {
    id: 'tutor', question: 'Would you like an AI German tutor?', icon: Mic,
    options: [
      { label: 'Yes, definitely!', value: 'yes', desc: 'I want to practice speaking with AI' },
      { label: 'Maybe later', value: 'later', desc: "I'll start with written exercises first" },
    ]
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = async (value: string) => {
    const step = STEPS[currentStep];
    const newAnswers = { ...answers, [step.id]: value };
    setAnswers(newAnswers);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Save onboarding preferences
      try {
        await fetch('/api/auth/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAnswers),
        });
      } catch (e) { /* continue regardless */ }
      router.push('/dashboard');
    }
  };

  const step = STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/[0.04] rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-10">
          {STEPS.map((_, idx) => (
            <motion.div
              key={idx}
              animate={{ width: idx <= currentStep ? 32 : 8 }}
              className={`h-2 rounded-full transition-colors duration-300 ${
                idx <= currentStep ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center">
                <StepIcon className="w-8 h-8 text-amber-400" />
              </div>
            </div>

            {/* Question */}
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{step.question}</h2>

            {/* Options */}
            <div className="grid gap-3">
              {step.options.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(option.value)}
                  className="glass-card rounded-2xl p-5 text-left border border-white/5 hover:border-amber-500/30 hover:bg-amber-500/[0.03] transition-all duration-300 group w-full"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg group-hover:text-amber-400 transition-colors">{option.label}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{option.desc}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step counter */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Step {currentStep + 1} of {STEPS.length}
        </p>
      </div>
    </div>
  );
}
