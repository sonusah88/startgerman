import Database from 'better-sqlite3';
const db = new Database('./sqlite.db');

const enhancements = {
  '1. The German Alphabet': {
    summary: 'This lesson employs dual-coding theory by pairing visual alphabet representations with auditory repetition. Recognizing the phonetic foundation of German accelerates reading fluency and reduces cognitive load when encountering new vocabulary.',
    vocab: ['das Alphabet', 'der Vokal', 'der Konsonant', 'der Umlaut', 'die Aussprache'],
    grammar: ['Umlauts (ä, ö, ü) act as distinct letters requiring distinct mouth shapes.', 'The Eszett (ß) is a sharp "s" sound, never used at the beginning of a word.', 'W is pronounced as a "v" sound, and V is pronounced as an "f" sound.'],
    tips: ['Use spaced repetition (SRS) to practice tricky letters like J (yot) and Y (ypsilon).', 'Record yourself saying the alphabet and compare the audio to a native speaker to refine phoneme production.']
  },
  '2. Greetings & Farewells': {
    summary: 'Mastering greetings builds pragmatic competence. This lesson focuses on the socio-linguistic distinction between formal (Sie) and informal (du) registers, which is critical for successful social integration in German-speaking cultures.',
    vocab: ['Grüß Gott', 'Mahlzeit', 'Guten Abend', 'Auf Wiederhören', 'die Begrüßung'],
    grammar: ['The formal "Sie" is always capitalized, distinguishing it from "sie" (she/they).', '"Guten" (masculine accusative) is used because you are implicitly wishing someone a good day ("Ich wünsche dir einen guten Tag").'],
    tips: ['Context-dependent memory: Practice formal greetings while visualizing a professional setting, and informal ones while imagining friends.', 'Pay attention to regional variations (e.g., "Moin" in the North, "Servus" in the South).']
  },
  '3. Numbers 1-100': {
    summary: 'German number structure requires cognitive flexibility due to its "ones-before-tens" inversion (e.g., 21 is "one-and-twenty"). This lesson leverages pattern recognition to help your brain automate this syntactic shift.',
    vocab: ['die Zahl', 'zählen', 'die Null', 'elf', 'zwölf'],
    grammar: ['Numbers 13-19 follow the pattern [digit] + zehn (e.g., vierzehn).', 'Numbers 21-99 follow [ones] + und + [tens] (e.g., dreiundzwanzig).', 'Numbers are written as a single compound word.'],
    tips: ['Chunking strategy: When hearing a number, write down the tens digit when you hear "und" and the ones digit first.', 'Practice doing simple math aloud in German to force rapid number recall without translating.']
  },
  '4. To Be (sein) & To Have (haben)': {
    summary: 'As the most frequent verbs in German, "sein" and "haben" serve as both lexical verbs and auxiliary verbs. Automating their conjugation is the highest-leverage activity for A1 learners, forming the basis of all past tense construction.',
    vocab: ['sein', 'haben', 'die Person', 'das Verb', 'die Konjugation'],
    grammar: ['"sein" is highly irregular: ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind.', '"haben" is partially irregular: ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben.', '"sein" takes the nominative case, while "haben" takes the accusative case.'],
    tips: ['Create a visual conjugation matrix. Your brain retrieves spatial information faster than linear lists.', 'Use the "First-Person Anchor" technique: always learn the "ich" and "er/sie/es" forms first, as they are the most common in daily speech.']
  },
  '5. Nouns & Der, Die, Das': {
    summary: 'German grammatical gender (Genus) is largely arbitrary and rarely matches biological gender. This lesson introduces noun-article pairing, a vital habit formation technique that prevents compounding syntactic errors later in the learning journey.',
    vocab: ['das Geschlecht', 'der Artikel', 'das Substantiv', 'maskulin', 'feminin', 'neutral'],
    grammar: ['Every noun has a gender: masculine (der), feminine (die), or neuter (das).', 'Plural nouns always take the article "die" in the nominative case, regardless of their singular gender.', 'All nouns are capitalized.'],
    tips: ['The Mnemonic Imagery method: Assign a color to each gender (e.g., blue for der, red for die, green for das) and visualize the object in that color.', 'Look for morphological patterns: words ending in -ung, -keit, -schaft are always feminine.']
  },
  '6. The Accusative Case': {
    summary: 'The accusative case introduces syntactic case-marking. By understanding how the direct object alters the masculine article (der -> den), learners shift from relying on word order for meaning to relying on grammatical markers.',
    vocab: ['der Kasus', 'der Akkusativ', 'das Objekt', 'brauchen', 'kaufen'],
    grammar: ['The accusative case marks the direct receiver of an action.', 'Only the masculine article changes: der -> den, ein -> einen.', 'Feminine (die), Neuter (das), and Plural (die) articles remain completely unchanged from the nominative.'],
    tips: ['Action-Receiver Mapping: Physically point to yourself (the subject) and then to the object you are acting upon to reinforce the directional flow of the accusative case.', 'Memorize common accusative prepositions (für, ohne, gegen, durch) as a single chunk.']
  }
};

const lessons = db.prepare(`SELECT * FROM lessons WHERE type = 'video'`).all();
for (const lesson of lessons) {
  const enhance = enhancements[lesson.title];
  if (enhance) {
    const content = JSON.parse(lesson.content);
    content.summary = enhance.summary;
    content.vocab = enhance.vocab;
    content.grammar = enhance.grammar;
    content.tips = enhance.tips;
    db.prepare(`UPDATE lessons SET content = ? WHERE id = ?`).run(JSON.stringify(content), lesson.id);
    console.log(`Updated ${lesson.title}`);
  }
}
