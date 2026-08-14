export function getAllGeminiKeys() {
  const rawKeys = [
    process.env.GEMINI_API_KEY,
    'AIzaSyBd5DeRxXYL3lRuKhhD2g-A7d3BHcBvxoM' // Secondary fallback key
  ];
  
  return rawKeys
    .filter(Boolean)
    .map(k => (k as string).trim())
    .filter(k => k.length > 0);
}

export function getRandomGeminiKey() {
  const keys = getAllGeminiKeys();
  if (keys.length === 0) return '';
  return keys[Math.floor(Math.random() * keys.length)];
}
