// Tatoeba API client - for contextual example sentences

export interface TatoebaResult {
  id: number;
  text: string;
  lang: string;
  translations: { text: string; lang: string }[];
}

export async function getExampleSentences(word: string, limit = 8): Promise<TatoebaResult[]> {
  try {
    const res = await fetch(
      `https://api.tatoeba.org/unstable/sentences?lang=deu&q=${encodeURIComponent(word)}&limit=${limit}&trans=eng`,
      { next: { revalidate: 86400 } } // Cache for 24h
    );

    if (!res.ok) {
      console.error('Tatoeba API error:', res.status);
      return getFallbackSentences(word);
    }

    const data = await res.json();

    return (data.data || []).map((s: any) => ({
      id: s.id,
      text: s.text,
      lang: s.lang,
      translations: (s.translations?.[0] || []).map((t: any) => ({
        text: t.text,
        lang: t.lang,
      })),
    }));
  } catch (error) {
    console.error('Tatoeba fetch error:', error);
    return getFallbackSentences(word);
  }
}

function getFallbackSentences(word: string): TatoebaResult[] {
  // Curated A1-level fallback sentences for common words
  const FALLBACK_DB: Record<string, TatoebaResult[]> = {
    'Haus': [
      { id: 1, text: 'Das Haus ist groß.', lang: 'deu', translations: [{ text: 'The house is big.', lang: 'eng' }] },
      { id: 2, text: 'Ich gehe nach Hause.', lang: 'deu', translations: [{ text: 'I am going home.', lang: 'eng' }] },
    ],
    'Wasser': [
      { id: 3, text: 'Ich trinke Wasser.', lang: 'deu', translations: [{ text: 'I drink water.', lang: 'eng' }] },
      { id: 4, text: 'Das Wasser ist kalt.', lang: 'deu', translations: [{ text: 'The water is cold.', lang: 'eng' }] },
    ],
    'Buch': [
      { id: 5, text: 'Ich lese ein Buch.', lang: 'deu', translations: [{ text: 'I am reading a book.', lang: 'eng' }] },
      { id: 6, text: 'Das Buch ist interessant.', lang: 'deu', translations: [{ text: 'The book is interesting.', lang: 'eng' }] },
    ],
  };
  return FALLBACK_DB[word] || [
    { id: 0, text: `Das Wort "${word}" ist wichtig.`, lang: 'deu', translations: [{ text: `The word "${word}" is important.`, lang: 'eng' }] },
  ];
}
