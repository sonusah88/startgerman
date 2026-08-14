'use server';
// Force HMR refresh to fix Webpack action mapping error

import { auth } from '@/auth';
import { db } from '@/db';
import { users, userVocabularyProgress, userGrammarProgress, modules, lessons, conversations } from '@/db/schema';
import { eq, count, sql } from 'drizzle-orm';

export async function getUserProgress() {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) return null;

  // Calculate dynamic progress
  const vocabQuery = await db.select({ count: count() }).from(userVocabularyProgress).where(eq(userVocabularyProgress.userId, user.id));
  const grammarQuery = await db.select({ count: count() }).from(userGrammarProgress).where(eq(userGrammarProgress.userId, user.id));
  
  const vocabCount = vocabQuery[0]?.count || 0;
  const grammarCount = grammarQuery[0]?.count || 0;

  // Real vocabDue calculation: items where nextReviewDate <= now or is null
  const now = new Date();
  const dueQuery = await db.select({ count: count() })
    .from(userVocabularyProgress)
    .where(
      sql`${userVocabularyProgress.userId} = ${user.id} AND (${userVocabularyProgress.nextReviewDate} <= ${now.getTime()} OR ${userVocabularyProgress.nextReviewDate} IS NULL)`
    );
  const vocabDue = dueQuery[0]?.count || 0;

  const progressPercentage = Math.min(Math.round(((vocabCount / 200) + (grammarCount / 20)) * 50), 100);

  // Exam readiness calculation based on grammar mastery
  const examReadiness = Math.min(Math.round((grammarCount / 20) * 100) + 10, 100);

  // --- Dynamic Skills Calculation ---
  const convQuery = await db.select({
    count: count(),
    avgScore: sql<number>`avg(${conversations.score})`
  }).from(conversations).where(eq(conversations.userId, user.id));

  const vocabScore = Math.max(Math.min(Math.round((vocabCount / 200) * 100), 100), 5);
  const grammarScore = Math.max(Math.min(Math.round((grammarCount / 20) * 100), 100), 5);
  
  const convCount = convQuery[0]?.count || 0;
  const avgConvScore = Math.round(convQuery[0]?.avgScore || 0);
  
  const speakingScore = convCount > 0 ? Math.max(avgConvScore, 5) : 5;
  const listeningScore = convCount > 0 ? Math.max(Math.round(avgConvScore * 0.95), 5) : 5;
  
  const baseXPScore = Math.min(Math.round(((user.xp || 0) / 500) * 100), 100);
  const readingScore = Math.max(Math.min(Math.round((vocabScore + grammarScore + baseXPScore) / 3) + 10, 100), 5);
  const writingScore = Math.max(Math.min(Math.round((vocabScore + grammarScore + baseXPScore) / 3), 100), 5);

  const skills = [
    { title: 'Lesen', score: readingScore, color: '#3b82f6' },
    { title: 'Hören', score: listeningScore, color: '#8b5cf6' },
    { title: 'Schreiben', score: writingScore, color: '#10b981' },
    { title: 'Sprechen', score: speakingScore, color: '#f59e0b' },
    { title: 'Grammatik', score: grammarScore, color: '#ec4899' },
    { title: 'Wortschatz', score: vocabScore, color: '#06b6d4' },
  ];

  return {
    user,
    progress: progressPercentage,
    vocabDue,
    examReadiness,
    xp: user.xp || 0,
    currentStreak: user.currentStreak || 0,
    skills,
  };
}

export async function getRoadmap() {
  const allModules = await db.select().from(modules).orderBy(modules.order);
  const allLessons = await db.select().from(lessons).orderBy(lessons.order);
  
  return allModules.map(m => {
    const mLessons = allLessons.filter(l => l.moduleId === m.id);
    return {
      id: m.id,
      order: m.order,
      title: m.title,
      subtitle: m.description,
      status: m.order === 1 ? 'current' : m.order < 1 ? 'completed' : 'locked',
      lessons: mLessons.map(l => ({
        id: l.id,
        title: l.title,
        type: l.type,
        status: m.order === 1 ? 'current' : m.order < 1 ? 'completed' : 'locked',
      }))
    };
  });
}
