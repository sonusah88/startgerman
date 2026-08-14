'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Loader2, Home, Map, BookA, Bot, BookOpen, Volume2, Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { PronounceButton } from '@/components/PronounceButton';

const POPULAR_VERBS = [
  { verb: 'sein', meaning: 'to be' },
  { verb: 'haben', meaning: 'to have' },
  { verb: 'werden', meaning: 'to become' },
  { verb: 'können', meaning: 'can / to be able' },
  { verb: 'müssen', meaning: 'must / to have to' },
  { verb: 'gehen', meaning: 'to go' },
  { verb: 'kommen', meaning: 'to come' },
  { verb: 'machen', meaning: 'to make/do' },
  { verb: 'sprechen', meaning: 'to speak' },
  { verb: 'essen', meaning: 'to eat' },
  { verb: 'trinken', meaning: 'to drink' },
  { verb: 'lesen', meaning: 'to read' },
  { verb: 'schreiben', meaning: 'to write' },
  { verb: 'fahren', meaning: 'to drive/go' },
  { verb: 'schlafen', meaning: 'to sleep' },
  { verb: 'sehen', meaning: 'to see' },
  { verb: 'wissen', meaning: 'to know (fact)' },
  { verb: 'wollen', meaning: 'to want' },
  { verb: 'mögen', meaning: 'to like' },
  { verb: 'dürfen', meaning: 'may / to be allowed' },
  { verb: 'sollen', meaning: 'should / to be supposed to' },
];

const TENSE_LABELS: Record<string, { label: string; color: string; desc: string }> = {
  present: { label: 'Präsens', color: 'from-emerald-500 to-teal-500', desc: 'Present Tense' },
  preterite: { label: 'Präteritum', color: 'from-blue-500 to-indigo-500', desc: 'Simple Past' },
  perfect: { label: 'Perfekt', color: 'from-violet-500 to-purple-500', desc: 'Present Perfect' },
  imperative: { label: 'Imperativ', color: 'from-amber-500 to-orange-500', desc: 'Commands' },
};

export default function ConjugationPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const lookupVerb = async (verb: string) => {
    setLoading(true);
    setError('');
    setResult(null);
    setQuery(verb);

    try {
      const res = await fetch(`/api/conjugation?verb=${encodeURIComponent(verb)}`);
      if (!res.ok) {
        setError('Verb not found. Try another verb ending in -en (e.g. "machen")');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError('Failed to look up verb');
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) lookupVerb(query.trim());
  };

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
            { href: '/roadmap', label: 'Roadmap', icon: Map },
            { href: '/conjugation', label: 'Conjugation', icon: Pen, active: true },
            { href: '/dictionary', label: 'Dictionary', icon: BookA },
            { href: '/tutor', label: 'AI Tutor', icon: Bot },
          ].map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-amber-500/10 text-amber-400' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
              <item.icon className="w-5 h-5" /> {item.label}
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="p-6 md:p-10 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-gold">Verb</span> Conjugation
          </h1>
          <p className="text-muted-foreground mb-8">Master every German tense. Look up any verb to see all its conjugated forms.</p>
        </motion.div>

        {/* Search Bar */}
        <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-3 mb-8 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Enter a German verb (e.g. sprechen, fahren)..."
              className="pl-12 h-14 text-lg rounded-2xl bg-secondary/50 border-white/10 focus:border-amber-500/50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit" size="lg" disabled={loading} className="h-14 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Conjugate'}
          </Button>
        </motion.form>

        {error && <div className="p-4 mb-8 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">{error}</div>}

        {/* Conjugation Result */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 mb-12">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold">{result.verb}</h2>
              <PronounceButton text={result.verb} />
            </div>

            {Object.entries(result.conjugation).map(([tense, forms]: [string, any]) => {
              const meta = TENSE_LABELS[tense];
              if (!meta) return null;

              if (tense === 'perfect') {
                return (
                  <div key={tense} className="glass-card rounded-2xl overflow-hidden">
                    <div className={`bg-gradient-to-r ${meta.color} px-6 py-4 flex items-center justify-between`}>
                      <div>
                        <h3 className="text-lg font-bold text-white">{meta.label}</h3>
                        <p className="text-white/70 text-xs">{meta.desc}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-lg">
                        <span className="text-muted-foreground">Auxiliary: </span>
                        <span className="font-bold text-amber-400">{forms.auxiliary}</span>
                        <span className="text-muted-foreground ml-4">Past Participle: </span>
                        <span className="font-bold text-emerald-400">{forms.participle}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-3">
                        Example: Ich <span className="text-amber-400 font-medium">{forms.auxiliary === 'sein' ? 'bin' : 'habe'}</span> ... <span className="text-emerald-400 font-medium">{forms.participle}</span>
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={tense} className="glass-card rounded-2xl overflow-hidden">
                  <div className={`bg-gradient-to-r ${meta.color} px-6 py-4`}>
                    <h3 className="text-lg font-bold text-white">{meta.label}</h3>
                    <p className="text-white/70 text-xs">{meta.desc}</p>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(forms).map(([pronoun, form]: [string, any]) => (
                        <div key={pronoun} className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3 border border-white/5">
                          <div>
                            <span className="text-sm text-muted-foreground">{pronoun}</span>
                            <p className="text-lg font-bold">{form}</p>
                          </div>
                          <PronounceButton text={`${pronoun} ${form}`} className="h-7 w-7" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Popular Verbs Grid */}
        {!result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-bold mb-4">Most Important A1 Verbs</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {POPULAR_VERBS.map((v, i) => (
                <motion.button
                  key={v.verb}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -3 }}
                  onClick={() => lookupVerb(v.verb)}
                  className="glass-card rounded-2xl p-4 text-left group hover:border-white/15 transition-all"
                >
                  <h3 className="font-bold text-lg group-hover:text-amber-400 transition-colors">{v.verb}</h3>
                  <p className="text-sm text-muted-foreground">{v.meaning}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
