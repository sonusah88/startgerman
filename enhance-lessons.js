import { GoogleGenerativeAI } from '@google/generative-ai';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY not found in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const db = new Database('./sqlite.db');

async function enhanceLessons() {
  const lessons = db.prepare(`SELECT * FROM lessons WHERE type = 'video'`).all();
  
  for (const lesson of lessons) {
    let content;
    try {
      content = JSON.parse(lesson.content);
    } catch(e) {
      continue;
    }

    console.log(`Enhancing: ${lesson.title}...`);
    
    const prompt = `
You are an expert German linguist and cognitive scientist designing the "best and scientific way of learning" for A1 German students.
Based on the lesson title: "${lesson.title}" and original description: "${content.info}", generate an extremely high-quality, scientifically-backed learning breakdown.

Return a JSON object EXACTLY in this format:
{
  "summary": "A concise, engaging summary of the psychological and linguistic goals of this lesson.",
  "vocab": ["word1", "word2", "word3", "word4", "word5"],
  "grammar": ["Key grammar rule 1", "Key grammar rule 2", "Key grammar rule 3"],
  "tips": ["Cognitive science trick to remember 1", "Practical tip 2"]
}

Do not include markdown blocks like \`\`\`json, just pure JSON text. Make the content truly phenomenal and scientifically structured for memory retention.
    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/^\`\`\`json/m, '').replace(/^\`\`\`/m, '');
      const aiData = JSON.parse(text);
      
      content.summary = aiData.summary;
      content.vocab = aiData.vocab;
      content.grammar = aiData.grammar;
      content.tips = aiData.tips;

      db.prepare(`UPDATE lessons SET content = ? WHERE id = ?`).run(JSON.stringify(content), lesson.id);
      console.log(`Successfully enhanced ${lesson.title}`);
    } catch (e) {
      console.error(`Failed to enhance ${lesson.title}:`, e);
    }
  }
}

enhanceLessons().then(() => console.log('Done!'));
