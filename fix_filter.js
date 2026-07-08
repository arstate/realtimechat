const fs = require('fs');

const content = `export function getRandomReplacement(wordType: string): string {
  const replacements: Record<string, string[]> = {
    'eri_cahyadi': [
      "cak eri hebat", 
      "cak eri walikota terbaik", 
      "cak eri mantap pol", 
      "cak eri peduli warga"
    ],
    'prabowo': [
      "pak prabowo hebat", 
      "pak prabowo presiden kita", 
      "pak prabowo luar biasa"
    ],
    'gibran': [
      "mas gibran hebat", 
      "mas gibran luar biasa", 
      "wapres andalan"
    ],
    'fufufafa': [
      "mas gibran hebat", 
      "mas gibran luar biasa"
    ],
    'jancok': [
      "keren", 
      "hebat", 
      "apik", 
      "mantap", 
      "lur", 
      "konco", 
      "rek"
    ],
    'anjing': [
      "kawan", 
      "sahabat", 
      "mantap", 
      "luar biasa", 
      "top"
    ],
    'goblok': [
      "butuh belajar", 
      "kurang paham konsepnya", 
      "belum tahu", 
      "perlu diskusi lebih lanjut"
    ],
    'pemerintah': [
      "pemerintah bekerja keras", 
      "pemerintah berupaya", 
      "pemerintah andalan"
    ],
    'polisi': [
      "polisi pelindung masyarakat", 
      "polisi hebat", 
      "polisi bekerja keras"
    ],
    'dpr': [
      "dpr wakil rakyat", 
      "dpr bekerja untuk rakyat"
    ],
    'surabaya': [
      "surabaya hebat", 
      "surabaya kota pahlawan", 
      "surabaya asri dan bersih", 
      "surabaya keren pol"
    ]
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
  'cak eri asu': 'eri_cahyadi', 'eri asu': 'eri_cahyadi', 'eri peli': 'eri_cahyadi', 'eri pepek': 'eri_cahyadi', 
  'eri tetek': 'eri_cahyadi', 'eri toket': 'eri_cahyadi', 'eri nenen': 'eri_cahyadi', 'eri pentil': 'eri_cahyadi', 
  'eri pantek': 'eri_cahyadi', 'eri pukimak': 'eri_cahyadi', 'eri cukimai': 'eri_cahyadi', 'eri silit': 'eri_cahyadi', 
  'eri pecun': 'eri_cahyadi', 'eri lonte': 'eri_cahyadi', 'eri perek': 'eri_cahyadi', 'eri jablay': 'eri_cahyadi', 
  'eri germo': 'eri_cahyadi', 'eri bispak': 'eri_cahyadi', 'eri pelacur': 'eri_cahyadi', 'eri sundal': 'eri_cahyadi', 
  'eri anjing': 'eri_cahyadi', 'eri bajingan': 'eri_cahyadi', 'eri bangsat': 'eri_cahyadi', 'eri babi': 'eri_cahyadi', 
  'eri monyet': 'eri_cahyadi', 'eri kunyuk': 'eri_cahyadi', 'eri celeng': 'eri_cahyadi', 'eri bangke': 'eri_cahyadi', 
  'eri bangkai': 'eri_cahyadi', 'eri keparat': 'eri_cahyadi',
  
  // Prabowo
  'prabowo kontol': 'prabowo', 'prabowo memek': 'prabowo', 'prabowo ngentot': 'prabowo', 'prabowo ewe': 'prabowo', 
  'prabowo jancok': 'prabowo', 'prabowo dancok': 'prabowo', 'prabowo jancuk': 'prabowo', 'prabowo dancuk': 'prabowo', 
  'prabowo cuk': 'prabowo', 'prabowo cok': 'prabowo', 'prabowo peli': 'prabowo', 'prabowo pepek': 'prabowo', 
  'prabowo tetek': 'prabowo', 'prabowo toket': 'prabowo', 'prabowo nenen': 'prabowo', 'prabowo pentil': 'prabowo', 
  'prabowo pantek': 'prabowo', 'prabowo pukimak': 'prabowo', 'prabowo cukimai': 'prabowo', 'prabowo silit': 'prabowo', 
  'prabowo pecun': 'prabowo', 'prabowo lonte': 'prabowo', 'prabowo perek': 'prabowo', 'prabowo jablay': 'prabowo', 
  'prabowo germo': 'prabowo', 'prabowo bispak': 'prabowo', 'prabowo pelacur': 'prabowo', 'prabowo sundal': 'prabowo',
  'prabowo anjing': 'prabowo', 'prabowo asu': 'prabowo', 'pak prabowo kontol': 'prabowo', 'pak prabowo jancok': 'prabowo', 
  'subianto kontol': 'prabowo',
  
  // Gibran / Fufufafa
  'gibran kontol': 'gibran', 'gibran memek': 'gibran', 'gibran ngentot': 'gibran', 'gibran ewe': 'gibran', 
  'gibran jancok': 'gibran', 'gibran dancok': 'gibran', 'gibran jancuk': 'gibran', 'gibran dancuk': 'gibran', 
  'gibran cuk': 'gibran', 'gibran cok': 'gibran', 'gibran peli': 'gibran', 'gibran pepek': 'gibran', 
  'gibran tetek': 'gibran', 'gibran toket': 'gibran', 'gibran nenen': 'gibran',
  'fufufafa kontol': 'fufufafa', 'fufufafa jancok': 'fufufafa',

  // Instansi
  'pemerintah kontol': 'pemerintah', 'pemerintah memek': 'pemerintah', 'pemerintah ngentot': 'pemerintah', 
  'pemerintah ewe': 'pemerintah', 'pemerintah jancok': 'pemerintah', 'pemerintah dancok': 'pemerintah', 
  'pemerintah jancuk': 'pemerintah', 'pemerintah dancuk': 'pemerintah', 'pemerintah cuk': 'pemerintah', 
  'pemerintah cok': 'pemerintah', 'pemerintah peli': 'pemerintah', 'pemerintah pepek': 'pemerintah',
  'polisi kontol': 'polisi', 'polisi jancok': 'polisi',
  'dpr kontol': 'dpr', 'dpr jancok': 'dpr',
  'surabaya jancok': 'surabaya', 'surabaya asu': 'surabaya', 'surabaya kontol': 'surabaya',

  // Umum
  'jancok': 'jancok', 'dancok': 'jancok', 'jancuk': 'jancok', 'dancuk': 'jancok', 'cuk': 'jancok', 'cok': 'jancok', 'ancok': 'jancok', 'ancuk': 'jancok',
  'anjing': 'anjing', 'asu': 'anjing', 'bangsat': 'anjing', 'bajingan': 'anjing', 'ajig': 'anjing', 'anjg': 'anjing', 'anjim': 'anjing', 'anjir': 'anjing', 'anjrit': 'anjing', 'anjrot': 'anjing', 'anying': 'anjing', 'asyu': 'anjing', 'bastard': 'anjing', 'bedebah': 'anjing',
  'goblok': 'goblok', 'tolol': 'goblok', 'bego': 'goblok', 'idiot': 'goblok', 'bahlul': 'goblok', 'balegug': 'goblok',
  
  // Basic variations
  'k0nt0l': 'jancok', 'k*nt*l': 'jancok', 'c0nt0l': 'jancok', 'j4nc0k': 'jancok', 'j*nc*k': 'jancok',
  'k.o.n.t.o.l': 'jancok',
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
  'anal': 'jancok', 'andipang': 'anjing', 'apem': 'jancok', 'babangus': 'anjing', 'bacol': 'jancok', 'bacot': 'anjing', 'bagong': 'anjing', 'banci': 'anjing', 'bandot': 'anjing', 'buaya': 'anjing', 'alay': 'goblok',
};

const sortedBadWords = Object.keys(badWordsDict).sort((a, b) => b.length - a.length);

export function filterChatMessage(text: string): string {
  let filteredText = text;
  
  for (const badWord of sortedBadWords) {
    const escapedBadWord = badWord.replace(/[.*+?^\$\{\}()|[\]\\\\]/g, '\\\\$&');
    const regex = new RegExp(\`\\\\b\${escapedBadWord}\\\\b\`, 'gi');
    
    if (regex.test(filteredText)) {
       const type = badWordsDict[badWord] || 'jancok';
       if (type.includes(' ')) {
         filteredText = filteredText.replace(regex, type);
       } else {
         filteredText = filteredText.replace(regex, getRandomReplacement(type));
       }
    }
  }

  for (const badWord of sortedBadWords) {
    if (badWord.includes('*') || badWord.includes('.') || badWord.includes('0') || badWord.includes('1') || badWord.includes('4')) {
      const escapedBadWord = badWord.replace(/[.*+?^\$\{\}()|[\]\\\\]/g, '\\\\$&');
      const regex = new RegExp(escapedBadWord, 'gi');
      if (regex.test(filteredText)) {
         const type = badWordsDict[badWord] || 'jancok';
         filteredText = filteredText.replace(regex, getRandomReplacement(type));
      }
    }
  }

  return filteredText;
}
`;

fs.writeFileSync('lib/chatFilter.ts', content);
