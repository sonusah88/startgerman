export async function translateText(text: string, targetLang: 'EN' | 'DE' = 'EN'): Promise<string> {
  const deeplKey = process.env.DEEPL_API_KEY;

  if (deeplKey) {
    // DeepL API Integration
    const url = deeplKey.endsWith(':fx') 
      ? 'https://api-free.deepl.com/v2/translate'
      : 'https://api.deepl.com/v2/translate';
      
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${deeplKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text,
        target_lang: targetLang,
      }).toString(),
    });

    if (!res.ok) throw new Error('DeepL translation failed');
    const data = await res.json();
    return data.translations[0]?.text || '';
  }

  // Fallback to MyMemory open API
  try {
    const langPair = targetLang === 'EN' ? 'de|en' : 'en|de';
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`);
    if (!res.ok) throw new Error('Fallback translation failed');
    const data = await res.json();
    
    if (data.responseStatus !== 200) {
      throw new Error(data.responseDetails);
    }
    
    return data.responseData.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return `[Translation unavailable for: ${text}]`;
  }
}
