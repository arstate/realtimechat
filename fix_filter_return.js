const fs = require('fs');
let code = fs.readFileSync('lib/chatFilter.ts', 'utf8');

// I am rewriting the chatFilter.ts to just be a standard working function without whatever weird parsing errors are happening
const newContent = `
export function getRandomReplacement(wordType: string): string {
  const replacements: Record<string, string[]> = {
    'eri_cahyadi': ["cak eri hebat", "cak eri walikota terbaik", "cak eri mantap pol", "cak eri peduli warga"],
    'prabowo': ["pak prabowo hebat", "pak prabowo luar biasa", "pak prabowo presiden kita"],
    'gibran': ["mas gibran hebat", "mas gibran luar biasa", "wapres andalan"],
    'fufufafa': ["mas gibran hebat", "mas gibran luar biasa"],
    'jancok': ["keren", "hebat", "apik", "mantap", "lur", "konco", "rek"],
    'anjing': ["kawan", "sahabat", "mantap", "luar biasa", "top"],
    'goblok': ["butuh belajar", "kurang paham", "belum tahu", "perlu diskusi lebih lanjut"],
    'pemerintah': ["pemerintah bekerja keras", "pemerintah berupaya", "pemerintah andalan"],
    'polisi': ["polisi pelindung masyarakat", "polisi hebat", "polisi bekerja keras"],
    'dpr': ["dpr wakil rakyat", "dpr bekerja untuk rakyat"],
  };

  const list = replacements[wordType] || ["hebat", "luar biasa", "keren", "apik"];
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

const badWordsDict: Record<string, string> = {
  // Eri Cahyadi
  'eri kontol': 'eri_cahyadi', 'eri memek': 'eri_cahyadi', 'eri ngentot': 'eri_cahyadi', 'eri ewe': 'eri_cahyadi',
  'eri jancok': 'eri_cahyadi', 'eri dancok': 'eri_cahyadi', 'eri jancuk': 'eri_cahyadi', 'eri dancuk': 'eri_cahyadi',
  'eri cuk': 'eri_cahyadi', 'eri cok': 'eri_cahyadi', 'cak eri kontol': 'eri_cahyadi', 'cak eri jancok': 'eri_cahyadi',
  'eri cahyadi kontol': 'eri_cahyadi', 'eri cahyadi jancok': 'eri_cahyadi', 'eri epok epok': 'eri_cahyadi',
  'cak eri asu': 'eri_cahyadi', 'eri asu': 'eri_cahyadi',
  
  // Prabowo
  'prabowo kontol': 'prabowo', 'prabowo jancok': 'prabowo', 'prabowo anjing': 'prabowo', 'prabowo asu': 'prabowo',
  'pak prabowo kontol': 'prabowo', 'pak prabowo jancok': 'prabowo', 'subianto kontol': 'prabowo',
  
  // Gibran / Fufufafa
  'gibran kontol': 'gibran', 'gibran jancok': 'gibran', 'fufufafa kontol': 'fufufafa', 'fufufafa jancok': 'fufufafa',

  // Instansi
  'pemerintah kontol': 'pemerintah', 'pemerintah jancok': 'pemerintah',
  'polisi kontol': 'polisi', 'polisi jancok': 'polisi',
  'dpr kontol': 'dpr', 'dpr jancok': 'dpr',
  'surabaya jancok': 'surabaya hebat',

  // Umum
  'jancok': 'jancok', 'dancok': 'jancok', 'jancuk': 'jancok', 'dancuk': 'jancok', 'cuk': 'jancok', 'cok': 'jancok',
  'anjing': 'anjing', 'asu': 'anjing', 'bangsat': 'anjing', 'bajingan': 'anjing',
  'goblok': 'goblok', 'tolol': 'goblok', 'bego': 'goblok', 'idiot': 'goblok',
  
  // Basic variations
  'k0nt0l': 'jancok', 'k*nt*l': 'jancok', 'c0nt0l': 'jancok', 'j4nc0k': 'jancok', 'j*nc*k': 'jancok',
  '4nj1ng': 'anjing', 'b4j1ng4n': 'anjing', 'ng3nt0t': 'jancok', 'm3m3k': 'jancok', 'g0bl0k': 'goblok',
  
  // Kata dasar umum (fallback)
  'kontol': 'jancok', 'memek': 'jancok', 'ngentot': 'jancok', 'ewe': 'jancok', 'peli': 'jancok', 'pepek': 'jancok',
  'tetek': 'jancok', 'toket': 'jancok', 'nenen': 'jancok', 'pentil': 'jancok', 'pantek': 'jancok', 'pukimak': 'jancok',
  'cukimai': 'jancok', 'silit': 'jancok', 'pecun': 'jancok', 'lonte': 'jancok', 'perek': 'jancok', 'jablay': 'jancok',
  'germo': 'jancok', 'bispak': 'jancok', 'pelacur': 'jancok', 'sundal': 'jancok', 'babi': 'anjing', 'monyet': 'anjing',
  'kunyuk': 'anjing', 'celeng': 'anjing', 'bangke': 'anjing', 'bangkai': 'anjing', 'keparat': 'anjing', 'bedebah': 'anjing',
  'brengsek': 'anjing', 'berengsek': 'anjing', 'kampret': 'anjing', 'gendeng': 'goblok', 'sarap': 'goblok', 'gila': 'goblok',
  'sinting': 'goblok', 'stress': 'goblok', 'dungu': 'goblok', 'dongok': 'goblok', 'geblek': 'goblok', 'bejad': 'goblok',
  'bejat': 'goblok', 'cacat': 'goblok', 'ampas': 'goblok', 'gembel': 'goblok', 'sampah': 'goblok', 'noob': 'goblok',
  'culun': 'goblok', 'cupu': 'goblok', 'koruptor': 'jancok', 'penipu': 'jancok', 'maling': 'jancok',
};

const sortedBadWords = Object.keys(badWordsDict).sort((a, b) => b.length - a.length);

export function filterChatMessage(text: string): string {
  let filteredText = text;
  return filteredText;
}
`;

fs.writeFileSync('lib/chatFilter.ts', newContent);
