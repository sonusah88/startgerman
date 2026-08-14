'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import { users, userVocabularyProgress, userGrammarProgress, vocabulary, grammarPoints } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function markLessonComplete(lessonId: number) {
  // To be implemented: record lesson completion in DB
  console.log(`Lesson ${lessonId} marked complete`);
  return { success: true };
}

export async function getDetailedProgress() {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) return null;

  // 1. Fetch Vocabulary Progress
  const vocabProgress = await db.select({
    mastery: userVocabularyProgress.masteryLevel,
    level: vocabulary.cefrLevel,
    topic: vocabulary.topic,
    word: vocabulary.germanWord,
    errorHistory: userVocabularyProgress.errorHistory,
  })
  .from(userVocabularyProgress)
  .innerJoin(vocabulary, eq(userVocabularyProgress.vocabularyId, vocabulary.id))
  .where(eq(userVocabularyProgress.userId, user.id));

  // 2. Fetch Grammar Progress
  const grammarProgress = await db.select({
    mastery: userGrammarProgress.masteryLevel,
    level: grammarPoints.cefrLevel,
    topic: grammarPoints.topic,
    title: grammarPoints.title,
  })
  .from(userGrammarProgress)
  .innerJoin(grammarPoints, eq(userGrammarProgress.grammarPointId, grammarPoints.id))
  .where(eq(userGrammarProgress.userId, user.id));

  // If no progress at all, return default empty state
  if (vocabProgress.length === 0 && grammarProgress.length === 0) {
    return {
      levels: [
        { label: 'A1.1', score: 0, color: '#10b981' },
        { label: 'A1.2', score: 0, color: '#f59e0b' },
        { label: 'A2.1', score: 0, color: '#3b82f6' },
        { label: 'A2.2', score: 0, color: '#6b7280' },
      ],
      skills: [
        { topic: 'Articles', score: 0, color: '#3b82f6' },
        { topic: 'Verbs', score: 0, color: '#8b5cf6' },
        { topic: 'Vocabulary', score: 0, color: '#06b6d4' },
      ],
      errors: [],
      functional: [
        { skill: 'Can introduce myself', done: false, partial: false },
        { skill: 'Can order food', done: false, partial: false },
        { skill: 'Can ask directions', done: false, partial: false },
      ]
    };
  }

  // 3. Calculate CEFR Level Progress
  const levelStats: Record<string, { total: number, sum: number }> = {
    'A1.1': { total: 0, sum: 0 },
    'A1.2': { total: 0, sum: 0 },
    'A2.1': { total: 0, sum: 0 },
    'A2.2': { total: 0, sum: 0 },
  };

  vocabProgress.forEach(v => {
    if (levelStats[v.level]) {
      levelStats[v.level].total += 1;
      levelStats[v.level].sum += (v.mastery || 0);
    }
  });

  grammarProgress.forEach(g => {
    if (levelStats[g.level]) {
      levelStats[g.level].total += 1;
      levelStats[g.level].sum += (g.mastery || 0);
    }
  });

  const levels = [
    { label: 'A1.1', score: levelStats['A1.1'].total ? Math.round(levelStats['A1.1'].sum / levelStats['A1.1'].total) : 0, color: '#10b981' },
    { label: 'A1.2', score: levelStats['A1.2'].total ? Math.round(levelStats['A1.2'].sum / levelStats['A1.2'].total) : 0, color: '#f59e0b' },
    { label: 'A2.1', score: levelStats['A2.1'].total ? Math.round(levelStats['A2.1'].sum / levelStats['A2.1'].total) : 0, color: '#3b82f6' },
    { label: 'A2.2', score: levelStats['A2.2'].total ? Math.round(levelStats['A2.2'].sum / levelStats['A2.2'].total) : 0, color: '#6b7280' },
  ];

  // 4. Calculate Skills (Knowledge Map) by Topic
  const topicStats: Record<string, { total: number, sum: number, type: string }> = {};

  vocabProgress.forEach(v => {
    const t = v.topic || 'General Vocabulary';
    if (!topicStats[t]) topicStats[t] = { total: 0, sum: 0, type: 'vocab' };
    topicStats[t].total += 1;
    topicStats[t].sum += (v.mastery || 0);
  });

  grammarProgress.forEach(g => {
    const t = g.topic || 'General Grammar';
    if (!topicStats[t]) topicStats[t] = { total: 0, sum: 0, type: 'grammar' };
    topicStats[t].total += 1;
    topicStats[t].sum += (g.mastery || 0);
  });

  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#ef4444', '#14b8a6'];
  
  const skills = Object.entries(topicStats)
    .filter(([_, stats]) => stats.total > 2) // Only show topics with some substantial items
    .map(([topic, stats], idx) => ({
      topic,
      score: Math.round(stats.sum / stats.total),
      color: colors[idx % colors.length]
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8); // Top 8 topics

  // 5. Calculate Errors
  const errors = vocabProgress
    .filter(v => v.mastery !== null && v.mastery < 50)
    .map(v => {
      let severity = 'low';
      let color = 'text-yellow-400 bg-yellow-500/10';
      if (v.mastery !== null && v.mastery < 20) {
        severity = 'high';
        color = 'text-red-400 bg-red-500/10';
      } else if (v.mastery !== null && v.mastery < 40) {
        severity = 'medium';
        color = 'text-orange-400 bg-orange-500/10';
      }

      return {
        error: v.word,
        severity,
        color,
        suggestion: 'Review this vocabulary item'
      };
    })
    .sort((a, b) => a.severity === 'high' ? -1 : 1)
    .slice(0, 5); // Top 5 errors

  // 6. Calculate Functional Skills (derived from level scores)
  const a1_1_score = levels[0].score;
  const a1_2_score = levels[1].score;

  const functional = [
    { skill: 'Can introduce myself', done: a1_1_score > 30, partial: a1_1_score > 10 && a1_1_score <= 30 },
    { skill: 'Can order food', done: a1_1_score > 60, partial: a1_1_score > 30 && a1_1_score <= 60 },
    { skill: 'Can ask directions', done: a1_1_score > 80, partial: a1_1_score > 50 && a1_1_score <= 80 },
    { skill: 'Can describe my family', done: a1_1_score > 90, partial: a1_1_score > 70 && a1_1_score <= 90 },
    { skill: 'Can tell the time', done: a1_2_score > 30, partial: a1_2_score > 10 && a1_2_score <= 30 },
    { skill: 'Can describe yesterday', done: a1_2_score > 60, partial: a1_2_score > 30 && a1_2_score <= 60 },
    { skill: 'Can explain a problem', done: a1_2_score > 80, partial: a1_2_score > 50 && a1_2_score <= 80 },
    { skill: 'Can make an appointment', done: a1_2_score > 90, partial: a1_2_score > 70 && a1_2_score <= 90 },
  ];

  return { levels, skills, errors, functional };
}
