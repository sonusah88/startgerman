'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import { users, vocabulary, userVocabularyProgress } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const API_BASE_URL = process.env.API_BASE_URL || 'https://german-language.onrender.com';
const API_KEY = process.env.GERMAN_API_KEY || 'demo-key-12345';

export interface ApiVocabWord {
  german: string;
  english: string;
  all_translations?: string;
  gender?: string;
  pos?: string;
  frequency_rank?: number;
  example_de?: string;
  example_en?: string;
  level?: string;
}

export async function searchVocabulary(query: string): Promise<ApiVocabWord[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/vocab/search?q=${encodeURIComponent(query)}&limit=20`, {
      headers: {
        'X-API-Key': API_KEY
      }
    });
    
    if (!res.ok) {
      console.error('API Error:', await res.text());
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching vocabulary from API:', error);
    return [];
  }
}

export async function addWordToStudyPlan(word: ApiVocabWord) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  const userRes = await db.select().from(users).where(eq(users.email, session.user.email));
  const user = userRes[0];
  if (!user) {
    throw new Error('User not found');
  }

  // 1. Check if word exists in our local vocabulary table
  let vocabId: number;
  
  const existingVocab = await db.select().from(vocabulary).where(eq(vocabulary.germanWord, word.german));
  
  if (existingVocab.length > 0) {
    vocabId = existingVocab[0].id;
  } else {
    // Insert new word into global vocabulary database
    const newVocab = await db.insert(vocabulary).values({
      germanWord: word.german,
      englishMeaning: word.english,
      article: word.gender === 'der' || word.gender === 'die' || word.gender === 'das' ? word.gender : null,
      partOfSpeech: word.pos,
      cefrLevel: word.level || 'Unknown',
      exampleSentence: word.example_de,
    }).returning({ id: vocabulary.id });
    
    vocabId = newVocab[0].id;
  }

  // 2. Add to user's personal study plan (userVocabularyProgress)
  const existingProgress = await db.select().from(userVocabularyProgress)
    .where(and(eq(userVocabularyProgress.userId, user.id), eq(userVocabularyProgress.vocabularyId, vocabId)));

  if (existingProgress.length === 0) {
    await db.insert(userVocabularyProgress).values({
      userId: user.id,
      vocabularyId: vocabId,
      masteryLevel: 0,
      nextReviewDate: new Date(), // Due immediately
    });
    return { success: true, message: 'Added to your study plan!' };
  } else {
    return { success: false, message: 'Word is already in your study plan.' };
  }
}
