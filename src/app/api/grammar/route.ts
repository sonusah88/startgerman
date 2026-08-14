import { NextResponse } from 'next/server';
import { checkGermanGrammar } from '@/lib/api/languagetool';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid text' }, { status: 400 });
    }

    const result = await checkGermanGrammar(text);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Grammar check error:', error);
    return NextResponse.json({ error: 'Failed to check grammar' }, { status: 500 });
  }
}
