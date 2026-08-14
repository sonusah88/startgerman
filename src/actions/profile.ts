'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import { users, userVocabularyProgress, userGrammarProgress } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.email) return null;

  try {
    const userResult = await db.select().from(users).where(eq(users.email, session.user.email));
    const user = userResult[0];

    if (!user) return null;

    // Count learned words (masteryLevel > 0)
    const vocabCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(userVocabularyProgress)
      .where(sql`${userVocabularyProgress.userId} = ${user.id} AND ${userVocabularyProgress.masteryLevel} > 0`);
    
    const vocabCount = vocabCountResult[0]?.count || 0;

    // Count grammar rules practiced
    const grammarCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(userGrammarProgress)
      .where(sql`${userGrammarProgress.userId} = ${user.id} AND ${userGrammarProgress.masteryLevel} > 0`);
    
    const grammarCount = grammarCountResult[0]?.count || 0;

    return {
      ...user,
      wordsLearned: vocabCount,
      grammarLearned: grammarCount,
    };
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
}

export async function updateUserProfile(data: {
  name: string;
  targetLevel: string;
  goal: string;
  dailyMinutes: number;
}) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Not authenticated');

  try {
    await db.update(users)
      .set({
        name: data.name,
        targetLevel: data.targetLevel,
        goal: data.goal,
        dailyMinutes: data.dailyMinutes,
        updatedAt: new Date(),
      })
      .where(eq(users.email, session.user.email));

    revalidatePath('/profile');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to update profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}
