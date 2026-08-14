import { NextResponse } from 'next/server';
import { translateText } from '@/lib/api/translation';

export async function POST(req: Request) {
  try {
    const { text, targetLang = 'EN' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid text' }, { status: 400 });
    }

    const translation = await translateText(text, targetLang);
    return NextResponse.json({ translation });
  } catch (error: any) {
    console.error('Translation API error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
