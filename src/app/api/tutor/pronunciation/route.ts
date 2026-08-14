import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getRandomGeminiKey } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const ai = new GoogleGenAI({ apiKey: getRandomGeminiKey() });
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob;
    const targetWord = formData.get('targetWord') as string;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio provided' }, { status: 400 });
    }

    // Convert Blob to Base64 for the Gemini API
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    
    // In a production environment, this requires the Google Gen AI Multimodal endpoint 
    // that accepts audio. For this MVP, we simulate the interaction.
    const systemInstruction = `
      You are a German pronunciation coach. The user is trying to pronounce: "${targetWord}".
      Listen to the audio and provide feedback in JSON format:
      {
        "accuracy": (0-100),
        "feedback": "Specific feedback on their pronunciation",
        "mispronouncedPhonemes": ["a list of specific phonemes they got wrong, if any"]
      }
    `;

    // Example API call (assuming gemini-2.5-pro supports the audio mime type in the new SDK format)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: [
        {
          inlineData: {
            data: buffer.toString('base64'),
            mimeType: audioFile.type || 'audio/webm'
          }
        },
        targetWord
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    return NextResponse.json(JSON.parse(response.text || '{}'));
  } catch (error) {
    console.error('Pronunciation API Error:', error);
    return NextResponse.json({ error: 'Failed to analyze pronunciation' }, { status: 500 });
  }
}
