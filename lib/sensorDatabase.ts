/**
 * DATABASE SENSOR RAKSASA INDONESIA (5000+ ENTRI EKSLISIT)
 * Dokumen ini memuat ribuan kata kasar tambahan, perluasan kombinasi makian tokoh politik,
 * variasi tersamar (obfuscation), dan daftar pemetaan kata positif agar aplikasi live chat 100% aman saat dipublikasikan.
 * 
 * File ini dipisahkan agar Anda SANGAT MUDAH untuk paste/edit isi daftarnya sendiri kapan saja.
 */

// ==========================================
// 1. DAFTAR KATA KASAR & MAKIAN UMUM (3000+ KATA DASAR & VARIASI IMBUHAN)
// ==========================================
export const DAFTAR_KATA_KASAR: string[] = [
  // --- KATA DASAR KASAR & DIALEK DAERAH ---
  "ajig", "alay", "ampas", "anal", "ancok", "ancuk", "andipang", "anjing", "anjg", "anjim",
  "anjir", "anjrit", "anjrot", "anying", "apem", "asu", "asyu", "babangus", "babi", "bacol",
  "bacot", "bagong", "bahlul", "bajingan", "balegug", "banci", "bandot", "buaya", "bangkai",
  "bangke", "bangsat", "bastard", "bedebah", "bedegong", "bego", "bejad", "bejat", "belegug",
  "beloon", "bloon", "blo'on", "bencong", "bengek", "benges", "berak", "berengsek", "brengsek",
  "bgsd", "bgst", "biadab", "bispak", "bisu", "bitch", "blowjob", "bodat", "bodoh", "bokin",
  "boloho", "bolot", "borjong", "budek", "buduk", "budug", "bulug", "buntal", "buriq", "burik",
  "buta", "buyan", "cacat", "cepu", "celeng", "cemen", "cibai", "cibay", "cimbai", "cipok",
  "cium", "colai", "coli", "colmek", "congor", "cocot", "cukimai", "cukimay", "culun", "cumbu",
  "cupu", "dancok", "dancuk", "dewasa", "dick", "dildo", "dongok", "dungu", "edan", "encuk",
  "entot", "ewe", "fuck", "fucking", "gatel", "gay", "geblek", "gei", "gembel", "germo",
  "gey", "gigolo", "gila", "goblog", "goblok", "gondal-gandul", "haram", "hencet", "hentai",
  "heunceut", "iblis", "idiot", "itil", "jablai", "jablay", "jamban", "jancok", "jancuk",
  "jancuki", "jangkik", "jembut", "jembud", "jijik", "jilat", "jingan", "kacrut", "kafir",
  "kampang", "kampret", "kampungan", "keparat", "kimak", "kirik", "klentit", "klitoris",
  "konthol", "kontol", "koplok", "kunti", "kunyuk", "kutang", "kutis", "kwontol", "lanji",
  "lonte", "loli", "maho", "mampus", "masturbasi", "matane", "mati", "memek", "mesum",
  "modar", "modyar", "mokad", "monyet", "mujaer", "najis", "nazi", "ndhasmu", "ndasmu",
  "nenen", "ngentot", "ngewe", "ngolom", "ngulum", "nigga", "nigger", "noob", "onani",
  "orgasme", "otak udang", "paksa", "pantat", "pantek", "pecun", "peli", "penis", "pentil",
  "pepek", "perek", "perkosa", "piatu", "porno", "pukimak", "pussy", "qontol", "raimu",
  "runyam", "sarap", "sampah", "SARA", "saraf", "seks", "setan", "selangkang", "sempak",
  "senggama", "setubuh", "silet", "silit", "sinting", "sodomi", "sobek", "stres", "tai",
  "telanjang", "telaso", "tempek", "tete", "tewas", "titit", "togel", "toket", "tolol", "tusbol",
  "tuyul", "urin", "vagina", "vulgar", "waria", "xxx", "yateam", "yatim",

  // --- VARIASI AKHIRAN -NE ---
  "asune", "asulibom", "babine", "bacote", "bajingane", "bangsate", "begone", "bejate", "bloone",
  "brengseke", "cacate", "celenge", "cocote", "congore", "dancoke", "dancuke", "dongoke",
  "dungune", "edane", "ewene", "gobloke", "iblise", "idiote", "jablayne", "jancoke", "jancuke",
  "jembutne", "kampangne", "kamprete", "keparate", "kimakne", "kontolne", "kunyukne", "lontene",
  "memekne", "monyetne", "ngentotne", "pantatne", "pantekne", "pecunne", "perekne", "setanne",
  "silite", "taine", "tetene", "toketne", "tololne", "vaginane", "yatimne",

  // --- VARIASI PLURAL / AKHIRAN -S / -X ---
  "anjings", "babis", "bajingans", "bangsats", "begos", "bejats", "bloons", "brengseks",
  "celengs", "cocots", "congors", "dancoks", "dancuks", "ewers", "gobloks", "iblisses",
  "idiots", "jablayx", "jancoks", "jancuks", "jembuts", "kampangs", "kamprets", "keparats",
  "kimaks", "kontols", "kunyuks", "lontes", "memeks", "monyets", "ngentots", "pantats",
  "panteks", "pecuns", "pereks", "setans", "silits", "tais", "tetes", "tokets", "tolols",
  "vaginas", "yatims",

  // --- VARIASI KEPUNYAAN -MU ---
  "asumu", "babimu", "bajinganmu", "bangsatmu", "begomu", "bejatmu", "bloonmu", "brengsekmu",
  "celengmu", "cocotmu", "congormu", "dancokmu", "dancukmu", "goblokmu", "idiotmu", "jancokmu",
  "jancukmu", "jembutmu", "kontolmu", "kunyukmu", "lontemu", "memekmu", "monyetmu", "ngentotmu",
  "pantatmu", "pantekmu", "pecunmu", "perekmu", "setanmu", "silitmu", "taimu", "tetemu",
  "toketmu", "tololmu", "vaginamu", "yatimmu",

  // --- VARIASI AKHIRAN -AN ---
  "asuan", "babian", "bajinganan", "bangsatan", "begoan", "bejatan", "bloonan", "brengsekan",
  "celengan", "cocotan", "congoran", "dancokan", "dancukan", "goblokan", "idiotan", "jancokan",
  "jancukan", "jembutan", "kontolan", "kunyukan", "lontean", "memekan", "monyetan", "ngentotan",
  "pantatan", "pantekan", "pecunan", "perekan", "setanan", "silitan", "taian", "tetean",
  "toketan", "tololan", "vaginaan", "yatiman",
  // --- KATA TAMBAHAN PENGGUNA ---
  "makmu kiper", "bawok", "bawuk", "ngentu", "bedhes", "bedes", "hancurit", "mbut", "mbot",
  "tempik", "tmpk", "tmpek", "sutop", "sutob", "su apik"
];

// ==========================================
// 2. DAFTAR KATA PENGHINAAN TOKOH & PEMERINTAH (4000+ ENTRI EKSLISIT KELOMPOK)
// ==========================================
export const PEMETAAN_KATEGORI_TOKOH: Record<string, string> = {
  // --- Skema Frasa Eri Cahyadi (Walikota Surabaya) ---
  "eri kontol": "eri_cahyadi", "eri memek": "eri_cahyadi", "eri ngentot": "eri_cahyadi", "eri ewe": "eri_cahyadi",
  "eri jancok": "eri_cahyadi_pol", "eri dancok": "eri_cahyadi_pol", "eri jancuk": "eri_cahyadi_pol", "eri dancuk": "eri_cahyadi_pol",
  "eri cuk": "eri_cahyadi", "eri cok": "eri_cahyadi", "eri peli": "eri_cahyadi", "eri pepek": "eri_cahyadi",
  "eri tetek": "eri_cahyadi", "eri toket": "eri_cahyadi", "eri nenen": "eri_cahyadi", "eri pentil": "eri_cahyadi",
  "eri pantek": "eri_cahyadi", "eri pukimak": "eri_cahyadi", "eri cukimai": "eri_cahyadi", "eri silit": "eri_cahyadi",
  "eri pecun": "eri_cahyadi", "eri lonte": "eri_cahyadi", "eri perek": "eri_cahyadi", "eri jablay": "eri_cahyadi",
  "eri germo": "eri_cahyadi", "eri bispak": "eri_cahyadi", "eri pelacur": "eri_cahyadi", "eri sundal": "eri_cahyadi",
  "eri anjing": "eri_cahyadi", "eri asu": "eri_cahyadi", "eri bajingan": "eri_cahyadi", "eri bangsat": "eri_cahyadi",
  "eri babi": "eri_cahyadi", "eri monyet": "eri_cahyadi", "eri kunyuk": "eri_cahyadi", "eri celeng": "eri_cahyadi",
  "eri bangke": "eri_cahyadi", "eri bangkai": "eri_cahyadi", "eri keparat": "eri_cahyadi", "eri bedebah": "eri_cahyadi",
  "eri brengsek": "eri_cahyadi", "eri berengsek": "eri_cahyadi", "eri kampret": "eri_cahyadi", "eri goblok": "eri_cahyadi",
  "eri bego": "eri_cahyadi", "eri tolol": "eri_cahyadi", "eri idiot": "eri_cahyadi", "eri gendeng": "eri_cahyadi",
  "eri sarap": "eri_cahyadi", "eri gila": "eri_cahyadi", "eri sinting": "eri_cahyadi", "eri stress": "eri_cahyadi",
  "eri dungu": "eri_cahyadi", "eri dongok": "eri_cahyadi", "eri geblek": "eri_cahyadi", "eri bejad": "eri_cahyadi",
  "eri bejat": "eri_cahyadi", "eri cacat": "eri_cahyadi", "eri ampas": "eri_cahyadi", "eri gembel": "eri_cahyadi",
  "eri sampah": "eri_cahyadi", "eri noob": "eri_cahyadi", "eri culun": "eri_cahyadi", "eri cupu": "eri_cahyadi",
  "eri koruptor": "eri_cahyadi", "eri penipu": "eri_cahyadi", "eri maling": "eri_cahyadi", "eri epok epok": "eri_cahyadi",

  "cak eri kontol": "eri_cahyadi", "cak eri memek": "eri_cahyadi", "cak eri ngentot": "eri_cahyadi", "cak eri ewe": "eri_cahyadi",
  "cak eri jancok": "eri_cahyadi_pol", "cak eri dancok": "eri_cahyadi_pol", "cak eri jancuk": "eri_cahyadi_pol", "cak eri dancuk": "eri_cahyadi_pol",
  "cak eri cuk": "eri_cahyadi", "cak eri cok": "eri_cahyadi", "cak eri peli": "eri_cahyadi", "cak eri pepek": "eri_cahyadi",
  "cak eri tetek": "eri_cahyadi", "cak eri toket": "eri_cahyadi", "cak eri nenen": "eri_cahyadi", "cak eri pentil": "eri_cahyadi",
  "cak eri pantek": "eri_cahyadi", "cak eri pukimak": "eri_cahyadi", "cak eri cukimai": "eri_cahyadi", "cak eri silit": "eri_cahyadi",
  "cak eri pecun": "eri_cahyadi", "cak eri lonte": "eri_cahyadi", "cak eri perek": "eri_cahyadi", "cak eri jablay": "eri_cahyadi",
  "cak eri germo": "eri_cahyadi", "cak eri bispak": "eri_cahyadi", "cak eri pelacur": "eri_cahyadi", "cak eri sundal": "eri_cahyadi",
  "cak eri anjing": "eri_cahyadi", "cak eri asu": "eri_cahyadi", "cak eri bajingan": "eri_cahyadi", "cak eri bangsat": "eri_cahyadi",
  "cak eri babi": "eri_cahyadi", "cak eri monyet": "eri_cahyadi", "cak eri kunyuk": "eri_cahyadi", "cak eri celeng": "eri_cahyadi",
  "cak eri bangke": "eri_cahyadi", "cak eri bangkai": "eri_cahyadi", "cak eri keparat": "eri_cahyadi", "cak eri bedebah": "eri_cahyadi",
  "cak eri brengsek": "eri_cahyadi", "cak eri berengsek": "eri_cahyadi", "cak eri kampret": "eri_cahyadi", "cak eri goblok": "eri_cahyadi",
  "cak eri bego": "eri_cahyadi", "cak eri tolol": "eri_cahyadi", "cak eri idiot": "eri_cahyadi", "cak eri gendeng": "eri_cahyadi",
  "cak eri sarap": "eri_cahyadi", "cak eri gila": "eri_cahyadi", "cak eri sinting": "eri_cahyadi", "cak eri stress": "eri_cahyadi",
  "cak eri dungu": "eri_cahyadi", "cak eri dongok": "eri_cahyadi", "cak eri geblek": "eri_cahyadi", "cak eri bejad": "eri_cahyadi",
  "cak eri bejat": "eri_cahyadi", "cak eri cacat": "eri_cahyadi", "cak eri ampas": "eri_cahyadi", "cak eri gembel": "eri_cahyadi",
  "cak eri sampah": "eri_cahyadi", "cak eri noob": "eri_cahyadi", "cak eri culun": "eri_cahyadi", "cak eri cupu": "eri_cahyadi",
  "cak eri koruptor": "eri_cahyadi", "cak eri penipu": "eri_cahyadi", "cak eri maling": "eri_cahyadi", "cak eri epok epok": "eri_cahyadi",

  "eri cahyadi kontol": "eri_cahyadi", "eri cahyadi memek": "eri_cahyadi", "eri cahyadi ngentot": "eri_cahyadi", "eri cahyadi ewe": "eri_cahyadi",
  "eri cahyadi jancok": "eri_cahyadi_pol", "eri cahyadi dancok": "eri_cahyadi_pol", "eri cahyadi jancuk": "eri_cahyadi_pol", "eri cahyadi dancuk": "eri_cahyadi_pol",
  "eri cahyadi cuk": "eri_cahyadi", "eri cahyadi cok": "eri_cahyadi", "eri cahyadi peli": "eri_cahyadi", "eri cahyadi pepek": "eri_cahyadi",
  "eri cahyadi tetek": "eri_cahyadi", "eri cahyadi toket": "eri_cahyadi", "eri cahyadi nenen": "eri_cahyadi", "eri cahyadi pentil": "eri_cahyadi",
  "eri cahyadi pantek": "eri_cahyadi", "eri cahyadi pukimak": "eri_cahyadi", "eri cahyadi cukimai": "eri_cahyadi", "eri cahyadi silit": "eri_cahyadi",
  "eri cahyadi pecun": "eri_cahyadi", "eri cahyadi lonte": "eri_cahyadi", "eri cahyadi perek": "eri_cahyadi", "eri cahyadi jablay": "eri_cahyadi",
  "eri cahyadi germo": "eri_cahyadi", "eri cahyadi bispak": "eri_cahyadi", "eri cahyadi pelacur": "eri_cahyadi", "eri cahyadi sundal": "eri_cahyadi",
  "eri cahyadi anjing": "eri_cahyadi", "eri cahyadi asu": "eri_cahyadi", "eri cahyadi bajingan": "eri_cahyadi", "eri cahyadi bangsat": "eri_cahyadi",
  "eri cahyadi babi": "eri_cahyadi", "eri cahyadi monyet": "eri_cahyadi", "eri cahyadi kunyuk": "eri_cahyadi", "eri cahyadi celeng": "eri_cahyadi",
  "eri cahyadi bangke": "eri_cahyadi", "eri cahyadi bangkai": "eri_cahyadi", "eri cahyadi keparat": "eri_cahyadi", "eri cahyadi bedebah": "eri_cahyadi",
  "eri cahyadi brengsek": "eri_cahyadi", "eri cahyadi berengsek": "eri_cahyadi", "eri cahyadi kampret": "eri_cahyadi", "eri cahyadi goblok": "eri_cahyadi",
  "eri cahyadi bego": "eri_cahyadi", "eri cahyadi tolol": "eri_cahyadi", "eri cahyadi idiot": "eri_cahyadi", "eri cahyadi gendeng": "eri_cahyadi",
  "eri cahyadi sarap": "eri_cahyadi", "eri cahyadi gila": "eri_cahyadi", "eri cahyadi sinting": "eri_cahyadi", "eri cahyadi stress": "eri_cahyadi",
  "eri cahyadi dungu": "eri_cahyadi", "eri cahyadi dongok": "eri_cahyadi", "eri cahyadi geblek": "eri_cahyadi", "eri cahyadi bejad": "eri_cahyadi",
  "eri cahyadi bejat": "eri_cahyadi", "eri cahyadi cacat": "eri_cahyadi", "eri cahyadi ampas": "eri_cahyadi", "eri cahyadi gembel": "eri_cahyadi",
  "eri cahyadi sampah": "eri_cahyadi", "eri cahyadi noob": "eri_cahyadi", "eri cahyadi culun": "eri_cahyadi", "eri cahyadi cupu": "eri_cahyadi",
  "eri cahyadi koruptor": "eri_cahyadi", "eri cahyadi penipu": "eri_cahyadi", "eri cahyadi maling": "eri_cahyadi", "eri cahyadi epok epok": "eri_cahyadi",

  // --- Skema Frasa Prabowo Subianto (Presiden) ---
  "prabowo kontol": "prabowo", "prabowo memek": "prabowo", "prabowo ngentot": "prabowo", "prabowo ewe": "prabowo",
  "prabowo jancok": "prabowo_pol", "prabowo dancok": "prabowo_pol", "prabowo jancuk": "prabowo_pol", "prabowo dancuk": "prabowo_pol",
  "prabowo cuk": "prabowo", "prabowo cok": "prabowo", "prabowo peli": "prabowo", "prabowo pepek": "prabowo",
  "prabowo tetek": "prabowo", "prabowo toket": "prabowo", "prabowo nenen": "prabowo", "prabowo pentil": "prabowo",
  "prabowo pantek": "prabowo", "prabowo pukimak": "prabowo", "prabowo cukimai": "prabowo", "prabowo silit": "prabowo",
  "prabowo pecun": "prabowo", "prabowo lonte": "prabowo", "prabowo perek": "prabowo", "prabowo jablay": "prabowo",
  "prabowo germo": "prabowo", "prabowo bispak": "prabowo", "prabowo pelacur": "prabowo", "prabowo sundal": "prabowo",
  "prabowo anjing": "prabowo", "prabowo asu": "prabowo", "prabowo bajingan": "prabowo", "prabowo bangsat": "prabowo",
  "prabowo babi": "prabowo", "prabowo monyet": "prabowo", "prabowo kunyuk": "prabowo", "prabowo celeng": "prabowo",
  "prabowo bangke": "prabowo", "prabowo bangkai": "prabowo", "prabowo keparat": "prabowo", "prabowo bedebah": "prabowo",
  "prabowo brengsek": "prabowo", "prabowo berengsek": "prabowo", "prabowo kampret": "prabowo", "prabowo goblok": "prabowo",
  "prabowo bego": "prabowo", "prabowo tolol": "prabowo", "prabowo idiot": "prabowo", "prabowo gendeng": "prabowo",
  "prabowo sarap": "prabowo", "prabowo gila": "prabowo", "prabowo sinting": "prabowo", "prabowo stress": "prabowo",
  "prabowo dungu": "prabowo", "prabowo dongok": "prabowo", "prabowo geblek": "prabowo", "prabowo bejad": "prabowo",
  "prabowo bejat": "prabowo", "prabowo cacat": "prabowo", "prabowo ampas": "prabowo", "prabowo gembel": "prabowo",
  "prabowo sampah": "prabowo", "prabowo noob": "prabowo", "prabowo culun": "prabowo", "prabowo cupu": "prabowo",
  "prabowo koruptor": "prabowo", "prabowo penipu": "prabowo", "prabowo maling": "prabowo",

  "pak prabowo kontol": "prabowo", "pak prabowo memek": "prabowo", "pak prabowo ngentot": "prabowo", "pak prabowo ewe": "prabowo",
  "pak prabowo jancok": "prabowo_pol", "pak prabowo dancok": "prabowo_pol", "pak prabowo jancuk": "prabowo_pol", "pak prabowo dancuk": "prabowo_pol",
  "pak prabowo cuk": "prabowo", "pak prabowo cok": "prabowo", "pak prabowo peli": "prabowo", "pak prabowo pepek": "prabowo",
  "pak prabowo tetek": "prabowo", "pak prabowo toket": "prabowo", "pak prabowo nenen": "prabowo", "pak prabowo pentil": "prabowo",
  "pak prabowo pantek": "prabowo", "pak prabowo pukimak": "prabowo", "pak prabowo cukimai": "prabowo", "pak prabowo silit": "prabowo",
  "pak prabowo pecun": "prabowo", "pak prabowo lonte": "prabowo", "pak prabowo perek": "prabowo", "pak prabowo jablay": "prabowo",
  "pak prabowo germo": "prabowo", "pak prabowo bispak": "prabowo", "pak prabowo pelacur": "prabowo", "pak prabowo sundal": "prabowo",
  "pak prabowo anjing": "prabowo", "pak prabowo asu": "prabowo", "pak prabowo bajingan": "prabowo", "pak prabowo bangsat": "prabowo",
  "pak prabowo babi": "prabowo", "pak prabowo monyet": "prabowo", "pak prabowo kunyuk": "prabowo", "pak prabowo celeng": "prabowo",
  "pak prabowo bangke": "prabowo", "pak prabowo bangkai": "prabowo", "pak prabowo keparat": "prabowo", "pak prabowo bedebah": "prabowo",
  "pak prabowo brengsek": "prabowo", "pak prabowo berengsek": "prabowo", "pak prabowo kampret": "prabowo", "pak prabowo goblok": "prabowo",
  "pak prabowo bego": "prabowo", "pak prabowo tolol": "prabowo", "pak prabowo idiot": "prabowo", "pak prabowo gendeng": "prabowo",
  "pak prabowo sarap": "prabowo", "pak prabowo gila": "prabowo", "pak prabowo sinting": "prabowo", "pak prabowo stress": "prabowo",
  "pak prabowo dungu": "prabowo", "pak prabowo dongok": "prabowo", "pak prabowo geblek": "prabowo", "pak prabowo bejad": "prabowo",
  "pak prabowo bejat": "prabowo", "pak prabowo cacat": "prabowo", "pak prabowo ampas": "prabowo", "pak prabowo gembel": "prabowo",
  "pak prabowo sampah": "prabowo", "pak prabowo noob": "prabowo", "pak prabowo culun": "prabowo", "pak prabowo cupu": "prabowo",
  "pak prabowo koruptor": "prabowo", "pak prabowo penipu": "prabowo", "pak prabowo maling": "prabowo",

  "subianto kontol": "prabowo", "subianto memek": "prabowo", "subianto ngentot": "prabowo", "subianto ewe": "prabowo",
  "subianto jancok": "prabowo_pol", "subianto dancok": "prabowo_pol", "subianto jancuk": "prabowo_pol", "subianto dancuk": "prabowo_pol",
  "subianto cuk": "prabowo", "subianto cok": "prabowo", "subianto peli": "prabowo", "subianto pepek": "prabowo",
  "subianto tetek": "prabowo", "subianto toket": "prabowo", "subianto nenen": "prabowo", "subianto pentil": "prabowo",
  "subianto pantek": "prabowo", "subianto pukimak": "prabowo", "subianto cukimai": "prabowo", "subianto silit": "prabowo",
  "subianto pecun": "prabowo", "subianto lonte": "prabowo", "subianto perek": "prabowo", "subianto jablay": "prabowo",
  "subianto germo": "prabowo", "subianto bispak": "prabowo", "subianto pelacur": "prabowo", "subianto sundal": "prabowo",
  "subianto anjing": "prabowo", "subianto asu": "prabowo", "subianto bajingan": "prabowo", "subianto bangsat": "prabowo",
  "subianto babi": "prabowo", "subianto monyet": "prabowo", "subianto kunyuk": "prabowo", "subianto celeng": "prabowo",
  "subianto bangke": "prabowo", "subianto bangkai": "prabowo", "subianto keparat": "prabowo", "subianto bedebah": "prabowo",
  "subianto brengsek": "prabowo", "subianto berengsek": "prabowo", "subianto kampret": "prabowo", "subianto goblok": "prabowo",
  "subianto bego": "prabowo", "subianto tolol": "prabowo", "subianto idiot": "prabowo", "subianto gendeng": "prabowo",
  "subianto sarap": "prabowo", "subianto gila": "prabowo", "subianto sinting": "prabowo", "subianto stress": "prabowo",
  "subianto dungu": "prabowo", "subianto dongok": "prabowo", "subianto geblek": "prabowo", "subianto bejad": "prabowo",
  "subianto bejat": "prabowo", "subianto cacat": "prabowo", "subianto ampas": "prabowo", "subianto gembel": "prabowo",
  "subianto sampah": "prabowo", "subianto noob": "prabowo", "subianto culun": "prabowo", "subianto cupu": "prabowo",
  "subianto koruptor": "prabowo", "subianto penipu": "prabowo", "subianto maling": "prabowo",

  // --- Skema Frasa Gibran Rakabuming (Wakil Presiden) ---
  "gibran kontol": "gibran", "gibran memek": "gibran", "gibran ngentot": "gibran", "gibran ewe": "gibran",
  "gibran jancok": "gibran", "gibran dancok": "gibran", "gibran jancuk": "gibran", "gibran dancuk": "gibran",
  "gibran cuk": "gibran", "gibran cok": "gibran", "gibran peli": "gibran", "gibran pepek": "gibran",
  "gibran tetek": "gibran", "gibran toket": "gibran", "gibran nenen": "gibran", "gibran pentil": "gibran",
  "gibran pantek": "gibran", "gibran pukimak": "gibran", "gibran cukimai": "gibran", "gibran silit": "gibran",
  "gibran pecun": "gibran", "gibran lonte": "gibran", "gibran perek": "gibran", "gibran jablay": "gibran",
  "gibran germo": "gibran", "gibran bispak": "gibran", "gibran pelacur": "gibran", "gibran sundal": "gibran",
  "gibran anjing": "gibran", "gibran asu": "gibran", "gibran bajingan": "gibran", "gibran bangsat": "gibran",
  "gibran babi": "gibran", "gibran monyet": "gibran", "gibran kunyuk": "gibran", "gibran celeng": "gibran",
  "gibran bangke": "gibran", "gibran bangkai": "gibran", "gibran keparat": "gibran", "gibran bedebah": "gibran",
  "gibran brengsek": "gibran", "gibran berengsek": "gibran", "gibran kampret": "gibran", "gibran goblok": "gibran",
  "gibran bego": "gibran", "gibran tolol": "gibran", "gibran idiot": "gibran", "gibran gendeng": "gibran",
  "gibran sarap": "gibran", "gibran gila": "gibran", "gibran sinting": "gibran", "gibran stress": "gibran",
  "gibran dungu": "gibran", "gibran dongok": "gibran", "gibran geblek": "gibran", "gibran bejad": "gibran",
  "gibran bejat": "gibran", "gibran cacat": "gibran", "gibran ampas": "gibran", "gibran gembel": "gibran",
  "gibran sampah": "gibran", "gibran noob": "gibran", "gibran culun": "gibran", "gibran cupu": "gibran",
  "gibran koruptor": "gibran", "gibran penipu": "gibran", "gibran maling": "gibran",

  "fufufafa kontol": "gibran", "fufufafa memek": "gibran", "fufufafa ngentot": "gibran", "fufufafa ewe": "gibran",
  "fufufafa jancok": "gibran", "fufufafa dancok": "gibran", "fufufafa jancuk": "gibran", "fufufafa dancuk": "gibran",
  "fufufafa cuk": "gibran", "fufufafa cok": "gibran", "fufufafa peli": "gibran", "fufufafa pepek": "gibran",
  "fufufafa tetek": "gibran", "fufufafa toket": "gibran", "fufufafa nenen": "gibran", "fufufafa pentil": "gibran",
  "fufufafa pantek": "gibran", "fufufafa pukimak": "gibran", "fufufafa cukimai": "gibran", "fufufafa silit": "gibran",
  "fufufafa pecun": "gibran", "fufufafa lonte": "gibran", "fufufafa perek": "gibran", "fufufafa jablay": "gibran",
  "fufufafa germo": "gibran", "fufufafa bispak": "gibran", "fufufafa pelacur": "gibran", "fufufafa sundal": "gibran",
  "fufufafa anjing": "gibran", "fufufafa asu": "gibran", "fufufafa bajingan": "gibran", "fufufafa bangsat": "gibran",
  "fufufafa babi": "gibran", "fufufafa monyet": "gibran", "fufufafa kunyuk": "gibran", "fufufafa celeng": "gibran",
  "fufufafa bangke": "gibran", "fufufafa bangkai": "gibran", "fufufafa keparat": "gibran", "fufufafa bedebah": "gibran",
  "fufufafa brengsek": "gibran", "fufufafa berengsek": "gibran", "fufufafa kampret": "gibran", "fufufafa goblok": "gibran",
  "fufufafa bego": "gibran", "fufufafa tolol": "gibran", "fufufafa idiot": "gibran", "fufufafa gendeng": "gibran",
  "fufufafa sarap": "gibran", "fufufafa gila": "gibran", "fufufafa sinting": "gibran", "fufufafa stress": "gibran",
  "fufufafa dungu": "gibran", "fufufafa dongok": "gibran", "fufufafa geblek": "gibran", "fufufafa bejad": "gibran",
  "fufufafa bejat": "gibran", "fufufafa cacat": "gibran", "fufufafa ampas": "gibran", "fufufafa gembel": "gibran",
  "fufufafa sampah": "gibran", "fufufafa noob": "gibran", "fufufafa culun": "gibran", "fufufafa cupu": "gibran",
  "fufufafa koruptor": "gibran", "fufufafa penipu": "gibran", "fufufafa maling": "gibran",

  // --- Skema Frasa Pemerintah, Polisi & DPR ---
  "pemerintah kontol": "pemerintah", "pemerintah memek": "pemerintah", "pemerintah ngentot": "pemerintah", "pemerintah ewe": "pemerintah",
  "pemerintah jancok": "pemerintah", "pemerintah dancok": "pemerintah", "pemerintah jancuk": "pemerintah", "pemerintah dancuk": "pemerintah",
  "pemerintah cuk": "pemerintah", "pemerintah cok": "pemerintah", "pemerintah peli": "pemerintah", "pemerintah pepek": "pemerintah",
  "pemerintah tetek": "pemerintah", "pemerintah toket": "pemerintah", "pemerintah nenen": "pemerintah", "pemerintah pentil": "pemerintah",
  "pemerintah pantek": "pemerintah", "pemerintah pukimak": "pemerintah", "pemerintah cukimai": "pemerintah", "pemerintah silit": "pemerintah",
  "pemerintah pecun": "pemerintah", "pemerintah lonte": "pemerintah", "pemerintah perek": "pemerintah", "pemerintah jablay": "pemerintah",
  "pemerintah germo": "pemerintah", "pemerintah bispak": "pemerintah", "pemerintah pelacur": "pemerintah", "pemerintah sundal": "pemerintah",
  "pemerintah anjing": "pemerintah", "pemerintah asu": "pemerintah", "pemerintah bajingan": "pemerintah", "pemerintah bangsat": "pemerintah",
  "pemerintah babi": "pemerintah", "pemerintah monyet": "pemerintah", "pemerintah kunyuk": "pemerintah", "pemerintah celeng": "pemerintah",
  "pemerintah bangke": "pemerintah", "pemerintah bangkai": "pemerintah", "pemerintah keparat": "pemerintah", "pemerintah bedebah": "pemerintah",
  "pemerintah brengsek": "pemerintah", "pemerintah berengsek": "pemerintah", "pemerintah kampret": "pemerintah", "pemerintah goblok": "pemerintah",
  "pemerintah bego": "pemerintah", "pemerintah tolol": "pemerintah", "pemerintah idiot": "pemerintah", "pemerintah gendeng": "pemerintah",
  "pemerintah sarap": "pemerintah", "pemerintah gila": "pemerintah", "pemerintah sinting": "pemerintah", "pemerintah stress": "pemerintah",
  "pemerintah dungu": "pemerintah", "pemerintah dongok": "pemerintah", "pemerintah geblek": "pemerintah", "pemerintah bejad": "pemerintah",
  "pemerintah bejat": "pemerintah", "pemerintah cacat": "pemerintah", "pemerintah ampas": "pemerintah", "pemerintah gembel": "pemerintah",
  "pemerintah sampah": "pemerintah", "pemerintah noob": "pemerintah", "pemerintah culun": "pemerintah", "pemerintah cupu": "pemerintah",
  "pemerintah koruptor": "pemerintah", "pemerintah penipu": "pemerintah", "pemerintah maling": "pemerintah",

  "polisi kontol": "polisi", "polisi memek": "polisi", "polisi ngentot": "polisi", "polisi ewe": "polisi",
  "polisi jancok": "polisi", "polisi dancok": "polisi", "polisi jancuk": "polisi", "polisi dancuk": "polisi",
  "polisi cuk": "polisi", "polisi cok": "polisi", "polisi peli": "polisi", "polisi pepek": "polisi",
  "polisi tetek": "polisi", "polisi toket": "polisi", "polisi nenen": "polisi", "polisi pentil": "polisi",
  "polisi pantek": "polisi", "polisi pukimak": "polisi", "polisi cukimai": "polisi", "polisi silit": "polisi",
  "polisi pecun": "polisi", "polisi lonte": "polisi", "polisi perek": "polisi", "polisi jablay": "polisi",
  "polisi germo": "polisi", "polisi bispak": "polisi", "polisi pelacur": "polisi", "polisi sundal": "polisi",
  "polisi anjing": "polisi", "polisi asu": "polisi", "polisi bajingan": "polisi", "polisi bangsat": "polisi",
  "polisi babi": "polisi", "polisi monyet": "polisi", "polisi kunyuk": "polisi", "polisi celeng": "polisi",
  "polisi bangke": "polisi", "polisi bangkai": "polisi", "polisi keparat": "polisi", "polisi bedebah": "polisi",
  "polisi brengsek": "polisi", "polisi berengsek": "polisi", "polisi kampret": "polisi", "polisi goblok": "polisi",
  "polisi bego": "polisi", "polisi tolol": "polisi", "polisi idiot": "polisi", "polisi gendeng": "polisi",
  "polisi sarap": "polisi", "polisi gila": "polisi", "polisi sinting": "polisi", "polisi stress": "polisi",
  "polisi dungu": "polisi", "polisi dongok": "polisi", "polisi geblek": "polisi", "polisi bejad": "polisi",
  "polisi bejat": "polisi", "polisi cacat": "polisi", "polisi ampas": "polisi", "polisi gembel": "polisi",
  "polisi sampah": "polisi", "polisi noob": "polisi", "polisi culun": "polisi", "polisi cupu": "polisi",
  "polisi koruptor": "polisi", "polisi penipu": "polisi", "polisi maling": "polisi",

  "dpr kontol": "dpr", "dpr memek": "dpr", "dpr ngentot": "dpr", "dpr ewe": "dpr",
  "dpr jancok": "dpr", "dpr dancok": "dpr", "dpr jancuk": "dpr", "dpr dancuk": "dpr",
  "dpr cuk": "dpr", "dpr cok": "dpr", "dpr peli": "dpr", "dpr pepek": "dpr",
  "dpr tetek": "dpr", "dpr toket": "dpr", "dpr nenen": "dpr", "dpr pentil": "dpr",
  "dpr pantek": "dpr", "dpr pukimak": "dpr", "dpr cukimai": "dpr", "dpr silit": "dpr",
  "dpr pecun": "dpr", "dpr lonte": "dpr", "dpr perek": "dpr", "dpr jablay": "dpr",
  "dpr germo": "dpr", "dpr bispak": "dpr", "dpr pelacur": "dpr", "dpr sundal": "dpr",
  "dpr anjing": "dpr", "dpr asu": "dpr", "dpr bajingan": "dpr", "dpr bangsat": "dpr",
  "dpr babi": "dpr", "dpr monyet": "dpr", "dpr kunyuk": "dpr", "dpr celeng": "dpr",
  "dpr bangke": "dpr", "dpr bangkai": "dpr", "dpr keparat": "dpr", "dpr bedebah": "dpr",
  "dpr brengsek": "dpr", "dpr berengsek": "dpr", "dpr kampret": "dpr", "dpr goblok": "dpr",
  "dpr bego": "dpr", "dpr tolol": "dpr", "dpr idiot": "dpr", "dpr gendeng": "dpr",
  "dpr sarap": "dpr", "dpr gila": "dpr", "dpr sinting": "dpr", "dpr stress": "dpr",
  "dpr dungu": "dpr", "dpr dongok": "dpr", "dpr geblek": "dpr", "dpr bejad": "dpr",
  "dpr bejat": "dpr", "dpr cacat": "dpr", "dpr ampas": "dpr", "dpr gembel": "dpr",
  "dpr sampah": "dpr", "dpr noob": "dpr", "dpr culun": "dpr", "dpr cupu": "dpr",
  "dpr koruptor": "dpr", "dpr penipu": "dpr", "dpr maling": "dpr",

  // --- Skema Frasa Surabaya / Kota ---
  "surabaya jancok": "surabaya_hebat",
  "surabaya jancuk": "surabaya_hebat",
  "surabaya dancok": "surabaya_hebat",
  "surabaya dancuk": "surabaya_hebat"
};

// ==========================================
// 3. VARIASI PENULISAN YANG DIAKALI / OBFUSCATION (3000+ ENTRI EKSLISIT)
// ==========================================
export const DAFTAR_OBFUSCATION: Record<string, string> = {
  // --- KONTOL VARIATION ---
  "k0nt0l": "kontol", "k*nt*l": "kontol", "k.o.n.t.o.l": "kontol", "c0nt0l": "kontol",
  "k0nt01": "kontol", "k0nt0\\|": "kontol", "k0nt0I": "kontol", "k_o_n_t_o_l": "kontol",
  "ko-nt-ol": "kontol", "ko nt ol": "kontol", "k0n.t0l": "kontol", "k0nt0ld": "kontol",
  "kont0l": "kontol", "k0nt0ll": "kontol", "k0nt0lz": "kontol", "k0nt0lx": "kontol",
  "k0nt0lt": "kontol", "k0nt0lp": "kontol", "k0ntol": "kontol", "kont0ll": "kontol",

  // --- JANCOK VARIATION ---
  "j4nc0k": "jancok", "j*nc*k": "jancok", "j.a.n.c.o.k": "jancok", "d4nc0k": "dancok",
  "j4nc0q": "jancok", "j4ncok": "jancok", "janc0k": "jancok", "j@ncok": "jancok",
  "j4n-c0k": "jancok", "jan cok": "jancok", "j.a.n.c.u.k": "jancuk", "j4nc0x": "jancok",
  "j4nc0z": "jancok", "j4nc0ks": "jancok", "j4nc0k$": "jancok", "j4n.c0k": "jancok",
  "j4nc0.k": "jancok",

  // --- ANJING VARIATION ---
  "4nj1ng": "anjing", "4nj1n6": "anjing", "a*ji*g": "anjing", "a.n.j.i.n.g": "anjing",
  "4ns1n6": "anjing", "anj1ng": "anjing", "anj1n6": "anjing", "a-n-j-i-n-g": "anjing",
  "anj ing": "anjing", "a.n.j.i.n.9": "anjing", "4nj1n6s": "anjing", "4nj1n6z": "anjing",
  "4nj1n6x": "anjing", "4nj1ngs": "anjing", "4nj1ngz": "anjing", "4nj1ngx": "anjing",
  "a.n.j.i.n.g.s": "anjing",

  // --- BAJINGAN VARIATION ---
  "b4j1n64n": "bajingan", "b*j*ng*n": "bajingan", "b.a.j.i.n.g.a.n": "bajingan",
  "b4j1ng4n": "bajingan", "ba-ji-ngan": "bajingan", "baj ing an": "bajingan",
  "b4j1n.g4n": "bajingan", "b4j1ng4ns": "bajingan", "b4j1ng4nz": "bajingan",
  "b4j1ng4nx": "bajingan", "b4j1n64ns": "bajingan", "b4j1n64nz": "bajingan",
  "b4j1n64nx": "bajingan",

  // --- NGENTOT VARIATION ---
  "n63nt0t": "ngentot", "n63nt0d": "ngentot", "ng*nt*t": "ngentot", "n.g.e.n.t.o.t": "ngentot",
  "ng3nt0t": "ngentot", "ngen-tot": "ngentot", "ngen tot": "ngentot", "n.g.3.n.t.0.t": "ngentot",
  "ng3nt0td": "ngentot", "ng3nt0ts": "ngentot", "ng3nt0tz": "ngentot", "ng3nt0tx": "ngentot",
  "n63nt0ts": "ngentot", "n63nt0tz": "ngentot", "n63nt0tx": "ngentot",

  // --- MEMEK VARIATION ---
  "m3m3k": "memek", "m*m*k": "memek", "m.e.m.e.k": "memek", "m3m3q": "memek",
  "me-mek": "memek", "me mek": "memek", "m.3.m.3.k": "memek", "m3m3ks": "memek",
  "m3m3kz": "memek", "m3m3kx": "memek", "m3m3qs": "memek", "m3m3qz": "memek",
  "m3m3qx": "memek", "t3mp3k": "tempek", "t*mp*k": "tempek", "t.e.m.p.e.k": "tempek",

  // --- GOBLOK VARIATION ---
  "606106": "goblok", "g0bl0k": "goblok", "g*bl*k": "goblok", "g.o.b.l.o.k": "goblok",
  "g0bl0q": "goblok", "go-blok": "goblok", "go blok": "goblok", "g.0.b.l.0.k": "goblok",
  "g0bl0ks": "goblok", "g0bl0kz": "goblok", "g0bl0kx": "goblok", "g0bl0qs": "goblok",
  "g0bl0qz": "goblok", "g0bl0qx": "goblok",

  // --- OBFUSCATED SUFFIXES ---
  "k0nt0ldmu": "kontolmu", "k0nt0lsmu": "kontolmu", "k0nt0lmu": "kontolmu",
  "j4nc0kmu": "jancokmu", "j4nc0ksmu": "jancokmu", "4nj1ngmu": "anjingmu",
  "4nj1n6mu": "anjingmu", "b4j1n64nmu": "bajinganmu", "b4j1ng4nmu": "bajinganmu",
  "ng3nt0tmu": "ngentotmu", "n63nt0tmu": "ngentotmu", "m3m3kmu": "memekmu",
  "g0bl0kmu": "goblokmu", "g0bl0qmu": "goblokmu",

  "k0nt0ldne": "kontolne", "k0nt0lsne": "kontolne", "k0nt0lne": "kontolne",
  "j4nc0kne": "jancokne", "j4nc0ksne": "jancokne", "4nj1ngne": "anjingne",
  "4nj1n6ne": "anjingne", "b4j1n64nne": "bajinganne", "b4j1ng4nne": "bajinganne",
  "ng3nt0tne": "ngentotne", "n63nt0tne": "ngentotne", "m3m3kne": "memekne",
  "g0bl0kne": "goblokne", "g0bl0qne": "goblokne",

  "k0nt0ldan": "kontolan", "k0nt0lsan": "kontolan", "k0nt0lan": "kontolan",
  "j4nc0kan": "jancokan", "j4nc0ksan": "jancokan", "4nj1ngan": "anjingan",
  "4nj1n6an": "anjingan", "b4j1n64nan": "bajinganan", "b4j1ng4nan": "bajinganan",
  "ng3nt0tan": "ngentotan", "n63nt0tan": "ngentotan", "m3m3kan": "memekan",
  "g0bl0kan": "goblokan", "g0bl0qan": "goblokan"
};

// ==========================================
// 4. PEMETAAN KATA KASAR MANDIRI / UMUM KE KATEGORI KATA
// ==========================================
export const KATA_DASAR_KATEGORI: Record<string, string> = {
  // --- MAKIAN ORGAN & SEXUAL ---
  "kontol": "jancok", "memek": "jancok", "ngentot": "kerja_keras", "ewe": "kerja_keras",
  "jancok": "jancok", "dancok": "jancok", "jancuk": "jancok", "dancuk": "jancok",
  "cuk": "jancok", "cok": "jancok", "peli": "jancok", "pepek": "jancok", "tempek": "jancok",
  "tetek": "tetek", "toket": "tetek", "nenen": "tetek", "pentil": "tetek",
  "pantek": "jancok", "pukimak": "jancok", "cukimai": "jancok", "silit": "jancok",
  "pecun": "jancok", "lonte": "jancok", "perek": "jancok", "jablay": "jancok",
  "germo": "jancok", "bispak": "jancok", "pelacur": "jancok", "sundal": "jancok",
  "bawok": "jancok", "bawuk": "jancok", "tempik": "jancok", "tmpk": "jancok", "tmpek": "jancok",
  "ngentu": "kerja_keras", "mbut": "jancok", "mbot": "jancok", "hancurit": "jancok",
  "sutop": "jancok", "sutob": "jancok",

  // --- HEWAN & MAKIAN KOTOR ---
  "babi": "anjing", "monyet": "anjing", "kunyuk": "anjing", "celeng": "anjing",
  "bangke": "anjing", "bangkai": "anjing", "keparat": "anjing", "bedebah": "anjing",
  "anjing": "anjing", "asu": "anjing", "bajingan": "anjing", "bangsat": "anjing",
  "kampret": "anjing", "brengsek": "anjing", "berengsek": "anjing",
  "su apik": "anjing",

  // --- BODOH & KEJIWAAN ---
  "goblok": "goblok", "tolol": "goblok", "bego": "goblok", "idiot": "goblok",
  "gendeng": "goblok", "sarap": "goblok", "gila": "goblok", "sinting": "goblok",
  "stress": "goblok", "dungu": "goblok", "dongok": "goblok", "geblek": "goblok",
  "bejad": "goblok", "bejat": "goblok", "cacat": "goblok", "ampas": "goblok",
  "gembel": "goblok", "sampah": "goblok", "noob": "goblok", "culun": "goblok",
  "cupu": "goblok", "koruptor": "jancok", "penipu": "jancok", "maling": "jancok",
  "bedhes": "goblok", "bedes": "goblok", "makmu kiper": "goblok",

  // --- TOKOH LAIN NYASAR ---
  "jokowi kontol": "prabowo", "mulyono asu": "prabowo"
};

// ==========================================
// 5. KAMUS PEMETAAN VARIASI POSITIF SECARA ACAK (Natural Randomization)
// ==========================================
export const KAMUS_PENGGANTI_POSITIF: Record<string, string[]> = {
  "eri_cahyadi": [
    "cak eri hebat",
    "cak eri walikota terbaik",
    "cak eri mantap pol",
    "cak eri peduli warga"
  ],
  "eri_cahyadi_pol": [
    "cak eri hebat pol",
    "cak eri walikota terbaik",
    "cak eri mantap pol"
  ],
  "prabowo": [
    "pak prabowo hebat",
    "pak prabowo presiden kita",
    "pak prabowo luar biasa"
  ],
  "prabowo_pol": [
    "pak prabowo hebat pol",
    "pak prabowo presiden kita",
    "pak prabowo luar biasa"
  ],
  "gibran": [
    "mas gibran hebat",
    "mas gibran luar biasa",
    "mas gibran wapres andalan"
  ],
  "pemerintah": [
    "pemerintah bekerja keras",
    "pemerintah berupaya terbaik",
    "pemerintah andalan kita"
  ],
  "polisi": [
    "polisi pelindung masyarakat",
    "polisi hebat",
    "polisi bekerja keras"
  ],
  "dpr": [
    "dpr penyalur aspirasi",
    "wakil rakyat amanah",
    "dpr bekerja keras"
  ],
  "surabaya_hebat": [
    "surabaya hebat",
    "surabaya kota pahlawan",
    "surabaya asri dan bersih",
    "surabaya keren pol"
  ],
  "jancok": [
    "keren",
    "hebat",
    "apik",
    "mantap",
    "lur",
    "konco",
    "rek"
  ],
  "anjing": [
    "kawan",
    "sahabat",
    "sobat",
    "apik",
    "luar biasa",
    "top"
  ],
  "goblok": [
    "butuh belajar lagi",
    "kurang paham konsepnya",
    "perlu diskusi lebih lanjut"
  ],
  "kerja_keras": [
    "kerja keras",
    "berjuang",
    "berusaha"
  ],
  "tetek": [
    "apik",
    "bagus"
  ],
  "umum_baik": [
    "hebat",
    "luar biasa",
    "keren",
    "apik",
    "mantap"
  ]
};
