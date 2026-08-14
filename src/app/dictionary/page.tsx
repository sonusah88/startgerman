'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Check, Loader2, BookA, Home, Map, Bot, User, Sparkles, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { searchVocabulary, addWordToStudyPlan, ApiVocabWord } from '@/actions/dictionary';
import { PronounceButton } from '@/components/PronounceButton';

export default function DictionaryPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ApiVocabWord[]>([]);
  const [deepResults, setDeepResults] = useState<any[]>([]);
  const [addedWords, setAddedWords] = useState<Record<string, boolean>>({});
  const [hasSearched, setHasSearched] = useState(false);
  const [isDeepSearching, setIsDeepSearching] = useState(false);
  const [exampleSentences, setExampleSentences] = useState<any[]>([]);
  const [isLoadingExamples, setIsLoadingExamples] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    setDeepResults([]);
    setExampleSentences([]);
    const data = await searchVocabulary(query);
    setResults(data);
    setIsSearching(false);

    // Also fetch example sentences from Tatoeba in parallel
    fetchExamples(query);
  };

  const fetchExamples = async (word: string) => {
    setIsLoadingExamples(true);
    try {
      const res = await fetch(`/api/examples?word=${encodeURIComponent(word)}`);
      if (res.ok) {
        const data = await res.json();
        setExampleSentences(data);
      }
    } catch (e) {
      console.error('Examples fetch error:', e);
    }
    setIsLoadingExamples(false);
  };

  const handleDeepSearch = async () => {
    if (!query.trim()) return;
    setIsDeepSearching(true);
    try {
      const res = await fetch(`/api/dictionary?word=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setDeepResults(data);
      }
    } catch (e) {
      console.error(e);
    }
    setIsDeepSearching(false);
  };

  const handleAdd = async (word: ApiVocabWord) => {
    try {
      const res = await addWordToStudyPlan(word);
      if (res?.success) setAddedWords(prev => ({ ...prev, [word.german]: true }));
    } catch (error) { console.error('Failed:', error); }
  };

  const genderColor = (g?: string) => {
    if (g === 'der') return 'text-blue-400 bg-blue-500/10';
    if (g === 'die') return 'text-rose-400 bg-rose-500/10';
    if (g === 'das') return 'text-emerald-400 bg-emerald-500/10';
    return 'text-muted-foreground bg-white/5';
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 md:pl-72">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 fixed left-0 top-0 bottom-0 glass p-6 z-40">
        <Link href="/dashboard" className="flex items-center gap-3 mb-10 hover:opacity-80 transition-opacity">
          <img src="/logo.jpg" alt="StartGerman Logo" className="h-10 w-10 rounded-full shadow-lg shadow-amber-500/20 object-cover" />
          <span className="font-bold text-xl tracking-tight">StartGerman</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {[
            { href: '/dashboard', label: 'Dashboard', icon: Home },
            { href: '/roadmap', label: 'Roadmap', icon: Map },
            { href: '/dictionary', label: 'Dictionary', icon: BookA, active: true },
            { href: '/tutor', label: 'AI Tutor', icon: Bot },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active ? 'bg-amber-500/10 text-amber-400' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="p-6 md:p-10 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-gold">Dictionary</span> Explorer
          </h1>
          <p className="text-muted-foreground mb-8">Search 8,000+ German words · Powered by rep12.com</p>
        </motion.div>

        {/* Search */}
        <motion.form
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
          onSubmit={handleSearch}
          className="flex gap-3 mb-10 max-w-2xl"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search German or English... (e.g. Haus, house)"
              className="pl-12 h-14 text-lg rounded-2xl bg-secondary/50 border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20 transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit" size="lg" className="h-14 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold hover:shadow-lg hover:shadow-amber-500/25 transition-all border-0" disabled={isSearching}>
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </Button>
        </motion.form>

        {/* Results */}
        {isSearching && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-white/5 rounded w-1/3 mb-3" />
                <div className="h-4 bg-white/5 rounded w-2/3 mb-4" />
                <div className="h-16 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isSearching && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {results.map((word, idx) => (
                <motion.div
                  key={`${word.german}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className="glass-card rounded-2xl overflow-hidden group hover:border-white/15 transition-all duration-300"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {word.gender && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${genderColor(word.gender)}`}>{word.gender}</span>
                          )}
                          <h3 className="text-xl font-bold">{word.german}</h3>
                          <PronounceButton text={word.german} className="h-6 w-6 ml-1" />
                        </div>
                        <p className="text-amber-400 font-medium">{word.english}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-white/10 text-muted-foreground">{word.level || 'A1'}</Badge>
                    </div>

                    {word.example_de && (
                      <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5 mb-4">
                        <p className="text-sm font-medium">{word.example_de}</p>
                        <p className="text-xs text-muted-foreground mt-1">{word.example_en}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{word.pos || '—'}</span>
                      <Button
                        size="sm"
                        className={`rounded-full text-xs transition-all ${
                          addedWords[word.german]
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                        }`}
                        variant="ghost"
                        onClick={() => handleAdd(word)}
                        disabled={addedWords[word.german]}
                      >
                        {addedWords[word.german] ? <><Check className="w-3 h-3 mr-1" /> Added</> : <><Plus className="w-3 h-3 mr-1" /> Add to Plan</>}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!isSearching && hasSearched && results.length === 0 && deepResults.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold">No results found in basic search</h3>
            <p className="text-muted-foreground mt-2 mb-6">Would you like to perform a deep dictionary lookup (PONS/Wiktionary)?</p>
            <Button 
              onClick={handleDeepSearch}
              disabled={isDeepSearching}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
            >
              {isDeepSearching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BookA className="w-4 h-4 mr-2" />}
              Deep Lookup
            </Button>
          </motion.div>
        )}

        {/* Deep Search Results */}
        {deepResults.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <BookA className="mr-3 text-indigo-400" /> Advanced Dictionary Results
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {deepResults.map((entry, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-6 border border-indigo-500/20">
                  <div className="flex items-center gap-4 mb-4">
                    <h4 className="text-2xl font-bold">{entry.word}</h4>
                    <PronounceButton text={entry.word} className="h-8 w-8 ml-1" />
                    {entry.phonetics && <span className="text-indigo-400 font-mono bg-indigo-500/10 px-2 py-1 rounded">{entry.phonetics}</span>}
                    <Badge variant="outline">{entry.partOfSpeech}</Badge>
                    <Badge className="ml-auto bg-white/10">{entry.source}</Badge>
                  </div>
                  <ul className="space-y-3">
                    {entry.meanings.map((meaning: any, i: number) => (
                      <li key={i} className="bg-white/5 p-4 rounded-xl">
                        <p className="font-medium text-lg">{meaning.definition}</p>
                        {meaning.example && <p className="text-muted-foreground text-sm mt-2 flex gap-2"><span>&quot;{meaning.example}&quot;</span></p>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tatoeba Example Sentences */}
        {exampleSentences.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <MessageSquareText className="mr-3 text-teal-400" /> Example Sentences <span className="text-xs text-muted-foreground ml-3 bg-white/5 px-2 py-1 rounded">Tatoeba</span>
            </h3>
            <div className="space-y-3">
              {exampleSentences.map((s, idx) => (
                <div key={s.id || idx} className="glass-card rounded-xl p-4 flex items-start gap-4 group hover:border-white/15 transition-all">
                  <PronounceButton text={s.text} className="shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-lg">{s.text}</p>
                    {s.translations?.[0] && (
                      <p className="text-muted-foreground text-sm mt-1">{s.translations[0].text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {isLoadingExamples && hasSearched && (
          <div className="mt-8 text-center text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading example sentences...
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass z-50 px-2 py-3">
        <div className="flex justify-around">
          {[
            { href: '/dashboard', icon: Home, label: 'Home' },
            { href: '/roadmap', icon: Map, label: 'Learn' },
            { href: '/dictionary', icon: BookA, label: 'Dict', active: true },
            { href: '/tutor', icon: Bot, label: 'Tutor' },
            { href: '/profile', icon: User, label: 'Profile' },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${item.active ? 'text-amber-400' : 'text-muted-foreground'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
