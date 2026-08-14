import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { getAllGeminiKeys } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const keys = getAllGeminiKeys();
    if (keys.length === 0) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    const { messages, scenario, cefrLevel = 'A1-A2' } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const SYSTEM_PROMPT = `
You are a friendly, encouraging, and highly competent German language tutor.
Your student is at the ${cefrLevel} level.

${scenario ? `Current Roleplay Scenario: ${scenario}\nYou must strictly act out your part in this scenario. Keep the conversation realistic and immersive.` : 'You are acting as a general conversational tutor.'}

Follow these rules:
1. You MUST respond using the strict JSON schema provided.
2. In the 'tutorGerman' field, write your response primarily in German, keeping vocabulary and grammar strictly suitable for a ${cefrLevel} learner. Keep it brief (1-3 sentences maximum).
3. If the user makes a significant grammar or vocabulary mistake, gently correct them in a friendly way before continuing the conversation.
4. In the 'tutorEnglish' field, provide the exact English translation of your German response.
5. In the 'userGermanTranslation' field, if the user's last message was in English, provide the exact German translation of what they said to help them learn. If they spoke in German, leave it empty.
6. End your response with a simple follow-up question to keep the conversation going.
`;

    const conversationText = messages.map((msg: any) => {
      const sender = msg.sender === 'user' ? 'Student' : 'Tutor';
      return `${sender}: ${msg.text}`;
    }).join('\n\n');

    const lastMessage = messages[messages.length - 1];

    const prompt = `
Conversation history:
${conversationText}

---
CURRENT TURN:
Student's last message: "${lastMessage.text}"

Task:
1. If the Student's last message was in English, translate it to German and put it in 'userGermanTranslation'. If it was in German, leave it empty.
2. Generate the Tutor's next response in German based on the conversation history. Put this in 'tutorGerman'.
3. Translate the Tutor's German response into English. Put this in 'tutorEnglish'.
`;

    // Shuffle keys so we start with a random one
    const shuffledKeys = [...keys].sort(() => Math.random() - 0.5);
    
    let result;
    let lastError;

    // Try each key sequentially if one fails
    for (const apiKey of shuffledKeys) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-flash-latest',
          systemInstruction: SYSTEM_PROMPT,
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: SchemaType.OBJECT,
              properties: {
                userGermanTranslation: { type: SchemaType.STRING },
                tutorGerman: { type: SchemaType.STRING },
                tutorEnglish: { type: SchemaType.STRING }
              },
              required: ["tutorGerman", "tutorEnglish", "userGermanTranslation"]
            }
          }
        });

        result = await model.generateContent(prompt);
        break; // Success! Break out of the loop
      } catch (e: any) {
        console.warn(`Key failed (${apiKey.substring(0, 8)}...):`, e.message);
        lastError = e;
        // Continue to the next key in the loop
      }
    }
    
    if (!result) {
      throw lastError || new Error("All API keys failed");
    }

    const responseText = result.response.text();
    const responseJson = JSON.parse(responseText);

    return NextResponse.json({ 
      response: responseJson.tutorGerman,
      tutorEnglish: responseJson.tutorEnglish,
      userGermanTranslation: responseJson.userGermanTranslation
    });
  } catch (error: any) {
    console.error('Gemini API Exhausted:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
