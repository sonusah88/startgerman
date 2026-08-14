'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import { users, vocabulary, grammarPoints, userVocabularyProgress } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function getDueVocabulary() {
  const session = await auth();
  if (!session?.user?.email) return [];

  const userRes = await db.select().from(users).where(eq(users.email, session.user.email));
  const user = userRes[0];
  if (!user) return [];

  const now = new Date().getTime();

  const dueItems = await db.select({
    id: vocabulary.id,
    germanWord: vocabulary.germanWord,
    englishMeaning: vocabulary.englishMeaning,
    article: vocabulary.article,
    plural: vocabulary.plural,
    type: sql<string>`'recall'`,
  })
  .from(userVocabularyProgress)
  .innerJoin(vocabulary, eq(userVocabularyProgress.vocabularyId, vocabulary.id))
  .where(
    sql`${userVocabularyProgress.userId} = ${user.id} AND (${userVocabularyProgress.nextReviewDate} <= ${now} OR ${userVocabularyProgress.nextReviewDate} IS NULL)`
  )
  .limit(10);

  if (dueItems.length === 0) {
    const fallback = await db.select().from(vocabulary).limit(10);
    return fallback.map(v => ({
      id: v.id,
      germanWord: v.germanWord,
      englishMeaning: v.englishMeaning,
      article: v.article,
      plural: v.plural,
      type: 'recall'
    }));
  }

  return dueItems;
}

export async function submitVocabularyReview(vocabularyId: number, performance: 'hard' | 'good' | 'easy') {
  const session = await auth();
  if (!session?.user?.email) return;

  const userRes = await db.select().from(users).where(eq(users.email, session.user.email));
  const user = userRes[0];
  if (!user) return;

  const now = new Date().getTime();
  let nextIntervalDays = 1;
  let masteryDelta = 0;

  if (performance === 'hard') { nextIntervalDays = 0.5; masteryDelta = -10; }
  else if (performance === 'good') { nextIntervalDays = 2; masteryDelta = 10; }
  else if (performance === 'easy') { nextIntervalDays = 5; masteryDelta = 20; }

  const nextReviewDate = now + (nextIntervalDays * 24 * 60 * 60 * 1000);

  const existing = await db.select().from(userVocabularyProgress).where(
    sql`${userVocabularyProgress.userId} = ${user.id} AND ${userVocabularyProgress.vocabularyId} = ${vocabularyId}`
  );

  if (existing.length > 0) {
    const currentMastery = existing[0].masteryLevel || 0;
    await db.update(userVocabularyProgress)
      .set({
        masteryLevel: Math.min(Math.max(currentMastery + masteryDelta, 0), 100),
        nextReviewDate: new Date(nextReviewDate),
        lastReviewedDate: new Date(now)
      })
      .where(eq(userVocabularyProgress.id, existing[0].id));
  } else {
    await db.insert(userVocabularyProgress).values({
      userId: user.id,
      vocabularyId,
      masteryLevel: Math.max(masteryDelta, 0),
      nextReviewDate: new Date(nextReviewDate),
      lastReviewedDate: new Date(now)
    });
  }
}

export async function generateDailyStudyPlan() {
  const dueVocab = await getDueVocabulary();
  const grammarList = await db.select().from(grammarPoints).limit(3);

  const steps: any[] = [];

  // Vocabulary flashcards (learn)
  for (const word of dueVocab.slice(0, 4)) {
    steps.push({
      type: 'input',
      content: {
        title: 'New Word',
        word: `${word.article ? word.article + ' ' : ''}${word.germanWord}`,
        meaning: word.englishMeaning,
        example: `Beispiel: ${word.article ? word.article + ' ' : ''}${word.germanWord} – ${word.englishMeaning}`
      }
    });
  }

  // Grammar point
  if (grammarList.length > 0) {
    const gp = grammarList[Math.floor(Math.random() * grammarList.length)];
    steps.push({
      type: 'grammar',
      content: {
        title: gp.title,
        text: gp.explanation
      }
    });
  }

  // Multiple-choice quiz
  for (const word of dueVocab.slice(0, 4)) {
    const others = dueVocab.filter(w => w.germanWord !== word.germanWord).slice(0, 3);
    if (others.length < 3) continue;

    const options = [
      word.englishMeaning,
      ...others.map(o => o.englishMeaning)
    ].sort(() => Math.random() - 0.5);

    steps.push({
      type: 'practice',
      content: {
        question: `Was bedeutet "${word.article ? word.article + ' ' : ''}${word.germanWord}"?`,
        options,
        correct: word.englishMeaning
      }
    });
  }

  return steps;
}
