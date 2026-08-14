'use server';

import { db } from '@/db';
import { vocabulary, grammarPoints } from '@/db/schema';
import { like, or } from 'drizzle-orm';

export async function searchContent(query: string) {
  if (!query || query.trim() === '') {
    return { vocabulary: [], grammar: [] };
  }

  const searchTerm = `%${query}%`;

  const vocabResults = await db.select()
    .from(vocabulary)
    .where(
      or(
        like(vocabulary.germanWord, searchTerm),
        like(vocabulary.englishMeaning, searchTerm)
      )
    )
    .limit(10);

  const grammarResults = await db.select()
    .from(grammarPoints)
    .where(
      or(
        like(grammarPoints.title, searchTerm),
        like(grammarPoints.explanation, searchTerm)
      )
    )
    .limit(5);

  return {
    vocabulary: vocabResults,
    grammar: grammarResults
  };
}
