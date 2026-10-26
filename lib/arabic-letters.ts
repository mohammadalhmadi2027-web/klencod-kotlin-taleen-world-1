export type ArabicLetter = {
  id: string;
  letter: string;
  name: string;
  word: string;
  emoji: string;
  color: string;
  imageUri?: string;
};

export const arabicLetters: ArabicLetter[] = [
  { id: "alif", letter: "أ", name: "الألف", word: "أرنب", emoji: "🐰", color: "#7B61FF" },
  { id: "ba", letter: "ب", name: "الباء", word: "بطة", emoji: "🦆", color: "#18B6A4" },
  { id: "ta", letter: "ت", name: "التاء", word: "تفاحة", emoji: "🍎", color: "#F16B78" },
  { id: "tha", letter: "ث", name: "الثاء", word: "ثعلب", emoji: "🦊", color: "#F7A43A" },
  { id: "jeem", letter: "ج", name: "الجيم", word: "جمل", emoji: "🐪", color: "#C98252" },
  { id: "ha", letter: "ح", name: "الحاء", word: "حصان", emoji: "🐴", color: "#5CA9E6" },
  { id: "kha", letter: "خ", name: "الخاء", word: "خروف", emoji: "🐑", color: "#6FC18A" },
  { id: "dal", letter: "د", name: "الدال", word: "ديك", emoji: "🐓", color: "#E06E92" },
  { id: "dhal", letter: "ذ", name: "الذال", word: "ذئب", emoji: "🐺", color: "#6B7FA3" },
  { id: "ra", letter: "ر", name: "الراء", word: "رمان", emoji: "🍎", color: "#D84B5C" },
  { id: "zay", letter: "ز", name: "الزاي", word: "زهرة", emoji: "🌷", color: "#E77BBB" },
  { id: "seen", letter: "س", name: "السين", word: "سمكة", emoji: "🐟", color: "#2EA9D6" },
  { id: "sheen", letter: "ش", name: "الشين", word: "شمس", emoji: "☀️", color: "#F5AE2E" },
  { id: "sad", letter: "ص", name: "الصاد", word: "صاروخ", emoji: "🚀", color: "#8A72E8" },
  { id: "dad", letter: "ض", name: "الضاد", word: "ضفدع", emoji: "🐸", color: "#48B675" },
  { id: "tah", letter: "ط", name: "الطاء", word: "طائرة", emoji: "✈️", color: "#57A8E5" },
  { id: "zah", letter: "ظ", name: "الظاء", word: "ظرف", emoji: "✉️", color: "#B780D7" },
  { id: "ain", letter: "ع", name: "العين", word: "عصفور", emoji: "🐦", color: "#F29456" },
  { id: "ghain", letter: "غ", name: "الغين", word: "غزال", emoji: "🦌", color: "#BD945D" },
  { id: "fa", letter: "ف", name: "الفاء", word: "فراشة", emoji: "🦋", color: "#A86FE8" },
  { id: "qaf", letter: "ق", name: "القاف", word: "قمر", emoji: "🌙", color: "#6771D6" },
  { id: "kaf", letter: "ك", name: "الكاف", word: "كتاب", emoji: "📘", color: "#2A9B9D" },
  { id: "lam", letter: "ل", name: "اللام", word: "ليمون", emoji: "🍋", color: "#E7C334" },
  { id: "meem", letter: "م", name: "الميم", word: "موزة", emoji: "🍌", color: "#E4AA30" },
  { id: "noon", letter: "ن", name: "النون", word: "نحلة", emoji: "🐝", color: "#E39C24" },
  { id: "ha2", letter: "هـ", name: "الهاء", word: "هلال", emoji: "🌙", color: "#705ACB" },
  { id: "waw", letter: "و", name: "الواو", word: "وردة", emoji: "🌹", color: "#DD6486" },
  { id: "ya", letter: "ي", name: "الياء", word: "يد", emoji: "🖐️", color: "#44A6D7" },
];

export function getLetterQuizChoices(targetIndex: number) {
  const target = arabicLetters[targetIndex];
  const first = arabicLetters[(targetIndex + 5) % arabicLetters.length];
  const second = arabicLetters[(targetIndex + 11) % arabicLetters.length];
  return [target.word, first.word, second.word];
}
