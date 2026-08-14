import { NextResponse } from 'next/server';
import { getRandomGeminiKey } from '@/lib/gemini';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(req: Request) {
  try {
    const GEMINI_API_KEY = getRandomGeminiKey();
    const { text, voiceId = 'pNInz6obbfDQGcgMyIGb' } = await req.json(); // Default voice

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }

    // 1. Try ElevenLabs if configured
    if (ELEVENLABS_API_KEY) {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        }),
      });

      if (!response.ok) {
        throw new Error('ElevenLabs API failed');
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return NextResponse.json({
        audio: buffer.toString('base64'),
        mimeType: 'audio/mpeg'
      });
    }

    // 2. Fallback to Gemini TTS
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'No TTS API keys configured' }, { status: 500 });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Speak the following German text clearly, slowly, and with proper pronunciation for a language learner:\n\n${text}` }]
          }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
          }
        })
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Gemini TTS failed' }, { status: 500 });
    }

    const data = await response.json();
    const audioPart = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    if (!audioPart?.data) {
      return NextResponse.json({ error: 'No audio returned' }, { status: 500 });
    }

    const rawAudio = Buffer.from(audioPart.data, 'base64');
    const sampleRate = 24000, numChannels = 1, bitsPerSample = 16;
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const dataSize = rawAudio.length;
    
    const wavHeader = Buffer.alloc(44);
    wavHeader.write('RIFF', 0);
    wavHeader.writeUInt32LE(36 + dataSize, 4);
    wavHeader.write('WAVE', 8);
    wavHeader.write('fmt ', 12);
    wavHeader.writeUInt32LE(16, 16); 
    wavHeader.writeUInt16LE(1, 20); 
    wavHeader.writeUInt16LE(numChannels, 22);
    wavHeader.writeUInt32LE(sampleRate, 24);
    wavHeader.writeUInt32LE(byteRate, 28);
    wavHeader.writeUInt16LE(blockAlign, 32);
    wavHeader.writeUInt16LE(bitsPerSample, 34);
    wavHeader.write('data', 36);
    wavHeader.writeUInt32LE(dataSize, 40);
    
    const wavBuffer = Buffer.concat([wavHeader, rawAudio]);

    return NextResponse.json({
      audio: wavBuffer.toString('base64'),
      mimeType: 'audio/wav'
    });
  } catch (error: any) {
    console.error('TTS Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
