'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Coffee, Train, ShoppingBag, Utensils, Play, Home, Map, BookA, Bot, User, Building, Stethoscope, Briefcase, Phone, Plane, ShoppingCart, MapPin, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const SCENARIOS = [
  { id: 'bakery', title: 'At the Bakery', icon: Coffee, difficulty: 'A1.1', desc: 'Order a coffee and a pastry at a German café.', color: 'from-amber-500 to-orange-500' },
  { id: 'train', title: 'Train Station', icon: Train, difficulty: 'A1.1', desc: 'Buy a ticket and find your platform.', color: 'from-blue-500 to-indigo-500' },
  { id: 'restaurant', title: 'Restaurant', icon: Utensils, difficulty: 'A1.2', desc: 'Order a meal and ask for the bill.', color: 'from-emerald-500 to-teal-500' },
  { id: 'supermarket', title: 'Supermarket', icon: ShoppingCart, difficulty: 'A1.2', desc: 'Find products and check out.', color: 'from-rose-500 to-pink-500' },
  { id: 'doctor', title: 'At the Doctor', icon: Stethoscope, difficulty: 'A1.1', desc: 'Describe symptoms and understand advice.', color: 'from-red-500 to-rose-500' },
  { id: 'buergeramt', title: 'Registration Office', icon: Building, difficulty: 'A1.2', desc: 'Register your address at the Bürgeramt.', color: 'from-slate-500 to-gray-500' },
  { id: 'apartment', title: 'Apartment Viewing', icon: Building, difficulty: 'A2.1', desc: 'Ask about rent, rooms, and facilities.', color: 'from-violet-500 to-purple-500' },
  { id: 'directions', title: 'Asking Directions', icon: MapPin, difficulty: 'A1.2', desc: 'Ask how to get to the post office.', color: 'from-cyan-500 to-blue-500' },
  { id: 'phone', title: 'Phone Call', icon: Phone, difficulty: 'A2.1', desc: 'Make an appointment by phone.', color: 'from-green-500 to-emerald-500' },
  { id: 'workplace', title: 'First Day at Work', icon: Briefcase, difficulty: 'A2.1', desc: 'Introduce yourself to colleagues.', color: 'from-orange-500 to-red-500' },
  { id: 'university', title: 'University Office', icon: GraduationCap, difficulty: 'A2.1', desc: 'Enroll in a course and ask questions.', color: 'from-indigo-500 to-violet-500' },
  { id: 'travel', title: 'Booking a Trip', icon: Plane, difficulty: 'A2.2', desc: 'Book a hotel and plan activities.', color: 'from-sky-500 to-cyan-500' },
  { id: 'shopping', title: 'Clothing Store', icon: ShoppingBag, difficulty: 'A1.2', desc: 'Try on clothes and ask about sizes.', color: 'from-pink-500 to-fuchsia-500' },
];

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/roadmap', label: 'Roadmap', icon: Map },
  { href: '/scenarios', label: 'Scenarios', icon: Coffee, active: true },
  { href: '/tutor', label: 'AI Tutor', icon: Bot },
];

export default function ScenariosPage() {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  if (activeScenario) {
    const scenario = SCENARIOS.find(s => s.id === activeScenario)!;
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${scenario.color} flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
            <scenario.icon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3">{scenario.title}</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-3">{scenario.desc}</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-amber-400 mb-10">
            Level: {scenario.difficulty}
          </div>
          <p className="text-sm text-muted-foreground mb-10">The AI Tutor will role-play as the other person. Speak naturally in German!</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="rounded-full px-10 py-6 text-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0 hover:shadow-lg hover:shadow-amber-500/25 transition-all" asChild>
              <Link href={`/tutor?scenario=${scenario.id}`}>
                <Play className="w-5 h-5 mr-2" /> Start Simulation
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 py-6 text-lg border-white/10 hover:bg-white/5" onClick={() => setActiveScenario(null)}>
              Go Back
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
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-amber-500/10 text-amber-400' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
              <item.icon className="w-5 h-5" /> {item.label}
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="p-6 md:p-10 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-gold">Real-World</span> Immersion
          </h1>
          <p className="text-muted-foreground mb-8">Practice German in simulated real-life situations with the AI tutor.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCENARIOS.map((scenario, i) => (
            <motion.button
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ y: -4 }}
              onClick={() => setActiveScenario(scenario.id)}
              className="glass-card rounded-2xl p-5 text-left group hover:border-white/15 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                  <scenario.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground px-2 py-1 rounded-md bg-white/5">{scenario.difficulty}</span>
              </div>
              <h3 className="font-bold text-base mb-1">{scenario.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{scenario.desc}</p>
            </motion.button>
          ))}
        </div>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 glass z-50 px-2 py-3">
        <div className="flex justify-around">
          {[{ href: '/dashboard', icon: Home, label: 'Home' }, { href: '/roadmap', icon: Map, label: 'Learn' }, { href: '/scenarios', icon: Coffee, label: 'Scenarios', active: true }, { href: '/tutor', icon: Bot, label: 'Tutor' }, { href: '/profile', icon: User, label: 'Profile' }].map((item) => (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${item.active ? 'text-amber-400' : 'text-muted-foreground'}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
