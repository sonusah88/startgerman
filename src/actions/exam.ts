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
  // Complex fallbacks matching the new multi-part structure
  const fallbacks: Record<string, any> = {
    horen: {
      teil1: {
        context: "Dialog: 'Guten Tag, ich suche ein Ticket nach Frankfurt.' 'Einfach oder hin und zurück?' 'Hin und zurück bitte.'",
        questions: [{ id: 1, question: "Wohin möchte der Mann fahren?", options: ["Nach Berlin", "Nach Frankfurt", "Nach München"], answer: 1 }]
      },
      teil2: {
        context: "Achtung am Gleis 4: Der ICE nach Hamburg hat 20 Minuten Verspätung.",
        questions: [{ id: 1, question: "Der Zug ist pünktlich.", options: ["Richtig", "Falsch"], answer: 1 }]
      },
      teil3: {
        context: "Hallo Anna, hier ist Peter. Wir treffen uns um 18 Uhr am Kino. Bis später!",
        questions: [{ id: 1, question: "Wann treffen sie sich?", options: ["Um 17 Uhr", "Um 18 Uhr", "Um 19 Uhr"], answer: 1 }]
      }
    },
    lesen: {
      teil1: {
        context: "Lieber Max, ich bin in Berlin. Das Wetter ist super. Ich habe das Brandenburger Tor gesehen. Morgen fahre ich zurück. Gruß, Anna",
        questions: [{ id: 1, question: "Anna ist in München.", options: ["Richtig", "Falsch"], answer: 1 }]
      },
      teil2: {
        context: "Webseite: 'Lernen Sie Deutsch online! Kurs A1 beginnt am Montag. Preis: 100 Euro.'",
        questions: [{ id: 1, question: "Was kostet der Kurs?", options: ["50 Euro", "100 Euro"], answer: 1 }]
      },
      teil3: {
        context: "Schild am Restaurant: 'Montags geschlossen'",
        questions: [{ id: 1, question: "Man kann am Montag hier essen.", options: ["Richtig", "Falsch"], answer: 1 }]
      }
    },
    schreiben: {
      teil1: {
        scenario: "Ihr Freund Carlos (aus Madrid) möchte einen Deutschkurs in Berlin machen. Füllen Sie das Formular für ihn aus.",
        fields: ["Vorname", "Nachname", "Wohnort", "Heimatland", "Kurs"]
      },
      teil2: {
        scenario: "Sie möchten am Wochenende einen Ausflug machen. Schreiben Sie eine E-Mail an Ihre Freundin Maria:",
        points: ["Wohin wollen Sie fahren?", "Wann wollen Sie fahren?", "Was soll Maria mitbringen?"]
      }
    },
    sprechen: {
      teil1: {
        scenario: "Teil 1: Stellen Sie sich vor. (Introduce yourself.)",
        points: ["Name", "Alter", "Land", "Wohnort", "Sprachen", "Beruf", "Hobby"]
      },
      teil2: {
        scenario: "Teil 2: Um Informationen bitten. (Ask and answer questions.)",
        theme: "Thema: Essen und Trinken",
        words: ["Frühstück", "Fleisch", "Lieblingsessen"]
      },
      teil3: {
        scenario: "Teil 3: Bitten formulieren. (Make requests and respond.)",
        objects: ["Ein Glas Wasser", "Einen Stift", "Die Rechnung bitte"]
      }
    }
  };

  try {
    let systemInstruction = '';
    const topics = ["Reisen (Travel)", "Einkaufen (Shopping)", "Gesundheit (Health)", "Arbeit (Work)", "Freizeit (Free time)", "Wohnen (Living)"];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    if (sectionId === 'horen') {
      systemInstruction = `
        You are an official Goethe-Institut A1 examiner. Generate a Hören (Listening) exam.
        Topic: ${randomTopic}
        You must return a JSON object exactly like this:
        {
          "teil1": {
            "context": "Short dialogues (Teil 1).",
            "questions": [{ "id": 1, "question": "...", "options": ["A", "B", "C"], "answer": 0 }]
          },
          "teil2": {
            "context": "Public announcements (Teil 2).",
            "questions": [{ "id": 1, "question": "...", "options": ["Richtig", "Falsch"], "answer": 0 }]
          },
          "teil3": {
            "context": "Phone voicemails (Teil 3).",
            "questions": [{ "id": 1, "question": "...", "options": ["A", "B", "C"], "answer": 0 }]
          }
        }
        Generate 2 questions per Teil. Everything must be strictly A1 level German.
      `;
    } else if (sectionId === 'lesen') {
      systemInstruction = `
        You are an official Goethe-Institut A1 examiner. Generate a Lesen (Reading) exam.
        Topic: ${randomTopic}
        You must return a JSON object exactly like this:
        {
          "teil1": {
            "context": "2 short emails or letters (Teil 1).",
            "questions": [{ "id": 1, "question": "...", "options": ["Richtig", "Falsch"], "answer": 0 }]
          },
          "teil2": {
            "context": "Information signs or web pages (Teil 2).",
            "questions": [{ "id": 1, "question": "...", "options": ["A", "B"], "answer": 0 }]
          },
          "teil3": {
            "context": "Public signs at a station/street (Teil 3).",
            "questions": [{ "id": 1, "question": "...", "options": ["Richtig", "Falsch"], "answer": 0 }]
          }
        }
        Generate 2 questions per Teil. Strictly A1 level.
      `;
    } else if (sectionId === 'schreiben') {
      systemInstruction = `
        You are an official Goethe-Institut A1 examiner. Generate a Schreiben (Writing) exam.
        Topic: ${randomTopic}
        Return JSON exactly like this:
        {
          "teil1": {
            "scenario": "A short story about a person who needs a form filled out. Include their Name, Age, City, Country, and Profession in the text.",
            "fields": ["Name", "Alter", "Wohnort", "Heimatland", "Beruf"]
          },
          "teil2": {
            "scenario": "The prompt in German (e.g. 'Schreiben Sie eine E-Mail an...')",
            "points": ["Bullet point 1", "Bullet point 2", "Bullet point 3"]
          }
        }
      `;
    } else if (sectionId === 'sprechen') {
      systemInstruction = `
        You are an official Goethe-Institut A1 examiner. Generate a Sprechen (Speaking) exam.
        Topic: ${randomTopic}
        Return JSON exactly like this:
        {
          "teil1": {
            "scenario": "Teil 1: Stellen Sie sich vor. (Introduce yourself.)",
            "points": ["Name", "Alter", "Land", "Wohnort", "Sprachen", "Beruf", "Hobby"]
          },
          "teil2": {
            "scenario": "Teil 2: Um Informationen bitten. (Ask and answer questions.)",
            "theme": "Thema: ${randomTopic}",
            "words": ["Word 1", "Word 2", "Word 3"]
          },
          "teil3": {
            "scenario": "Teil 3: Bitten formulieren. (Make requests and respond.)",
            "objects": ["Object 1", "Object 2", "Object 3"]
          }
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
          contents: 'Generate the exam task in JSON format. Ensure all strings are properly escaped.',
          config: {
            systemInstruction,
            responseMimeType: 'application/json'
          }
        });

        parsed = JSON.parse(response.text || '{}');
        // Check for presence of 'teil1' to validate new structure
        if (parsed && parsed.teil1) {
          return parsed; // Success!
        }
      } catch (e: any) {
        lastError = e;
        console.warn(`Exam generation failed for a key: ${e.message?.substring(0, 120)}`);
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
