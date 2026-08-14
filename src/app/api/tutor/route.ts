import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { history, message, level = 'A1.1' } = body;

    const systemInstruction = `
      You are a friendly, encouraging AI German language tutor.
      The student's current level is ${level}.
      Rules for A1.1:
      - Use very short sentences.
      - Use extremely common vocabulary.
      - Speak slowly (if text-to-speech).
      - Repeat patterns.
      - Provide English explanation only when the user is explicitly confused.
      - Do not introduce A2 vocabulary.
      - Correct only one or two key errors per response.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: message,
      config: {
        systemInstruction,
      }
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error('Tutor API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
