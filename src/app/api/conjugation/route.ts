import { NextResponse } from 'next/server';
import { getConjugation } from '@/lib/api/verbformen';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const verb = searchParams.get('verb');

    if (!verb) {
      return NextResponse.json({ error: 'Missing verb parameter' }, { status: 400 });
    }

    const conjugation = getConjugation(verb);
    if (!conjugation) {
      return NextResponse.json({ error: 'Verb not found or cannot be conjugated' }, { status: 404 });
    }

    return NextResponse.json({ verb, conjugation });
  } catch (error: any) {
    console.error('Conjugation API error:', error);
    return NextResponse.json({ error: 'Failed to conjugate verb' }, { status: 500 });
  }
}
