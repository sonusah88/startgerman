'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { GoogleGenAI } from '@google/genai';
import { getRandomGeminiKey, getAllGeminiKeys } from '@/lib/gemini';

export async function submitExamWriting(sectionId: string, answerText: string) {
  const session = await auth();
  if (!session?.user?.email) return null;

  try {
    const apiKey = getRandomGeminiKey();
    if (!apiKey) throw new Error("API key not configured");
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
      You are an official Goethe-Institut examiner grading an A1 level writing test (Schreiben).
      The user wrote the following text: "${answerText}".
      
      Grade it based on A1 criteria:
      - Task fulfillment (did they cover the prompt?)
      - Vocabulary (is it appropriate for A1?)
      - Grammar (are the basic structures correct?)

      Return JSON format:
      {
        "score": (0-100),
        "feedback": "Detailed feedback",
        "correctedText": "The text with grammatical corrections"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: answerText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    // In a real app, save to db: userExamResults
    return result;

  } catch (err) {
    console.error('Exam Grading Error:', err);
    return null;
  }
}

export async function submitExamSpeaking(audioBase64: string, mimeType: string = 'audio/webm') {
  const session = await auth();
  if (!session?.user?.email) return null;

  try {
    const keys = getAllGeminiKeys();
    if (keys.length === 0) throw new Error("API keys not configured");
    const shuffledKeys = [...keys].sort(() => Math.random() - 0.5);

    const systemInstruction = `
      You are an official Goethe-Institut examiner grading an A1 level speaking test (Sprechen).
      The user submitted an audio recording introducing themselves or answering a basic A1 question.
      
      Grade it based on A1 criteria:
      - Pronunciation & Intonation (is it understandable?)
      - Vocabulary (is it appropriate for A1?)
      - Grammar & Flow (basic structures, minimal hesitation)

      Return JSON format:
      {
        "score": (0-100),
        "feedback": "Detailed feedback on their pronunciation and grammar",
        "transcription": "What you heard them say"
      }
    `;

    let lastError = null;
    let result = null;

    for (const key of shuffledKeys) {
      try {
        const ai = new GoogleGenAI({ apiKey: key });
        const response = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: [
            { inlineData: { mimeType, data: audioBase64 } },
            { text: 'Please grade this A1 German speaking recording.' }
          ],
          config: {
            systemInstruction,
            responseMimeType: 'application/json'
          }
        });

        result = JSON.parse(response.text || '{}');
        if (result && result.score !== undefined) {
          return result;
        }
      } catch (e: any) {
        console.warn(`Key failed in submitExamSpeaking:`, e.message);
        lastError = e;
      }
    }

    if (!result) throw lastError || new Error("All API keys failed");
    return result;

  } catch (err) {
    console.error('Speaking Exam Grading Error:', err);
    return null;
  }
}

export async function submitExamMultipleChoice(sectionId: string, score: number, total: number) {
  const session = await auth();
  if (!session?.user?.email) return null;
  
  // In a real app, validate answers against a database.
  // For this mock exam, we just take the client's calculated score for simplicity.
  const percentage = Math.round((score / total) * 100);
  
  return {
    score: percentage,
    feedback: percentage >= 60 ? "Good job! You passed this section." : "Keep practicing to improve your score.",
    correctAnswers: score,
    totalQuestions: total
  };
}

export async function generateExamQuestion(sectionId: string) {
  // Fallback content so the exam always works even when API is rate-limited
  const fallbacks: Record<string, any> = {
    horen: {
      context: "Achtung, eine Durchsage am Hauptbahnhof: Der ICE 597 nach München Hauptbahnhof über Augsburg fährt heute von Gleis 14 ab. Abfahrt ist um 10 Uhr 35. Der Zug hat circa 10 Minuten Verspätung. Wir bitten um Ihr Verständnis. Bitte beachten Sie: Das Bordbistro im Wagen 7 ist heute geschlossen.",
      questions: [
        { id: 1, question: "Wohin fährt der Zug?", options: ["Nach Berlin", "Nach München", "Nach Hamburg"], answer: 1 },
        { id: 2, question: "Von welchem Gleis fährt der Zug?", options: ["Gleis 7", "Gleis 10", "Gleis 14"], answer: 2 },
        { id: 3, question: "Wie viel Verspätung hat der Zug?", options: ["5 Minuten", "10 Minuten", "15 Minuten"], answer: 1 }
      ]
    },
    lesen: {
      context: "Liebe Grüße aus Berlin!\nDas Wetter ist wunderschön und die Sonne scheint jeden Tag.\nGestern war ich im Pergamonmuseum, das war sehr interessant.\nAm Abend haben wir in einem kleinen italienischen Restaurant gegessen. Die Pizza war lecker!\nMorgen fahre ich mit dem Zug nach München.\nBis bald,\nAnna",
      questions: [
        { id: 1, question: "Wo ist Anna gerade?", options: ["In München", "In Berlin", "In Italien"], answer: 1 },
        { id: 2, question: "Wie ist das Wetter?", options: ["Es regnet", "Es ist kalt", "Die Sonne scheint"], answer: 2 },
        { id: 3, question: "Was macht Anna morgen?", options: ["Sie geht ins Museum", "Sie fährt nach München", "Sie isst Pizza"], answer: 1 }
      ]
    },
    schreiben: {
      scenario: "Sie möchten am Wochenende einen Ausflug machen. Schreiben Sie eine E-Mail an Ihre Freundin Maria:",
      points: ["Wohin wollen Sie fahren?", "Wann wollen Sie fahren?", "Was soll Maria mitbringen?"]
    },
    sprechen: {
      scenario: "Stellen Sie sich vor (Introduce yourself).",
      points: ["Sagen Sie Ihren Namen (Say your name)", "Woher kommen Sie? (Where are you from?)", "Welche Sprachen sprechen Sie? (What languages do you speak?)"]
    }
  };

  try {
    const apiKey = getRandomGeminiKey();
    if (!apiKey) throw new Error("API key not configured");
    const ai = new GoogleGenAI({ apiKey });

    let systemInstruction = '';
    
    if (sectionId === 'horen') {
      systemInstruction = `
        You are a Goethe-Institut A1 exam creator. 
        Generate a listening comprehension task (Hören).
        Return JSON strictly matching this schema:
        {
          "context": "A short, realistic German announcement or voicemail transcript (e.g. at a train station or supermarket)",
          "questions": [
            { "id": 1, "question": "Question in German", "options": ["Option A", "Option B", "Option C"], "answer": 0 }
          ]
        }
        Generate exactly 3 questions.
      `;
    } else if (sectionId === 'lesen') {
      systemInstruction = `
        You are a Goethe-Institut A1 exam creator. 
        Generate a reading comprehension task (Lesen).
        Return JSON strictly matching this schema:
        {
          "context": "A short A1-level German email, letter, or advertisement.",
          "questions": [
            { "id": 1, "question": "Question in German", "options": ["Option A", "Option B", "Option C"], "answer": 0 }
          ]
        }
        Generate exactly 3 questions.
      `;
    } else if (sectionId === 'schreiben') {
      systemInstruction = `
        You are a Goethe-Institut A1 exam creator. 
        Generate a writing task (Schreiben Teil 2).
        Return JSON strictly matching this schema:
        {
          "scenario": "The prompt in German (e.g. 'Sie möchten am Wochenende einen Ausflug machen. Schreiben Sie eine E-Mail an Ihre Freundin Maria:')",
          "points": ["Bullet point 1 in German", "Bullet point 2 in German", "Bullet point 3 in German"]
        }
      `;
    } else if (sectionId === 'sprechen') {
      systemInstruction = `
        You are a Goethe-Institut A1 exam creator. 
        Generate a speaking task (Sprechen).
        Return JSON strictly matching this schema:
        {
          "scenario": "The prompt in German and English (e.g. 'Stellen Sie sich vor (Introduce yourself).')",
          "points": ["What to include in English/German 1", "Point 2", "Point 3"]
        }
      `;
    }

    const keys = getAllGeminiKeys();
    if (keys.length === 0) throw new Error("API keys not configured");
    const shuffledKeys = [...keys].sort(() => Math.random() - 0.5);

    let lastError: any = null;
    let parsed: any = null;

    for (const key of shuffledKeys) {
      try {
        const ai = new GoogleGenAI({ apiKey: key });
        const response = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: 'Generate the exam task in JSON format.',
          config: {
            systemInstruction,
            responseMimeType: 'application/json'
          }
        });

        parsed = JSON.parse(response.text || '{}');
        if (parsed && (parsed.questions || parsed.points)) {
          return parsed; // Success!
        }
      } catch (e: any) {
        lastError = e;
        console.warn(`Exam generation failed for a key:`, e.message?.substring(0, 120));
        // Loop continues to next key
      }
    }

    if (!parsed) {
      console.warn('All AI attempts failed, using fallback content for:', sectionId);
      return fallbacks[sectionId] || null;
    }

  } catch (err) {
    console.error('Exam Generation Error:', err);
    return fallbacks[sectionId] || null;
  }
}

