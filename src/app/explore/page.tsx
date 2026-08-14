'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Brain, Home, Map, BookA, Bot, User, Volume2, Sparkles } from 'lucide-react';
import { searchContent } from '@/actions/explore';
import { useDebounce } from '@/hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/roadmap', label: 'Roadmap', icon: Map },
  { href: '/explore', label: 'Explore', icon: Search, active: true },
  { href: '/tutor', label: 'AI Tutor', icon: Bot },
];

const SUGGESTED = ['gehen', 'Akkusativ', 'der/die/das', 'Perfekt', 'Restaurant', 'Zahlen'];

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<{ vocabulary: any[], grammar: any[] }>({ vocabulary: [], grammar: [] });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function performSearch() {
      if (debouncedQuery.trim() === '') { setResults({ vocabulary: [], grammar: [] }); return; }
      setIsSearching(true);
      const data = await searchContent(debouncedQuery);
      setResults(data);
      setIsSearching(false);
    }
    performSearch();
  }, [debouncedQuery]);

  const genderColor = (article?: string) => {
    if (article === 'der') return 'text-blue-400 bg-blue-500/10';
    if (article === 'die') return 'text-rose-400 bg-rose-500/10';
    if (article === 'das') return 'text-emerald-400 bg-emerald-500/10';
    return 'text-muted-foreground bg-white/5';
  };

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

      <main className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-gold">Search</span> & Explore
          </h1>
          <p className="text-muted-foreground mb-6">Search the entire A1–A2 curriculum for words, grammar, or topics.</p>
        </motion.div>

        {/* Search Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search for 'gehen', 'Akkusativ', 'apple'..."
            className="pl-12 h-14 text-lg rounded-2xl bg-secondary/50 border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all"
            value={query} onChange={(e) => setQuery(e.target.value)}
          />
          {isSearching && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />}
        </motion.div>

        {/* Suggested Searches */}
        {!query && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-2">
            {SUGGESTED.map(s => (
              <button key={s} onClick={() => setQuery(s)} className="px-3 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                {s}
              </button>
            ))}
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence mode="wait">
          {debouncedQuery && !isSearching && results.vocabulary.length === 0 && results.grammar.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
              <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold">No results found</h3>
              <p className="text-muted-foreground mt-2">Try a different term.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-8">
          {results.vocabulary.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-blue-400" /> Vocabulary
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {results.vocabulary.map((vocab: any, idx: number) => (
                  <motion.div key={vocab.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    className="glass-card rounded-2xl p-5 group hover:border-white/15 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-baseline gap-2">
                        {vocab.article && <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${genderColor(vocab.article)}`}>{vocab.article}</span>}
                        <h3 className="text-lg font-bold">{vocab.germanWord}</h3>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded bg-white/5">{vocab.cefrLevel}</span>
                    </div>
                    <p className="text-amber-400 font-medium text-sm">{vocab.englishMeaning}</p>
                    {vocab.partOfSpeech && <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">{vocab.partOfSpeech}</p>}
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {results.grammar.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-purple-400" /> Grammar Rules
              </h2>
              <div className="space-y-4">
                {results.grammar.map((grammar: any, idx: number) => (
                  <motion.div key={grammar.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    className="glass-card rounded-2xl p-6 hover:border-white/15 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg">{grammar.title}</h3>
                      <span className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded bg-white/5">{grammar.cefrLevel}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{grammar.explanation}</p>
                    {grammar.pattern && (
                      <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                        <code className="text-sm text-amber-400 font-mono">{grammar.pattern}</code>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 glass z-50 px-2 py-3">
        <div className="flex justify-around">
          {[{ href: '/dashboard', icon: Home, label: 'Home' }, { href: '/roadmap', icon: Map, label: 'Learn' }, { href: '/explore', icon: Search, label: 'Explore', active: true }, { href: '/tutor', icon: Bot, label: 'Tutor' }, { href: '/profile', icon: User, label: 'Profile' }].map((item) => (
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
