'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Home, Map, BookA, Bot, BookOpen, Volume2, RefreshCw, ChevronRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { PronounceButton } from '@/components/PronounceButton';

const LEVELS = [
  { id: 'A1', label: 'A1 – Beginner', color: 'from-emerald-500 to-teal-500' },
  { id: 'A2', label: 'A2 – Elementary', color: 'from-blue-500 to-indigo-500' },
  { id: 'B1', label: 'B1 – Intermediate', color: 'from-violet-500 to-purple-500' },
];

const TOPICS = [
  'My Family', 'At the Train Station', 'Shopping at the Market',
  'A Day at School', 'Weekend Plans', 'At the Doctor',
  'My Daily Routine', 'A Visit to Berlin', 'Cooking Dinner',
];

// Pre-built passages so the feature works instantly without API calls
const BUILT_IN_PASSAGES: Record<string, { title: string; text: string; translation: string; vocab: { de: string; en: string }[] }[]> = {
  A1: [
    {
      title: 'Meine Familie',
      text: 'Ich heiße Anna. Ich bin 25 Jahre alt. Ich wohne in Berlin. Meine Familie ist groß. Ich habe einen Bruder und eine Schwester. Mein Bruder heißt Tom. Er ist 30 Jahre alt. Meine Schwester heißt Lisa. Sie ist 20 Jahre alt. Meine Mutter arbeitet als Lehrerin. Mein Vater ist Arzt. Wir essen zusammen Abendessen. Ich liebe meine Familie sehr.',
      translation: 'My name is Anna. I am 25 years old. I live in Berlin. My family is big. I have a brother and a sister. My brother is called Tom. He is 30 years old. My sister is called Lisa. She is 20 years old. My mother works as a teacher. My father is a doctor. We eat dinner together. I love my family very much.',
      vocab: [
        { de: 'die Familie', en: 'family' },
        { de: 'der Bruder', en: 'brother' },
        { de: 'die Schwester', en: 'sister' },
        { de: 'die Lehrerin', en: 'teacher (f)' },
        { de: 'der Arzt', en: 'doctor' },
        { de: 'zusammen', en: 'together' },
      ]
    },
    {
      title: 'Mein Tag',
      text: 'Ich stehe um sieben Uhr auf. Ich frühstücke Brot mit Butter und Marmelade. Dann gehe ich zur Arbeit. Ich fahre mit dem Bus. Die Arbeit beginnt um neun Uhr. Um zwölf Uhr esse ich Mittagessen. Am Abend koche ich Pasta. Danach sehe ich einen Film. Um zehn Uhr gehe ich ins Bett.',
      translation: 'I get up at seven o\'clock. I eat bread with butter and jam for breakfast. Then I go to work. I take the bus. Work starts at nine o\'clock. At twelve o\'clock I eat lunch. In the evening I cook pasta. After that I watch a movie. At ten o\'clock I go to bed.',
      vocab: [
        { de: 'aufstehen', en: 'to get up' },
        { de: 'frühstücken', en: 'to have breakfast' },
        { de: 'die Arbeit', en: 'work' },
        { de: 'der Bus', en: 'bus' },
        { de: 'kochen', en: 'to cook' },
        { de: 'das Bett', en: 'bed' },
      ]
    },
    {
      title: 'Im Supermarkt',
      text: 'Heute gehe ich in den Supermarkt. Ich brauche Milch, Brot und Käse. Die Milch kostet einen Euro fünfzig. Das Brot kostet zwei Euro. Der Käse ist teuer – er kostet vier Euro. Ich nehme auch Äpfel und Bananen. An der Kasse bezahle ich mit Karte. Die Verkäuferin sagt: "Danke, auf Wiedersehen!"',
      translation: 'Today I go to the supermarket. I need milk, bread and cheese. The milk costs one euro fifty. The bread costs two euros. The cheese is expensive – it costs four euros. I also take apples and bananas. At the checkout I pay with a card. The saleswoman says: "Thank you, goodbye!"',
      vocab: [
        { de: 'der Supermarkt', en: 'supermarket' },
        { de: 'die Milch', en: 'milk' },
        { de: 'das Brot', en: 'bread' },
        { de: 'der Käse', en: 'cheese' },
        { de: 'teuer', en: 'expensive' },
        { de: 'bezahlen', en: 'to pay' },
      ]
    },
    {
      title: 'Ich stelle mich vor',
      text: 'Hallo! Mein Name ist Carlos. Ich komme aus Spanien, aber ich wohne jetzt in Berlin. Ich bin 28 Jahre alt. Ich bin Ingenieur von Beruf. Ich spreche Spanisch, Englisch und ein bisschen Deutsch. Ich lerne Deutsch seit drei Monaten. Ich bin verheiratet. Meine Frau heißt Elena. Wir haben eine Tochter. Sie heißt Sofia und ist zwei Jahre alt. Meine Telefonnummer ist 030 456 789. Meine E-Mail ist carlos@email.de.',
      translation: 'Hello! My name is Carlos. I come from Spain, but I live in Berlin now. I am 28 years old. I am an engineer by profession. I speak Spanish, English and a little German. I have been learning German for three months. I am married. My wife is called Elena. We have a daughter. Her name is Sofia and she is two years old. My phone number is 030 456 789. My email is carlos@email.de.',
      vocab: [
        { de: 'der Name', en: 'name' },
        { de: 'der Beruf', en: 'profession' },
        { de: 'verheiratet', en: 'married' },
        { de: 'die Tochter', en: 'daughter' },
        { de: 'die Telefonnummer', en: 'phone number' },
        { de: 'ein bisschen', en: 'a little' },
      ]
    },
    {
      title: 'Meine Wohnung',
      text: 'Ich wohne in einer Wohnung im dritten Stock. Die Wohnung hat drei Zimmer: ein Wohnzimmer, ein Schlafzimmer und ein Kinderzimmer. Die Küche ist klein, aber sie hat einen großen Kühlschrank. Das Bad hat eine Dusche und eine Badewanne. Im Wohnzimmer stehen ein Sofa und ein Fernseher. Wir haben auch einen Balkon. Von dort kann man den Park sehen. Die Miete kostet 850 Euro im Monat.',
      translation: 'I live in an apartment on the third floor. The apartment has three rooms: a living room, a bedroom and a children\'s room. The kitchen is small, but it has a large fridge. The bathroom has a shower and a bathtub. In the living room there is a sofa and a television. We also have a balcony. From there you can see the park. The rent costs 850 euros per month.',
      vocab: [
        { de: 'die Wohnung', en: 'apartment' },
        { de: 'der Stock', en: 'floor (storey)' },
        { de: 'das Wohnzimmer', en: 'living room' },
        { de: 'der Balkon', en: 'balcony' },
        { de: 'die Miete', en: 'rent' },
        { de: 'der Kühlschrank', en: 'fridge' },
      ]
    },
    {
      title: 'Meine Hobbys',
      text: 'In meiner Freizeit mache ich gern Sport. Am Montag und Mittwoch spiele ich Fußball im Park. Am Wochenende fahre ich oft Fahrrad. Im Sommer gehe ich gern schwimmen. Meine Frau liest gern Bücher und hört Musik. Am Samstag kochen wir zusammen. Wir laden manchmal Freunde ein. Dann spielen wir Karten oder sehen einen Film. Im Winter gehen wir gern ins Kino oder ins Museum.',
      translation: 'In my free time I like doing sport. On Monday and Wednesday I play football in the park. At the weekend I often ride a bicycle. In summer I like to go swimming. My wife likes reading books and listening to music. On Saturday we cook together. We sometimes invite friends over. Then we play cards or watch a movie. In winter we like going to the cinema or the museum.',
      vocab: [
        { de: 'die Freizeit', en: 'free time' },
        { de: 'Fußball spielen', en: 'to play football' },
        { de: 'Fahrrad fahren', en: 'to ride a bicycle' },
        { de: 'schwimmen', en: 'to swim' },
        { de: 'einladen', en: 'to invite' },
        { de: 'zusammen', en: 'together' },
      ]
    },
    {
      title: 'Beim Arzt',
      text: 'Heute bin ich zum Arzt gegangen. Ich habe seit drei Tagen Kopfschmerzen und Halsschmerzen. Ich habe auch Schnupfen und Husten. Der Arzt hat gefragt: "Haben Sie auch Fieber?" Ich habe gesagt: "Ja, 38 Grad." Der Arzt hat gesagt: "Sie haben eine Erkältung. Sie müssen im Bett bleiben und viel Wasser trinken. Hier ist ein Rezept für Medikamente. Gehen Sie zur Apotheke." Ich habe "Danke" gesagt und bin nach Hause gegangen.',
      translation: 'Today I went to the doctor. I have had a headache and sore throat for three days. I also have a runny nose and cough. The doctor asked: "Do you also have a fever?" I said: "Yes, 38 degrees." The doctor said: "You have a cold. You must stay in bed and drink lots of water. Here is a prescription for medicine. Go to the pharmacy." I said "Thank you" and went home.',
      vocab: [
        { de: 'Kopfschmerzen', en: 'headache' },
        { de: 'der Husten', en: 'cough' },
        { de: 'das Fieber', en: 'fever' },
        { de: 'das Rezept', en: 'prescription' },
        { de: 'die Apotheke', en: 'pharmacy' },
        { de: 'die Erkältung', en: 'cold (illness)' },
      ]
    },
  ],
  A2: [
    {
      title: 'Ein Wochenende in München',
      text: 'Letztes Wochenende bin ich nach München gefahren. Ich habe den Zug um acht Uhr genommen. Die Fahrt hat drei Stunden gedauert. In München habe ich zuerst das Deutsche Museum besucht. Es war sehr interessant. Danach bin ich im Englischen Garten spazieren gegangen. Am Abend habe ich in einem bayerischen Restaurant gegessen. Ich habe Weißwurst mit Brezel bestellt. Es hat mir sehr gut geschmeckt!',
      translation: 'Last weekend I went to Munich. I took the train at eight o\'clock. The journey took three hours. In Munich I first visited the German Museum. It was very interesting. After that I went for a walk in the English Garden. In the evening I ate in a Bavarian restaurant. I ordered white sausage with pretzel. It tasted very good to me!',
      vocab: [
        { de: 'der Zug', en: 'train' },
        { de: 'die Fahrt', en: 'journey' },
        { de: 'besuchen', en: 'to visit' },
        { de: 'spazieren gehen', en: 'to go for a walk' },
        { de: 'bestellen', en: 'to order' },
        { de: 'schmecken', en: 'to taste' },
      ]
    },
  ],
  B1: [
    {
      title: 'Umweltschutz im Alltag',
      text: 'Umweltschutz wird in Deutschland sehr ernst genommen. Die meisten Deutschen trennen ihren Müll sorgfältig in verschiedene Tonnen: Papier, Plastik, Biomüll und Restmüll. Außerdem bringen viele Leute ihre Pfandflaschen zurück in den Supermarkt, um das Pfandgeld zurückzubekommen. Viele fahren mit dem Fahrrad zur Arbeit oder benutzen öffentliche Verkehrsmittel, anstatt das Auto zu nehmen. Einige Familien haben Solarpanels auf dem Dach installiert, um Energie zu sparen.',
      translation: 'Environmental protection is taken very seriously in Germany. Most Germans carefully separate their waste into different bins: paper, plastic, organic waste and residual waste. In addition, many people return their deposit bottles to the supermarket to get the deposit money back. Many cycle to work or use public transport instead of taking the car. Some families have installed solar panels on the roof to save energy.',
      vocab: [
        { de: 'der Umweltschutz', en: 'environmental protection' },
        { de: 'der Müll', en: 'waste/garbage' },
        { de: 'trennen', en: 'to separate' },
        { de: 'die Pfandflasche', en: 'deposit bottle' },
        { de: 'öffentliche Verkehrsmittel', en: 'public transport' },
        { de: 'Energie sparen', en: 'to save energy' },
      ]
    },
  ],
};

export default function ReadingPage() {
  const [level, setLevel] = useState('A1');
  const [currentPassage, setCurrentPassage] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translatedWord, setTranslatedWord] = useState<{ word: string; translation: string } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const passages = BUILT_IN_PASSAGES[level] || [];
  const passage = passages[currentPassage];

  const handleWordClick = async (word: string) => {
    const clean = word.replace(/[^a-zA-ZäöüßÄÖÜ]/g, '');
    if (!clean || clean.length < 2) return;

    setIsTranslating(true);
    setTranslatedWord({ word: clean, translation: '...' });

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean, targetLang: 'EN' }),
      });
      if (res.ok) {
        const data = await res.json();
        setTranslatedWord({ word: clean, translation: data.translation });
      }
    } catch (e) {
      setTranslatedWord({ word: clean, translation: 'Translation unavailable' });
    }
    setIsTranslating(false);
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
            { href: '/reading', label: 'Reading', icon: BookOpen, active: true },
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

      <main className="p-6 md:p-10 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-gold">Reading</span> Practice
          </h1>
          <p className="text-muted-foreground mb-8">Click any word to translate it instantly. Practice reading real German texts at your level.</p>
        </motion.div>

        {/* Level Selector */}
        <div className="flex gap-3 mb-8">
          {LEVELS.map(l => (
            <Button
              key={l.id}
              variant={level === l.id ? 'default' : 'outline'}
              className={`rounded-full ${level === l.id ? `bg-gradient-to-r ${l.color} text-white border-0` : 'border-white/10'}`}
              onClick={() => { setLevel(l.id); setCurrentPassage(0); setShowTranslation(false); setTranslatedWord(null); }}
            >
              {l.label}
            </Button>
          ))}
        </div>

        {passage && (
          <motion.div key={`${level}-${currentPassage}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Reading Card */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/10 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div>
                  <h2 className="text-xl font-bold">{passage.title}</h2>
                  <p className="text-xs text-muted-foreground">Level {level} · Click any word to translate</p>
                </div>
                <PronounceButton text={passage.text} className="h-10 w-10" />
              </div>
              <div className="p-6">
                <p className="text-lg md:text-xl leading-relaxed tracking-wide">
                  {passage.text.split(/(\s+)/).map((word, i) => {
                    const isSpace = /^\s+$/.test(word);
                    if (isSpace) return <span key={i}>{word}</span>;
                    return (
                      <span
                        key={i}
                        onClick={() => handleWordClick(word)}
                        className="cursor-pointer hover:bg-amber-500/20 hover:text-amber-400 px-0.5 py-0.5 rounded transition-all duration-150 inline-block"
                      >
                        {word}
                      </span>
                    );
                  })}
                </p>
              </div>
            </div>

            {/* Word Translation Popup */}
            <AnimatePresence>
              {translatedWord && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <PronounceButton text={translatedWord.word} />
                    <div>
                      <p className="font-bold text-lg">{translatedWord.word}</p>
                      <p className="text-amber-400">
                        {isTranslating ? <Loader2 className="w-4 h-4 animate-spin inline" /> : translatedWord.translation}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setTranslatedWord(null)}>✕</Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Full Translation Toggle */}
            <Button variant="outline" className="rounded-full border-white/10" onClick={() => setShowTranslation(!showTranslation)}>
              <Globe className="w-4 h-4 mr-2" />
              {showTranslation ? 'Hide' : 'Show'} Full Translation
            </Button>

            <AnimatePresence>
              {showTranslation && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-card rounded-2xl p-6 border-l-4 border-l-blue-500">
                  <p className="text-muted-foreground leading-relaxed">{passage.translation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Key Vocabulary */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold">📚 Key Vocabulary</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {passage.vocab.map((v, i) => (
                  <div key={i} className="glass-card rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold">{v.de}</p>
                      <p className="text-sm text-muted-foreground">{v.en}</p>
                    </div>
                    <PronounceButton text={v.de} className="h-7 w-7" />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-muted-foreground">{currentPassage + 1} / {passages.length} passages</p>
              <Button
                disabled={currentPassage >= passages.length - 1}
                onClick={() => { setCurrentPassage(p => p + 1); setShowTranslation(false); setTranslatedWord(null); }}
                className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0"
              >
                Next Passage <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
