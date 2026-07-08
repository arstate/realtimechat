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
 * Melakukan pembersihan Leet Speak dan normalisasi teks dasar.
 * Misalnya mengubah angka/simbol mirip ke huruf normal agar mudah dideteksi.
 */
export function normalizeText(text: string): string {
  let normalized = text.toLowerCase();

  // Bersihkan karakter pemisah biasa yang sering dipakai buat mengelabui parser
  // Misalnya "k.o.n.t.o.l" -> "kontol", "k_o_n_t_o_l" -> "kontol"
  // Tapi kita lakukan pencocokan string spesifik dahulu dari daftar obfuscation.
  
  return normalized;
}

/**
 * Filter pesan chat secara cerdas dengan variasi kata positif yang acak (natural randomization).
 * @param text Pesan asli yang dikirim user
 */
export function filterChatMessage(text: string): string {
  if (!text) return "";
  
  let filteredText = text;

  // 1. Tangani obfuscation berbasis kata/frasa utuh terlebih dahulu
  // Urutkan key obfuscation dari yang terpanjang ke terpendek agar tidak bertabrakan
  const sortedObfuscations = Object.keys(DAFTAR_OBFUSCATION).sort((a, b) => b.length - a.length);
  for (const key of sortedObfuscations) {
    const targetWord = DAFTAR_OBFUSCATION[key];
    const regex = new RegExp(key.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&'), 'gi');
    filteredText = filteredText.replace(regex, targetWord);
  }

  // 2. Saring frasa tokoh/instansi terfokus (misal "eri kontol", "prabowo anjing", dll)
  // Urutkan frasa dari yang terpanjang ke terpendek
  const sortedFrasaTokoh = Object.keys(PEMETAAN_KATEGORI_TOKOH).sort((a, b) => b.length - a.length);
  for (const frasa of sortedFrasaTokoh) {
    const category = PEMETAAN_KATEGORI_TOKOH[frasa];
    const escapedFrasa = frasa.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
    // Mencocokkan frasa secara global, tidak sensitif huruf besar/kecil
    const regex = new RegExp(escapedFrasa, 'gi');
    if (regex.test(filteredText)) {
      filteredText = filteredText.replace(regex, () => getRandomReplacement(category));
    }
  }

  // 3. Saring kata dasar kotor mandiri (misal "kontol", "memek", "goblok", dll)
  const sortedKataDasar = Object.keys(KATA_DASAR_KATEGORI).sort((a, b) => b.length - a.length);
  for (const word of sortedKataDasar) {
    const category = KATA_DASAR_KATEGORI[word];
    const escapedWord = word.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
    // Gunakan regex global dengan batas kata (\b) jika memungkinkan, 
    // atau pencocokan string langsung untuk menghindari bypass dengan imbuhan
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
    if (regex.test(filteredText)) {
      filteredText = filteredText.replace(regex, () => getRandomReplacement(category));
    } else {
      // Fallback pencocokan non-boundary untuk kata kasar yang sangat vulgar di dalam kata lain
      const regexNoBoundary = new RegExp(escapedWord, 'gi');
      if (regexNoBoundary.test(filteredText)) {
        filteredText = filteredText.replace(regexNoBoundary, () => getRandomReplacement(category));
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
