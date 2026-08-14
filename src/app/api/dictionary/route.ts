import { NextResponse } from 'next/server';
import { lookupWord } from '@/lib/api/dictionary';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const word = searchParams.get('word');

    if (!word) {
      return NextResponse.json({ error: 'Missing word parameter' }, { status: 400 });
    }

    const data = await lookupWord(word);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Dictionary API error:', error);
    return NextResponse.json({ error: 'Dictionary lookup failed' }, { status: 500 });
  }
}
