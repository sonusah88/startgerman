// Verbformen API client - for structured vocabulary with CEFR levels and IPA
// Falls back to a comprehensive local conjugation engine

export interface VerbformenResult {
  word: string;
  partOfSpeech: string;
  cefrLevel: string;
  ipa: string;
  translations: string[];
  gender?: string;
  plural?: string;
  conjugations?: Record<string, Record<string, string>>;
  declensions?: Record<string, Record<string, string>>;
}

// Comprehensive German verb conjugation engine
const IRREGULAR_VERBS: Record<string, any> = {
  sein: {
    present: { ich: 'bin', du: 'bist', 'er/sie/es': 'ist', wir: 'sind', ihr: 'seid', 'sie/Sie': 'sind' },
    preterite: { ich: 'war', du: 'warst', 'er/sie/es': 'war', wir: 'waren', ihr: 'wart', 'sie/Sie': 'waren' },
    perfect: { participle: 'gewesen', auxiliary: 'sein' },
    imperative: { du: 'sei', ihr: 'seid', Sie: 'seien Sie' }
  },
  haben: {
    present: { ich: 'habe', du: 'hast', 'er/sie/es': 'hat', wir: 'haben', ihr: 'habt', 'sie/Sie': 'haben' },
    preterite: { ich: 'hatte', du: 'hattest', 'er/sie/es': 'hatte', wir: 'hatten', ihr: 'hattet', 'sie/Sie': 'hatten' },
    perfect: { participle: 'gehabt', auxiliary: 'haben' },
    imperative: { du: 'hab', ihr: 'habt', Sie: 'haben Sie' }
  },
  werden: {
    present: { ich: 'werde', du: 'wirst', 'er/sie/es': 'wird', wir: 'werden', ihr: 'werdet', 'sie/Sie': 'werden' },
    preterite: { ich: 'wurde', du: 'wurdest', 'er/sie/es': 'wurde', wir: 'wurden', ihr: 'wurdet', 'sie/Sie': 'wurden' },
    perfect: { participle: 'geworden', auxiliary: 'sein' },
    imperative: { du: 'werde', ihr: 'werdet', Sie: 'werden Sie' }
  },
  gehen: {
    present: { ich: 'gehe', du: 'gehst', 'er/sie/es': 'geht', wir: 'gehen', ihr: 'geht', 'sie/Sie': 'gehen' },
    preterite: { ich: 'ging', du: 'gingst', 'er/sie/es': 'ging', wir: 'gingen', ihr: 'gingt', 'sie/Sie': 'gingen' },
    perfect: { participle: 'gegangen', auxiliary: 'sein' },
    imperative: { du: 'geh', ihr: 'geht', Sie: 'gehen Sie' }
  },
  kommen: {
    present: { ich: 'komme', du: 'kommst', 'er/sie/es': 'kommt', wir: 'kommen', ihr: 'kommt', 'sie/Sie': 'kommen' },
    preterite: { ich: 'kam', du: 'kamst', 'er/sie/es': 'kam', wir: 'kamen', ihr: 'kamt', 'sie/Sie': 'kamen' },
    perfect: { participle: 'gekommen', auxiliary: 'sein' },
    imperative: { du: 'komm', ihr: 'kommt', Sie: 'kommen Sie' }
  },
  machen: {
    present: { ich: 'mache', du: 'machst', 'er/sie/es': 'macht', wir: 'machen', ihr: 'macht', 'sie/Sie': 'machen' },
    preterite: { ich: 'machte', du: 'machtest', 'er/sie/es': 'machte', wir: 'machten', ihr: 'machtet', 'sie/Sie': 'machten' },
    perfect: { participle: 'gemacht', auxiliary: 'haben' },
    imperative: { du: 'mach', ihr: 'macht', Sie: 'machen Sie' }
  },
  sprechen: {
    present: { ich: 'spreche', du: 'sprichst', 'er/sie/es': 'spricht', wir: 'sprechen', ihr: 'sprecht', 'sie/Sie': 'sprechen' },
    preterite: { ich: 'sprach', du: 'sprachst', 'er/sie/es': 'sprach', wir: 'sprachen', ihr: 'spracht', 'sie/Sie': 'sprachen' },
    perfect: { participle: 'gesprochen', auxiliary: 'haben' },
    imperative: { du: 'sprich', ihr: 'sprecht', Sie: 'sprechen Sie' }
  },
  essen: {
    present: { ich: 'esse', du: 'isst', 'er/sie/es': 'isst', wir: 'essen', ihr: 'esst', 'sie/Sie': 'essen' },
    preterite: { ich: 'aß', du: 'aßt', 'er/sie/es': 'aß', wir: 'aßen', ihr: 'aßt', 'sie/Sie': 'aßen' },
    perfect: { participle: 'gegessen', auxiliary: 'haben' },
    imperative: { du: 'iss', ihr: 'esst', Sie: 'essen Sie' }
  },
  trinken: {
    present: { ich: 'trinke', du: 'trinkst', 'er/sie/es': 'trinkt', wir: 'trinken', ihr: 'trinkt', 'sie/Sie': 'trinken' },
    preterite: { ich: 'trank', du: 'trankst', 'er/sie/es': 'trank', wir: 'tranken', ihr: 'trankt', 'sie/Sie': 'tranken' },
    perfect: { participle: 'getrunken', auxiliary: 'haben' },
    imperative: { du: 'trink', ihr: 'trinkt', Sie: 'trinken Sie' }
  },
  lesen: {
    present: { ich: 'lese', du: 'liest', 'er/sie/es': 'liest', wir: 'lesen', ihr: 'lest', 'sie/Sie': 'lesen' },
    preterite: { ich: 'las', du: 'last', 'er/sie/es': 'las', wir: 'lasen', ihr: 'last', 'sie/Sie': 'lasen' },
    perfect: { participle: 'gelesen', auxiliary: 'haben' },
    imperative: { du: 'lies', ihr: 'lest', Sie: 'lesen Sie' }
  },
  schreiben: {
    present: { ich: 'schreibe', du: 'schreibst', 'er/sie/es': 'schreibt', wir: 'schreiben', ihr: 'schreibt', 'sie/Sie': 'schreiben' },
    preterite: { ich: 'schrieb', du: 'schriebst', 'er/sie/es': 'schrieb', wir: 'schrieben', ihr: 'schriebt', 'sie/Sie': 'schrieben' },
    perfect: { participle: 'geschrieben', auxiliary: 'haben' },
    imperative: { du: 'schreib', ihr: 'schreibt', Sie: 'schreiben Sie' }
  },
  fahren: {
    present: { ich: 'fahre', du: 'fährst', 'er/sie/es': 'fährt', wir: 'fahren', ihr: 'fahrt', 'sie/Sie': 'fahren' },
    preterite: { ich: 'fuhr', du: 'fuhrst', 'er/sie/es': 'fuhr', wir: 'fuhren', ihr: 'fuhrt', 'sie/Sie': 'fuhren' },
    perfect: { participle: 'gefahren', auxiliary: 'sein' },
    imperative: { du: 'fahr', ihr: 'fahrt', Sie: 'fahren Sie' }
  },
  schlafen: {
    present: { ich: 'schlafe', du: 'schläfst', 'er/sie/es': 'schläft', wir: 'schlafen', ihr: 'schlaft', 'sie/Sie': 'schlafen' },
    preterite: { ich: 'schlief', du: 'schliefst', 'er/sie/es': 'schlief', wir: 'schliefen', ihr: 'schlieft', 'sie/Sie': 'schliefen' },
    perfect: { participle: 'geschlafen', auxiliary: 'haben' },
    imperative: { du: 'schlaf', ihr: 'schlaft', Sie: 'schlafen Sie' }
  },
  sehen: {
    present: { ich: 'sehe', du: 'siehst', 'er/sie/es': 'sieht', wir: 'sehen', ihr: 'seht', 'sie/Sie': 'sehen' },
    preterite: { ich: 'sah', du: 'sahst', 'er/sie/es': 'sah', wir: 'sahen', ihr: 'saht', 'sie/Sie': 'sahen' },
    perfect: { participle: 'gesehen', auxiliary: 'haben' },
    imperative: { du: 'sieh', ihr: 'seht', Sie: 'sehen Sie' }
  },
  wissen: {
    present: { ich: 'weiß', du: 'weißt', 'er/sie/es': 'weiß', wir: 'wissen', ihr: 'wisst', 'sie/Sie': 'wissen' },
    preterite: { ich: 'wusste', du: 'wusstest', 'er/sie/es': 'wusste', wir: 'wussten', ihr: 'wusstet', 'sie/Sie': 'wussten' },
    perfect: { participle: 'gewusst', auxiliary: 'haben' },
    imperative: { du: 'wisse', ihr: 'wisst', Sie: 'wissen Sie' }
  },
  können: {
    present: { ich: 'kann', du: 'kannst', 'er/sie/es': 'kann', wir: 'können', ihr: 'könnt', 'sie/Sie': 'können' },
    preterite: { ich: 'konnte', du: 'konntest', 'er/sie/es': 'konnte', wir: 'konnten', ihr: 'konntet', 'sie/Sie': 'konnten' },
    perfect: { participle: 'gekonnt', auxiliary: 'haben' },
  },
  müssen: {
    present: { ich: 'muss', du: 'musst', 'er/sie/es': 'muss', wir: 'müssen', ihr: 'müsst', 'sie/Sie': 'müssen' },
    preterite: { ich: 'musste', du: 'musstest', 'er/sie/es': 'musste', wir: 'mussten', ihr: 'musstet', 'sie/Sie': 'mussten' },
    perfect: { participle: 'gemusst', auxiliary: 'haben' },
  },
  wollen: {
    present: { ich: 'will', du: 'willst', 'er/sie/es': 'will', wir: 'wollen', ihr: 'wollt', 'sie/Sie': 'wollen' },
    preterite: { ich: 'wollte', du: 'wolltest', 'er/sie/es': 'wollte', wir: 'wollten', ihr: 'wolltet', 'sie/Sie': 'wollten' },
    perfect: { participle: 'gewollt', auxiliary: 'haben' },
  },
  mögen: {
    present: { ich: 'mag', du: 'magst', 'er/sie/es': 'mag', wir: 'mögen', ihr: 'mögt', 'sie/Sie': 'mögen' },
    preterite: { ich: 'mochte', du: 'mochtest', 'er/sie/es': 'mochte', wir: 'mochten', ihr: 'mochtet', 'sie/Sie': 'mochten' },
    perfect: { participle: 'gemocht', auxiliary: 'haben' },
  },
  dürfen: {
    present: { ich: 'darf', du: 'darfst', 'er/sie/es': 'darf', wir: 'dürfen', ihr: 'dürft', 'sie/Sie': 'dürfen' },
    preterite: { ich: 'durfte', du: 'durftest', 'er/sie/es': 'durfte', wir: 'durften', ihr: 'durftet', 'sie/Sie': 'durften' },
    perfect: { participle: 'gedurft', auxiliary: 'haben' },
  },
  sollen: {
    present: { ich: 'soll', du: 'sollst', 'er/sie/es': 'soll', wir: 'sollen', ihr: 'sollt', 'sie/Sie': 'sollen' },
    preterite: { ich: 'sollte', du: 'solltest', 'er/sie/es': 'sollte', wir: 'sollten', ihr: 'solltet', 'sie/Sie': 'sollten' },
    perfect: { participle: 'gesollt', auxiliary: 'haben' },
  },
};

function conjugateRegular(stem: string, verb: string) {
  const endsInT = stem.endsWith('t') || stem.endsWith('d');
  const eInsert = endsInT ? 'e' : '';
  return {
    present: {
      ich: `${stem}e`, du: `${stem}${eInsert}st`, 'er/sie/es': `${stem}${eInsert}t`,
      wir: `${verb}`, ihr: `${stem}${eInsert}t`, 'sie/Sie': `${verb}`
    },
    preterite: {
      ich: `${stem}${eInsert}te`, du: `${stem}${eInsert}test`, 'er/sie/es': `${stem}${eInsert}te`,
      wir: `${stem}${eInsert}ten`, ihr: `${stem}${eInsert}tet`, 'sie/Sie': `${stem}${eInsert}ten`
    },
    perfect: { participle: `ge${stem}t`, auxiliary: 'haben' },
    imperative: { du: `${stem}(e)`, ihr: `${stem}${eInsert}t`, Sie: `${verb} Sie` }
  };
}

export function getConjugation(verb: string): Record<string, any> | null {
  const lower = verb.toLowerCase().trim();
  if (IRREGULAR_VERBS[lower]) return IRREGULAR_VERBS[lower];

  // Regular verb conjugation
  if (lower.endsWith('en')) {
    const stem = lower.slice(0, -2);
    return conjugateRegular(stem, lower);
  }
  if (lower.endsWith('n')) {
    const stem = lower.slice(0, -1);
    return conjugateRegular(stem, lower);
  }
  return null;
}

export async function lookupVerbformen(word: string): Promise<VerbformenResult | null> {
  // Try Verbformen/Parse.bot API if key exists
  const apiKey = process.env.VERBFORMEN_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch(`https://api.parse.bot/verbformen/search?q=${encodeURIComponent(word)}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      console.error('Verbformen API error:', e);
    }
  }

  // Local conjugation fallback
  const conj = getConjugation(word);
  if (conj) {
    return {
      word,
      partOfSpeech: 'verb',
      cefrLevel: 'A1',
      ipa: '',
      translations: [],
      conjugations: conj as any,
    };
  }

  return null;
}
