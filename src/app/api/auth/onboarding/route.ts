import { auth } from '@/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { level, goal, time, tutor } = body;

    await db.update(users)
      .set({
        currentLevel: level || 'A1.1',
        goal: goal || 'interest',
        dailyMinutes: parseInt(time) || 15,
        updatedAt: new Date(),
      })
      .where(eq(users.email, session.user.email));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
