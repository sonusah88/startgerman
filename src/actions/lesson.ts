'use server';

import { db } from '@/db';
import { lessons } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { getRandomGeminiKey, getAllGeminiKeys } from '@/lib/gemini';

export async function generateLessonPlan(lessonId: number) {
  try {
    const prompt = `Generate a 5-step lesson plan for the topic: "${lesson.title}". Make sure there are exactly 2 'input' steps, 1 'grammar' step, and 2 'practice' steps.`;
    
    const keys = getAllGeminiKeys();
    if (keys.length === 0) throw new Error("API keys not configured");
    const shuffledKeys = [...keys].sort(() => Math.random() - 0.5);
    
    let result;
    let lastError;

    for (const key of shuffledKeys) {
      try {
        const ai = new GoogleGenerativeAI(key);
        const model = ai.getGenerativeModel({
          model: 'gemini-flash-latest',
          systemInstruction: `You are an expert Goethe A1 German teacher. 
Create a short, accurate, 5-step interactive lesson for the topic: "${lesson.title}".

Your response MUST be an exact JSON array of exactly 5 steps matching this schema perfectly:
- 2 steps of type "input" (to teach new words/phrases)
- 1 step of type "grammar" (to explain the rule simply)
- 2 steps of type "practice" (multiple choice questions to test the user)

CRITICAL RULES FOR 'input' STEPS:
- 'word' MUST ONLY contain the German text (maximum 1-3 words). Do NOT include English translations here!
- 'meaning' MUST ONLY contain the English translation.
- 'example' MUST contain a short, simple example sentence in German, followed by the English translation.

Keep all vocabulary, grammar, and sentences strictly at the A1 level.`,
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  type: { type: SchemaType.STRING },
                  content: {
                    type: SchemaType.OBJECT,
                    properties: {
                      title: { type: SchemaType.STRING },
                      word: { type: SchemaType.STRING },
                      meaning: { type: SchemaType.STRING },
                      example: { type: SchemaType.STRING },
                      text: { type: SchemaType.STRING },
                      question: { type: SchemaType.STRING },
                      options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                      correct: { type: SchemaType.STRING }
                    },
                  }
                },
                required: ["type", "content"]
              }
            }
          }
        });

        result = await model.generateContent(prompt);
        break;
      } catch (e: any) {
        console.warn(`Key failed in lesson generation:`, e.message);
        lastError = e;
      }
    }

    if (!result) throw lastError || new Error("All API keys failed to generate lesson content");

    const responseText = result.response.text();
    const steps = JSON.parse(responseText);

    return steps;
  } catch (error) {
    console.error("Failed to generate dynamic lesson:", error);
    return [];
  }
}
