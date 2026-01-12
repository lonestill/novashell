const CYRILLIC_TO_LATIN = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
};

const RUSSIAN_LAYOUT_TO_ENGLISH = {
  'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u',
  'ш': 'i', 'щ': 'o', 'з': 'p', 'х': '[', 'ъ': ']',
  'ф': 'a', 'ы': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j',
  'л': 'k', 'д': 'l', 'ж': ';', 'э': "'",
  'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm',
  'б': ',', 'ю': '.',
  'ё': '`'
};

const ENGLISH_TO_RUSSIAN_LAYOUT = {};
for (const [cyrillic, english] of Object.entries(RUSSIAN_LAYOUT_TO_ENGLISH)) {
  ENGLISH_TO_RUSSIAN_LAYOUT[english.toLowerCase()] = cyrillic.toLowerCase();
  ENGLISH_TO_RUSSIAN_LAYOUT[english.toUpperCase()] = cyrillic.toUpperCase();
}

export function translitFromCyrillic(text) {
  return text
    .split('')
    .map(char => {
      const lower = char.toLowerCase();
      if (RUSSIAN_LAYOUT_TO_ENGLISH[lower]) {
        return char === lower 
          ? RUSSIAN_LAYOUT_TO_ENGLISH[lower]
          : RUSSIAN_LAYOUT_TO_ENGLISH[lower].toUpperCase();
      }
      return char;
    })
    .join('');
}

export function hasCyrillic(text) {
  return /[а-яёА-ЯЁ]/.test(text);
}
