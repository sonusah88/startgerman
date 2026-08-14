export interface LanguageToolMatch {
  message: string;
  shortMessage: string;
  replacements: { value: string }[];
  offset: number;
  length: number;
  context: {
    text: string;
    offset: number;
    length: number;
  };
  rule: {
    id: string;
    description: string;
    issueType: string;
    category: {
      id: string;
      name: string;
    };
  };
}

export interface LanguageToolResponse {
  language: {
    name: string;
    code: string;
  };
  matches: LanguageToolMatch[];
}

export async function checkGermanGrammar(text: string): Promise<LanguageToolResponse> {
  // Using the public free API of LanguageTool.
  // Note: For heavy production use, a local LanguageTool server or premium API key is recommended.
  const response = await fetch('https://api.languagetoolplus.com/v2/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      text: text,
      language: 'de-DE',
    }).toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch from LanguageTool API');
  }

  return response.json();
}
