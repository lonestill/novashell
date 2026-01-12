import { translitFromCyrillic, hasCyrillic } from '../../src/utils/translit.js';
import { assertEquals } from '../helpers.js';

function testTranslit() {
  assertEquals(translitFromCyrillic('сгкд'), 'curl', 'Translit should convert Cyrillic to Latin');
  assertEquals(translitFromCyrillic('йцукен'), 'qwerty', 'Translit should convert layout');
  assertEquals(translitFromCyrillic('hello'), 'hello', 'Translit should not change Latin');
  assertEquals(translitFromCyrillic('123'), '123', 'Translit should not change numbers');
  
  assertEquals(hasCyrillic('сгкд'), true, 'hasCyrillic should detect Cyrillic');
  assertEquals(hasCyrillic('hello'), false, 'hasCyrillic should not detect Latin');
  assertEquals(hasCyrillic('123'), false, 'hasCyrillic should not detect numbers');
  
  console.log('✓ translit tests passed');
}

testTranslit();
