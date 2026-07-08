import { 
  PEMETAAN_KATEGORI_TOKOH, 
  DAFTAR_OBFUSCATION, 
  KATA_DASAR_KATEGORI, 
  KAMUS_PENGGANTI_POSITIF,
  DAFTAR_KATA_KASAR
} from './sensorDatabase';

/**
 * Mengambil kata pengganti yang positif secara acak dari database sensor.
 * @param category Kategori kata kotor
 */
export function getRandomReplacement(category: string): string {
  const list = KAMUS_PENGGANTI_POSITIF[category];
  if (!list || list.length === 0) {
    // Fallback jika tidak ada list pengganti
    const defaultList = KAMUS_PENGGANTI_POSITIF['umum_baik'] || ["hebat"];
    return defaultList[Math.floor(Math.random() * defaultList.length)];
  }
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

/**
 * Membuat string pattern regex yang kebal terhadap spasi/simbol tersembunyi di antara huruf (obfuscation).
 * @param word Kata dasar kotor
 */
function generateObfuscatedPatternString(word: string): string {
  const charMap: Record<string, string> = {
    'a': '[a4@]',
    'i': '[i1l!|]',
    'u': '[u]',
    'e': '[e3]',
    'o': '[o0]',
    's': '[s5$]',
    'g': '[g69]',
    't': '[t7]',
    'b': '[b8]',
    'c': '[c]',
    'k': '[k]',
    'n': '[n]',
    'm': '[m]',
    'p': '[p]',
    'r': '[r]',
    'd': '[d]',
    'h': '[h]',
    'j': '[j]',
    'l': '[l1i|]',
    'y': '[y]',
    'w': '[w]'
  };

  const regexParts = [];
  for (let i = 0; i < word.length; i++) {
    const char = word[i].toLowerCase();
    if (char === ' ') {
      regexParts.push('\\s+');
      continue;
    }
    const pattern = charMap[char] || char.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
    regexParts.push(pattern);
  }

  // Izinkan karakter pemisah berupa spasi, tanda hubung, titik, garis bawah, bintang, atau tanda kurung di antara huruf
  const separator = '[\\s\\-_.*()]*';
  return regexParts.join(separator);
}

/**
 * Melakukan pembersihan Leet Speak dan normalisasi teks dasar.
 */
export function normalizeText(text: string): string {
  return text.toLowerCase();
}

/**
 * Filter pesan chat secara cerdas dengan variasi kata positif yang acak (natural randomization).
 * @param text Pesan asli yang dikirim user
 */
export function filterChatMessage(text: string): string {
  if (!text) return "";
  
  let filteredText = text;

  // 1. Tangani obfuscation berbasis kata/frasa utuh terlebih dahulu dari kamus statis
  const sortedObfuscations = Object.keys(DAFTAR_OBFUSCATION).sort((a, b) => b.length - a.length);
  for (const key of sortedObfuscations) {
    const targetWord = DAFTAR_OBFUSCATION[key];
    const regex = new RegExp(key.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&'), 'gi');
    filteredText = filteredText.replace(regex, targetWord);
  }

  // 2. Saring frasa tokoh/instansi terfokus (misal "eri kontol", "prabowo anjing", dll)
  const sortedFrasaTokoh = Object.keys(PEMETAAN_KATEGORI_TOKOH).sort((a, b) => b.length - a.length);
  for (const frasa of sortedFrasaTokoh) {
    const category = PEMETAAN_KATEGORI_TOKOH[frasa];
    const escapedFrasa = frasa.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedFrasa, 'gi');
    if (regex.test(filteredText)) {
      filteredText = filteredText.replace(regex, () => getRandomReplacement(category));
    }
  }

  // 3. Saring kata dasar kotor mandiri secara dinamis dengan obfuscated pattern matching
  const sortedKataDasar = Object.keys(KATA_DASAR_KATEGORI).sort((a, b) => b.length - a.length);
  for (const word of sortedKataDasar) {
    const category = KATA_DASAR_KATEGORI[word];
    
    // Kata kasar yang sangat sensitif/vulgar dan dijamin unik (tidak ada di dalam kata bersih normal)
    const safeWithoutBoundary = [
      "kontol", "memek", "jancok", "jancuk", "dancok", "dancuk", 
      "ngentot", "pepek", "tempik", "tmpk", "tmpek", "itil", "pukimak", 
      "bawok", "bawuk", "bajingan", "goblok", "tolol", "brengsek", 
      "berengsek", "bangsat", "mboet", "congok"
    ].includes(word);

    const regexPattern = generateObfuscatedPatternString(word);
    
    if (safeWithoutBoundary) {
      // Sangat aman dicocokkan langsung tanpa boundary agar jika diselipkan tetap kena filter
      const regex = new RegExp(regexPattern, 'gi');
      if (regex.test(filteredText)) {
        filteredText = filteredText.replace(regex, () => getRandomReplacement(category));
      }
    } else {
      // Menggunakan word boundary agar tidak salah menyaring kata bersih (misal: "mbut" di "lembut"/"rambut", atau "arak" di "masyarakat")
      const regex = new RegExp(`\\b${regexPattern}\\b`, 'gi');
      if (regex.test(filteredText)) {
        filteredText = filteredText.replace(regex, () => getRandomReplacement(category));
      } else {
        // Fallback boundary custom untuk menangani spaced-out kata (misalnya: " m b u t " atau " a r a k ")
        const fallbackRegex = new RegExp(`(?:\\s|^|[^a-zA-Z0-9])${regexPattern}(?:\\s|$|[^a-zA-Z0-9])`, 'gi');
        if (fallbackRegex.test(filteredText)) {
          filteredText = filteredText.replace(fallbackRegex, (match) => {
            const firstChar = match.match(/^[^a-zA-Z0-9]/)?.[0] || '';
            const lastChar = match.match(/[^a-zA-Z0-9]$/)?.[0] || '';
            return firstChar + getRandomReplacement(category) + lastChar;
          });
        }
      }
    }
  }

  // 4. Saring kata kasar tambahan dari DAFTAR_KATA_KASAR jika belum tersaring
  for (const word of DAFTAR_KATA_KASAR) {
    const escapedWord = word.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
    if (regex.test(filteredText)) {
      filteredText = filteredText.replace(regex, () => getRandomReplacement('umum_baik'));
    }
  }

  return filteredText;
}
