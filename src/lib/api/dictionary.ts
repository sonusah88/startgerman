export interface DictionaryEntry {
  word: string;
  phonetics: string;
  partOfSpeech: string;
  meanings: {
    definition: string;
    example?: string;
  }[];
  source: string;
}

export async function lookupWord(word: string): Promise<DictionaryEntry[]> {
  const ponsKey = process.env.PONS_API_KEY;

  if (ponsKey) {
    // PONS API Integration
    const res = await fetch(`https://api.pons.com/v1/dictionary?q=${encodeURIComponent(word)}&l=deen`, {
      headers: { 'X-Secret': ponsKey }
    });
    if (!res.ok) throw new Error('PONS lookup failed');
    const data = await res.json();
    
    // Transform PONS structure
    return data[0]?.hits.map((hit: any) => ({
      word: hit.roms[0]?.headword,
      phonetics: hit.roms[0]?.phonetics || '',
      partOfSpeech: hit.roms[0]?.wordclass || '',
      meanings: hit.roms[0]?.arabs.map((arab: any) => ({
        definition: arab.translations[0]?.target || '',
      })) || [],
      source: 'PONS'
    })) || [];
  }

  // Fallback to Free Dictionary API (Wiktionary de parser)
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/de/${encodeURIComponent(word)}`);
    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error('Dictionary lookup failed');
    }
    const data = await res.json();

    return data.map((entry: any) => ({
      word: entry.word,
      phonetics: entry.phonetics?.[0]?.text || '',
      partOfSpeech: entry.meanings?.[0]?.partOfSpeech || '',
      meanings: entry.meanings?.[0]?.definitions.map((def: any) => ({
        definition: def.definition,
        example: def.example
      })) || [],
      source: 'FreeDictionary'
    }));
  } catch (error) {
    console.error('Dictionary fallback error:', error);
    // Return empty array instead of fake mock data when word is not found
    return [];
  }
}
