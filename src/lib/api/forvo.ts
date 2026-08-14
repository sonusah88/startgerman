// Forvo API client - for native speaker audio pronunciation

export interface ForvoResult {
  word: string;
  audioUrl: string;
  username: string;
  country: string;
  votes: number;
}

export async function getNativePronunciation(word: string): Promise<ForvoResult[]> {
  const apiKey = process.env.FORVO_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch(
        `https://apifree.forvo.com/key/${apiKey}/format/json/action/word-pronunciations/word/${encodeURIComponent(word)}/language/de`
      );
      if (res.ok) {
        const data = await res.json();
        return (data.items || []).map((item: any) => ({
          word: item.word,
          audioUrl: item.pathmp3,
          username: item.username,
          country: item.country,
          votes: item.num_positive_votes - item.num_votes,
        })).sort((a: ForvoResult, b: ForvoResult) => b.votes - a.votes);
      }
    } catch (e) {
      console.error('Forvo API error:', e);
    }
  }

  // If no API key, return empty and the UI will fall back to browser TTS
  return [];
}
