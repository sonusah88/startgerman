'use server';

import { db } from '@/db';
import { lessons } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { getRandomGeminiKey } from '@/lib/gemini';

export async function generateLessonPlan(lessonId: number) {
  try {
    const apiKey = getRandomGeminiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 1. Fetch lesson topic from DB
    const lessonResult = await db.select().from(lessons).where(eq(lessons.id, lessonId));
    const lesson = lessonResult[0];

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    // 2. Generate content using Gemini structured outputs
    const model = genAI.getGenerativeModel({
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
              type: {
                type: SchemaType.STRING,
                description: "Must be 'input', 'grammar', or 'practice'",
              },
              content: {
                type: SchemaType.OBJECT,
                properties: {
                  // For 'input' type
                  title: { type: SchemaType.STRING, description: "Title like 'New Phrase' or 'New Word'" },
                  word: { type: SchemaType.STRING, description: "The German word or phrase" },
                  meaning: { type: SchemaType.STRING, description: "The English translation" },
                  example: { type: SchemaType.STRING, description: "Example sentence like 'Beispiel: ...'" },
                  
                  // For 'grammar' type
                  text: { type: SchemaType.STRING, description: "A brief, clear explanation of the grammar rule." },
                  
                  // For 'practice' type
                  question: { type: SchemaType.STRING, description: "The question to ask the user" },
                  options: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING },
                    description: "An array of exactly 4 strings for the multiple choice options"
                  },
                  correct: { type: SchemaType.STRING, description: "The exact string from options that is the correct answer" },
                },
                required: []
              }
            },
            required: ["type", "content"]
          }
        }
      }
    });

    const prompt = `Generate a 5-step lesson plan for the topic: "${lesson.title}". Make sure there are exactly 2 'input' steps, 1 'grammar' step, and 2 'practice' steps.`;
    
    let result;
    let retries = 3;
    while (retries > 0) {
      try {
        result = await model.generateContent(prompt);
        break; // Success
      } catch (e: any) {
        if (e.message?.includes('503') && retries > 1) {
          retries--;
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        throw e;
      }
    }

    if (!result) throw new Error("Failed to generate lesson content");

    const responseText = result.response.text();
    const steps = JSON.parse(responseText);

    return steps;
  } catch (error) {
    console.error("Failed to generate dynamic lesson:", error);
    return [];
  }
}
