import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
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

    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            userGermanTranslation: {
              type: SchemaType.STRING,
              description: "The German translation of the user's input if they spoke English. Empty if they spoke German.",
            },
            tutorGerman: {
              type: SchemaType.STRING,
              description: "Your conversational response in German.",
            },
            tutorEnglish: {
              type: SchemaType.STRING,
              description: "The English translation of your tutorGerman response.",
            }
          },
          required: ["tutorGerman", "tutorEnglish", "userGermanTranslation"]
        }
      }
    });

    // Format entire conversation history into a single prompt for generateContent
    // This avoids schema conflicts that happen when passing raw text into startChat history while responseSchema is enabled.
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

    let result;
    let retries = 3;
    while (retries > 0) {
      try {
        result = await model.generateContent(prompt);
        break; // Success
      } catch (e: any) {
        if (e.message?.includes('503') && retries > 1) {
          retries--;
          await new Promise(r => setTimeout(r, 2000)); // wait 2s before retry
          continue;
        }
        throw e; // throw if it's not a 503 or we're out of retries
      }
    }
    
    if (!result) throw new Error("Failed to generate content after retries");

    const responseText = result.response.text();
    const responseJson = JSON.parse(responseText);

    return NextResponse.json({ 
      response: responseJson.tutorGerman,
      tutorEnglish: responseJson.tutorEnglish,
      userGermanTranslation: responseJson.userGermanTranslation
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    // Return a friendly message if the API is completely overloaded
    if (error.message?.includes('503')) {
      return NextResponse.json({ error: 'The AI Tutor is currently experiencing high demand. Please wait a moment and try again.' }, { status: 503 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
