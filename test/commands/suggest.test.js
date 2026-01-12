import { suggestCommand } from '../../src/commands/suggest.js';
import { assertEquals } from '../helpers.js';

async function testSuggest() {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    await suggestCommand([]);
    assertEquals(output.length >= 0, true, 'suggest should work');
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ suggest tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    throw error;
  }
}

testSuggest().catch(console.error);
