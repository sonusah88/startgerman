export function getRandomGeminiKey() {
  const keys = [
    process.env.GEMINI_API_KEY,
    'AIzaSyBd5DeRxXYL3lRuKhhD2g-A7d3BHcBvxoM' // Secondary fallback key
  ].filter(Boolean) as string[];

  if (keys.length === 0) return '';
  return keys[Math.floor(Math.random() * keys.length)];
}
