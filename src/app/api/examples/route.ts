import { NextResponse } from 'next/server';
import { getExampleSentences } from '@/lib/api/tatoeba';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const word = searchParams.get('word');
    const limit = parseInt(searchParams.get('limit') || '8');

    if (!word) {
      return NextResponse.json({ error: 'Missing word parameter' }, { status: 400 });
    }

    const sentences = await getExampleSentences(word, limit);
    return NextResponse.json(sentences);
  } catch (error: any) {
    console.error('Tatoeba API error:', error);
    return NextResponse.json({ error: 'Failed to fetch examples' }, { status: 500 });
  }
}
