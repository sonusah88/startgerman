export const a1VideoModules = [
  { id: 101, title: 'Module 1: The Basics', order: 101, description: 'Alphabet, Pronunciation, and Greetings' },
  { id: 102, title: 'Module 2: Essentials', order: 102, description: 'Numbers, Colors, and Basic Verbs' },
  { id: 103, title: 'Module 3: Nouns & Articles', order: 103, description: 'Gender of Nouns, Definite & Indefinite Articles' },
  { id: 104, title: 'Module 4: The Accusative Case', order: 104, description: 'Direct objects and how they change sentences' },
  { id: 105, title: 'Module 5: Daily Life & Time', order: 105, description: 'Telling time, days of the week, and routine' },
  { id: 106, title: 'Module 6: Food & Shopping', order: 106, description: 'Ordering food, quantities, and prices' },
  { id: 107, title: 'Module 7: Travel & Past Tense', order: 107, description: 'Directions and talking about the past' }
];

const videoIds = [
  'yVNA0W1VfZA', '1SzrcrRIg0I', 'SgUGC32qA5k', '6TcDEYqa0B8', '_aMq8VoeP2w', 
  'Pof7MKokGY8', 'WPinwZ1LVnY', '47QBZUfG4dU', '-IPbH2cqZgE', 'u5Au6eXBFz8'
];

export const a1VideoLessons = [
  { 
    modId: 101, title: '1. The German Alphabet & Pronunciation', order: 1, 
    content: {
      videoId: videoIds[0],
      info: 'Learn the German alphabet and pronunciation rules.',
      vocab: ['das Alphabet', 'der Vokal', 'der Konsonant', 'der Umlaut', 'die Aussprache'],
      summary: 'This lesson employs dual-coding theory by pairing visual alphabet representations with auditory repetition. Recognizing the phonetic foundation of German accelerates reading fluency and reduces cognitive load when encountering new vocabulary.',
      grammar: ['Umlauts (ä, ö, ü) act as distinct letters requiring distinct mouth shapes.', 'The Eszett (ß) is a sharp "s" sound, never used at the beginning of a word.'],
      tips: ['Use spaced repetition (SRS) to practice tricky letters.', 'Record yourself saying the alphabet and compare the audio to a native speaker.']
    }
  },
  { 
    modId: 101, title: '2. Greetings & Farewells', order: 2, 
    content: {
      videoId: videoIds[1],
      info: 'How to say hello and goodbye formally and informally.',
      vocab: ['Hallo', 'Guten Morgen', 'Tschüss', 'Auf Wiedersehen', 'Grüß Gott'],
      summary: 'Mastering greetings builds pragmatic competence. This lesson focuses on the socio-linguistic distinction between formal (Sie) and informal (du) registers.',
      grammar: ['The formal "Sie" is always capitalized, distinguishing it from "sie" (she/they).', '"Guten" (masculine accusative) is used because you are implicitly wishing someone a good day.'],
      tips: ['Context-dependent memory: Practice formal greetings while visualizing a professional setting.', 'Pay attention to regional variations like "Moin".']
    }
  },
  { 
    modId: 101, title: '3. Personal Pronouns (Ich, Du, Er...)', order: 3, 
    content: {
      videoId: videoIds[2],
      info: 'Understanding how to refer to people.',
      vocab: ['ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'Sie'],
      summary: 'Pronouns are the anchors of sentence structure. This lesson utilizes cognitive mapping to help you internalize the grid of German pronouns.',
      grammar: ['There are three ways to say "you": du (informal singular), ihr (informal plural), and Sie (formal singular/plural).'],
      tips: ['Group pronouns by person (1st, 2nd, 3rd) rather than just memorizing a linear list.', 'Associate physical gestures (pointing to yourself, pointing to someone else) while reciting.']
    }
  },
  { 
    modId: 101, title: '4. To Be (sein)', order: 4, 
    content: {
      videoId: videoIds[3],
      info: 'Conjugating the most important verb in German.',
      vocab: ['sein', 'ich bin', 'du bist', 'er ist', 'wir sind'],
      summary: 'As a high-frequency irregular verb, "sein" must be committed to procedural memory. This lesson focuses on rapid retrieval techniques.',
      grammar: ['"sein" takes the nominative case for both subject and predicate (e.g., Ich bin ein Mann).'],
      tips: ['Create a visual conjugation matrix in your mind.', 'Always learn the "ich" and "er/sie/es" forms first.']
    }
  },
  { 
    modId: 101, title: '5. Where are you from?', order: 5, 
    content: {
      videoId: videoIds[4],
      info: 'Asking and answering questions about origin.',
      vocab: ['kommen', 'aus', 'woher', 'das Land', 'die Stadt'],
      summary: 'This lesson introduces prepositional phrases of origin. Using autobiographical memory (connecting language to your actual life) makes this vocabulary highly sticky.',
      grammar: ['The preposition "aus" always triggers the dative case (though hidden for countries without articles).', 'Question word "Woher" means "From where".'],
      tips: ['Practice the phrase "Ich komme aus [Your Country]" until it is fully automatic.', 'Write down 5 countries you want to visit in German.']
    }
  },
  { 
    modId: 102, title: '6. Numbers 1-100', order: 1, 
    content: {
      videoId: videoIds[5],
      info: 'Master counting in German from zero to a hundred.',
      vocab: ['die Zahl', 'zählen', 'elf', 'zwölf', 'hundert'],
      summary: 'German number structure requires cognitive flexibility due to its "ones-before-tens" inversion. This lesson leverages pattern recognition to automate this shift.',
      grammar: ['Numbers 21-99 follow [ones] + und + [tens] (e.g., dreiundzwanzig).'],
      tips: ['Chunking strategy: Write down the tens digit when you hear "und".', 'Practice doing simple math aloud in German.']
    }
  },
  { 
    modId: 102, title: '7. To Have (haben)', order: 2, 
    content: {
      videoId: videoIds[6],
      info: 'Conjugating the verb "haben".',
      vocab: ['haben', 'ich habe', 'du hast', 'er hat'],
      summary: 'Haben is the second core pillar of German. This lesson establishes the neural pathways needed to instantly recall its forms.',
      grammar: ['"haben" almost always takes a direct object in the accusative case (e.g., Ich habe einen Hund).'],
      tips: ['Visualize physically holding an object when practicing "Ich habe...".', 'Note how du and er/sie/es drop the "b" (hast, hat).']
    }
  },
  { 
    modId: 102, title: '8. Age & Birthdays', order: 3, 
    content: {
      videoId: videoIds[7],
      info: 'Talking about age and dates.',
      vocab: ['alt', 'das Alter', 'der Geburtstag', 'das Jahr', 'geboren'],
      summary: 'In German, you "are" an age, you do not "have" an age. This lesson breaks English interference by reinforcing the use of "sein" for age.',
      grammar: ['Use "sein" (Ich bin 25 Jahre alt).', 'Dates use ordinal numbers (am ersten, am zweiten).'],
      tips: ['Calculate the ages of your family members and state them aloud in German to build semantic connections.']
    }
  },
  { 
    modId: 102, title: '9. Colors & Adjectives', order: 4, 
    content: {
      videoId: videoIds[8],
      info: 'Describing objects with colors.',
      vocab: ['die Farbe', 'rot', 'blau', 'gelb', 'grün', 'schwarz'],
      summary: 'Visual processing is heavily involved in learning colors. This lesson uses visual-semantic mapping to link German words directly to color perceptions.',
      grammar: ['Predicate adjectives (The car is red) do not change endings (Das Auto ist rot).'],
      tips: ['Look around your room and name the colors of objects immediately in German.', 'Use flashcards with actual colored blocks, not English translations.']
    }
  },
  { 
    modId: 102, title: '10. Regular Verbs (spielen, machen)', order: 5, 
    content: {
      videoId: videoIds[9],
      info: 'The standard conjugation rules for regular verbs.',
      vocab: ['machen', 'spielen', 'lernen', 'arbeiten', 'wohnen'],
      summary: 'This lesson teaches the algorithmic pattern of regular verb conjugation. Once the brain recognizes the stem-ending pattern (-e, -st, -t, -en, -t, -en), you can conjugate thousands of verbs.',
      grammar: ['Remove the -en to find the stem.', 'Verbs whose stems end in -d or -t add an extra -e- for pronunciation (e.g., er arbeitet).'],
      tips: ['Memorize the ending sequence musically: e, st, t, en, t, en.', 'Practice writing out full conjugation tables for 3 new verbs daily.']
    }
  },
  { 
    modId: 103, title: '11. Nouns & Gender (Der, Die, Das)', order: 1, 
    content: {
      videoId: videoIds[0],
      info: 'Understanding the three grammatical genders.',
      vocab: ['der Mann', 'die Frau', 'das Kind', 'der Tisch', 'die Lampe'],
      summary: 'Grammatical gender is largely arbitrary. This lesson introduces mnemonic tagging, a vital technique to prevent compounding syntactic errors later.',
      grammar: ['Every noun is masculine (der), feminine (die), or neuter (das).', 'All nouns are capitalized.'],
      tips: ['Assign a color to each gender (e.g., blue for der, red for die) and visualize objects in that color.', 'Learn words ending in -ung as always feminine.']
    }
  },
  { 
    modId: 103, title: '12. Indefinite Articles (ein, eine, ein)', order: 2, 
    content: {
      videoId: videoIds[1],
      info: 'Using "a" or "an" in German.',
      vocab: ['ein', 'eine', 'kein', 'keine', 'das Buch'],
      summary: 'This lesson contrasts definite and indefinite articles, teaching the brain to parse specificity markers in German syntax.',
      grammar: ['Masculine: ein, Feminine: eine, Neuter: ein.', 'The negative article "kein/keine" follows the exact same ending pattern.'],
      tips: ['If you know the "ein" word, you automatically know the "kein" word by just adding a K!']
    }
  },
  { 
    modId: 103, title: '13. Plurals in German', order: 3, 
    content: {
      videoId: videoIds[2],
      info: 'How to make nouns plural.',
      vocab: ['der Plural', 'die Autos', 'die Kinder', 'die Frauen', 'die Männer'],
      summary: 'Unlike English (just add -s), German has multiple plural endings. This lesson uses pattern categorization to help group plural types cognitively.',
      grammar: ['All plural nouns take the definite article "die" in the nominative case.', 'Common endings include -e, -er, -n, -en, -s, or an umlaut shift.'],
      tips: ['Always learn the plural form at the exact same time you learn the singular noun.', 'Loan words (like Auto, Hotel) usually just take an -s.']
    }
  },
  { 
    modId: 103, title: '14. Professions & Jobs', order: 4, 
    content: {
      videoId: videoIds[3],
      info: 'Talking about what you do for a living.',
      vocab: ['der Beruf', 'arbeiten als', 'der Lehrer', 'die Ärztin', 'der Student'],
      summary: 'This module utilizes sociolinguistic identity. By learning how to express your own profession, the vocabulary becomes intrinsically motivating.',
      grammar: ['Feminine professions almost always end in "-in" (e.g., Lehrer -> Lehrerin).', 'Do not use "ein/eine" when stating your profession (Ich bin Lehrer, NOT Ich bin ein Lehrer).'],
      tips: ['Focus entirely on learning your own profession and the professions of 3 close friends first.']
    }
  },
  { 
    modId: 103, title: '15. Family Members', order: 5, 
    content: {
      videoId: videoIds[4],
      info: 'Vocabulary for family and relatives.',
      vocab: ['die Familie', 'der Vater', 'die Mutter', 'der Bruder', 'die Schwester'],
      summary: 'Family vocabulary is deeply rooted in emotional memory. Connecting these words to actual faces of your family members ensures rapid long-term retention.',
      grammar: ['Possessive pronouns change based on the gender of the family member (mein Vater vs meine Mutter).'],
      tips: ['Draw a family tree of your actual family, labeling everyone strictly in German.', 'Use photos of your family as flashcards instead of generic clip art.']
    }
  },
  { 
    modId: 104, title: '16. The Accusative Case Introduction', order: 1, 
    content: {
      videoId: videoIds[5],
      info: 'Introduction to direct objects.',
      vocab: ['der Akkusativ', 'das Objekt', 'sehen', 'kaufen', 'brauchen'],
      summary: 'The accusative case introduces syntactic case-marking. You will shift from relying on word order for meaning to relying on grammatical markers.',
      grammar: ['The accusative case marks the direct receiver of an action.', 'Only the masculine article changes: der -> den, ein -> einen.'],
      tips: ['Action-Receiver Mapping: Point to yourself (subject) and then to the object you are acting upon.', 'Remember: Feminine and Neuter NEVER change in the accusative.']
    }
  },
  { 
    modId: 104, title: '17. Accusative Personal Pronouns', order: 2, 
    content: {
      videoId: videoIds[6],
      info: 'Saying "me", "him", "her", "us", etc.',
      vocab: ['mich', 'dich', 'ihn', 'sie', 'es', 'uns', 'euch'],
      summary: 'Just as "I" changes to "me" in English, German pronouns shift. This lesson aligns these shifts logically for faster retrieval during conversation.',
      grammar: ['ich -> mich, du -> dich, er -> ihn.', 'sie (her) and es (it) do not change!'],
      tips: ['Practice the phrase "Ich liebe dich" and swap out the pronouns (Ich liebe ihn, Er liebt mich).']
    }
  },
  { 
    modId: 104, title: '18. Negation (nicht vs kein)', order: 3, 
    content: {
      videoId: videoIds[7],
      info: 'How to say "not" and "no" correctly.',
      vocab: ['nicht', 'kein', 'nein', 'gar nicht', 'niemals'],
      summary: 'Negation in German splits into two distinct logical pathways. This lesson trains your brain to quickly decide between negating a noun vs negating a verb.',
      grammar: ['Use "kein" to negate nouns with indefinite articles or no articles (I have no dog).', 'Use "nicht" to negate verbs, adjectives, or nouns with definite articles (The dog is not big).'],
      tips: ['If you can replace it with "no" or "not a" in English, use kein. Otherwise, use nicht.']
    }
  },
  { 
    modId: 104, title: '19. Modal Verbs (können, müssen)', order: 4, 
    content: {
      videoId: videoIds[8],
      info: 'Expressing ability and necessity.',
      vocab: ['können', 'müssen', 'wollen', 'sollen', 'dürfen', 'mögen'],
      summary: 'Modal verbs are linguistic force multipliers. Mastering these 6 verbs allows you to express infinite desires and constraints by using the infinitive form of any other verb.',
      grammar: ['Modal verbs force the second verb to the absolute end of the sentence in its infinitive form.', 'The ich and er/sie/es conjugations are exactly identical.'],
      tips: ['Visualize the modal verb "kicking" the other verb to the very end of the sentence.', 'Focus heavily on "können" (can) and "müssen" (must) first.']
    }
  },
  { 
    modId: 104, title: '20. Sentence Structure (Word Order)', order: 5, 
    content: {
      videoId: videoIds[9],
      info: 'The V2 rule and basic sentence formation.',
      vocab: ['der Satz', 'das Verb', 'die Position', 'heute', 'oft'],
      summary: 'German sentence structure relies on rigid topological fields. This lesson trains the foundational "V2 Rule," which is the bedrock of German syntax.',
      grammar: ['The conjugated verb MUST be in the 2nd position in a declarative sentence.', 'If you start with time (e.g., "Heute"), the subject must move to position 3 (Heute spiele ich).'],
      tips: ['Think of the conjugated verb as a concrete pillar glued to the #2 spot. Everything else rotates around it.', 'TMP rule: Time, Manner, Place - the standard order for adverbs.']
    }
  },
  { 
    modId: 105, title: '21. Telling Time', order: 1, 
    content: {
      videoId: videoIds[0],
      info: 'Formal and informal time telling.',
      vocab: ['die Uhr', 'die Stunde', 'die Minute', 'Viertel', 'halb'],
      summary: 'Time-telling requires mathematical translation logic. This lesson focuses on automating the distinct German concepts like "halb" meaning half-way to the next hour.',
      grammar: ['"halb 4" means 3:30 (halfway to four).', 'Use "um" for specific times (um 8 Uhr).'],
      tips: ['Draw clock faces and quickly shout out the German times.', 'Switch your phone clock to 24-hour format, as Germany heavily relies on the 24h clock for formal time.']
    }
  },
  { 
    modId: 105, title: '22. Days of the Week & Months', order: 2, 
    content: {
      videoId: videoIds[1],
      info: 'Temporal vocabulary.',
      vocab: ['Montag', 'Dienstag', 'der Monat', 'Januar', 'das Wochenende'],
      summary: 'Temporal sequencing builds narrative competence. This lesson relies on rhythmic chanting and sequencing to embed days and months into procedural memory.',
      grammar: ['All days and months are masculine (der).', 'Use "am" before days (am Montag) and "im" before months (im Januar).'],
      tips: ['Write your weekly schedule in a physical planner exclusively using German abbreviations (Mo, Di, Mi, Do, Fr, Sa, So).']
    }
  },
  { 
    modId: 105, title: '23. Daily Routine (Separable Verbs)', order: 3, 
    content: {
      videoId: videoIds[2],
      info: 'Verbs that split in two.',
      vocab: ['aufstehen', 'einkaufen', 'fernsehen', 'anfangen', 'der Alltag'],
      summary: 'Separable verbs introduce discontinuous dependencies—a unique cognitive challenge in German where meaning is split across the sentence.',
      grammar: ['The prefix splits off and goes to the absolute end of the sentence (Ich stehe um 7 Uhr auf).'],
      tips: ['Imagine the prefix acting as a punctuation mark at the end of the sentence.', 'When learning the verb, always emphasize the prefix verbally (AUF-stehen) as it dictates the split.']
    }
  },
  { 
    modId: 105, title: '24. Hobbies and Free Time', order: 4, 
    content: {
      videoId: videoIds[3],
      info: 'Talking about what you like to do.',
      vocab: ['das Hobby', 'die Freizeit', 'gern', 'lesen', 'schwimmen'],
      summary: 'Expressing preferences is highly motivating. This lesson introduces the adverb "gern", replacing the English reliance on the verb "to like".',
      grammar: ['Use [Verb] + gern to say you like doing something (Ich lese gern = I like reading).'],
      tips: ['List your top 3 hobbies and practice describing them using "gern".', 'Pair "gern" with time words (Ich schwimme oft gern).']
    }
  },
  { 
    modId: 105, title: '25. Food & Drink', order: 5, 
    content: {
      videoId: videoIds[4],
      info: 'Vocabulary for meals and groceries.',
      vocab: ['das Essen', 'trinken', 'das Wasser', 'das Brot', 'das Fleisch'],
      summary: 'Culinary vocabulary is critical for survival and socialization. We use sensory memory encoding (visualizing taste/smell) to solidify these nouns.',
      grammar: ['When talking about food in general, articles are often dropped (Ich trinke Wasser).'],
      tips: ['Tape German sticky notes to the food items in your actual kitchen and fridge.', 'When cooking, narrate your actions aloud in German.']
    }
  },
  { 
    modId: 106, title: '26. In the Restaurant', order: 1, 
    content: {
      videoId: videoIds[5],
      info: 'Ordering food and paying the bill.',
      vocab: ['die Speisekarte', 'bestellen', 'bezahlen', 'die Rechnung', 'lecker'],
      summary: 'This is a scenario-based lesson. Role-playing activates situated cognition, preparing your brain to retrieve these specific phrases under social pressure.',
      grammar: ['Use "Ich möchte..." (I would like) as the most polite way to order.', 'Stimmen means "Keep the change".'],
      tips: ['Practice the dialogue out loud with a friend or in front of a mirror.', 'Remember that tipping in Germany is usually just rounding up (about 5-10%).']
    }
  },
  { 
    modId: 106, title: '27. Shopping & Prices', order: 2, 
    content: {
      videoId: videoIds[6],
      info: 'Buying items and asking for costs.',
      vocab: ['kaufen', 'kosten', 'teuer', 'billig', 'das Geld'],
      summary: 'Transactional vocabulary requires rapid processing of numbers and nouns simultaneously. This builds working memory capacity for German syntax.',
      grammar: ['"Wie viel kostet das?" (How much is that?).', 'Prices use a comma instead of a decimal (z.B. 4,99 € is spoken "vier Euro neunundneunzig").'],
      tips: ['Mentally translate prices at your local grocery store into German as you shop.', 'Focus on the phrase "Das ist zu teuer!" (That is too expensive).']
    }
  },
  { 
    modId: 106, title: '28. Body Parts & Health', order: 3, 
    content: {
      videoId: videoIds[7],
      info: 'Naming body parts and saying what hurts.',
      vocab: ['der Körper', 'der Kopf', 'der Bauch', 'die Hand', 'die Schmerzen'],
      summary: 'Physical embodiment (TPR - Total Physical Response) is the most effective way to learn body parts. Connecting movement to words bypasses English translation.',
      grammar: ['Use "Mein [Körperteil] tut weh" (My [body part] hurts).', 'Plural is "tun weh".'],
      tips: ['Touch the body part physically while saying the German word aloud.', 'Learn the phrase "Ich bin krank" (I am sick).']
    }
  },
  { 
    modId: 106, title: '29. Clothing', order: 4, 
    content: {
      videoId: videoIds[8],
      info: 'Talking about what you wear.',
      vocab: ['die Kleidung', 'die Hose', 'das Hemd', 'der Schuh', 'tragen'],
      summary: 'Clothing vocabulary is highly practical. We focus on the verb "tragen" (to wear) which introduces vowel-shift irregularities.',
      grammar: ['"tragen" is irregular: du trägst, er trägt.', 'Use the accusative case for what you wear (Ich trage einen Pullover).'],
      tips: ['Describe what you are currently wearing every morning in German.', 'Notice that "die Hose" (pants) is singular in German, unlike English!']
    }
  },
  { 
    modId: 107, title: '30. Weather & Seasons', order: 1, 
    content: {
      videoId: videoIds[9],
      info: 'Describing the weather outside.',
      vocab: ['das Wetter', 'die Sonne', 'der Regen', 'kalt', 'warm', 'der Sommer'],
      summary: 'Weather discussions are the universal small talk. This lesson builds automaticity in describing environmental states using "Es ist...".',
      grammar: ['Weather often uses dummy subject "Es" (Es regnet, Es schneit).', 'Adjectives like "kalt" don\'t take endings when following "ist".'],
      tips: ['Check your weather app every morning and state the condition in German.', 'Learn the four seasons (Frühling, Sommer, Herbst, Winter).']
    }
  },
  { 
    modId: 107, title: '31. Directions & Places', order: 2, 
    content: {
      videoId: videoIds[0],
      info: 'Navigating the city.',
      vocab: ['die Straße', 'links', 'rechts', 'geradeaus', 'der Bahnhof'],
      summary: 'Spatial cognition is triggered here. Giving and receiving directions requires mapping physical paths to sequential linguistic steps.',
      grammar: ['Imperative form is often used for directions (Gehen Sie links).', '"Zu" (to) always takes the dative case (zum Bahnhof).'],
      tips: ['Use Google Maps in German mode while walking around your town.', 'Use your hands to point left, right, and straight while saying the words.']
    }
  },
  { 
    modId: 107, title: '32. The Perfect Tense (Part 1)', order: 3, 
    content: {
      videoId: videoIds[1],
      info: 'Introduction to speaking in the past tense.',
      vocab: ['die Vergangenheit', 'das Perfekt', 'haben', 'gemacht', 'gespielt'],
      summary: 'The Perfekt is the primary spoken past tense in German. Mastering this unlocks the ability to narrate your life story and recent events.',
      grammar: ['Formed with auxiliary verb (haben/sein) in V2, and the Past Participle at the very end.', 'Regular participles use ge-[stem]-t (z.B. gemacht).'],
      tips: ['Think of the auxiliary verb and participle as two bookends holding the rest of the sentence together.', 'Always learn the participle form when learning a new verb.']
    }
  },
  { 
    modId: 107, title: '33. The Perfect Tense (Part 2 - sein verbs)', order: 4, 
    content: {
      videoId: videoIds[2],
      info: 'Past tense verbs indicating motion.',
      vocab: ['sein', 'gegangen', 'gefahren', 'gekommen', 'geblieben'],
      summary: 'This lesson covers the crucial exception to the Perfekt tense: using "sein" instead of "haben" for verbs of motion and state change.',
      grammar: ['Verbs indicating movement from A to B (gehen, fahren) use "sein" as the auxiliary.', 'Irregular participles often end in -en (z.B. gegangen).'],
      tips: ['Visualize movement or travel when using "sein" in the past tense.', 'Memorize "Ich bin gegangen" (I went) as a single, unbreakable chunk.']
    }
  }
];
