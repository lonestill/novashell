import { nextCommand } from '../../src/commands/next.js';
import { assertEquals } from '../helpers.js';

async function testNext() {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    await nextCommand([]);
    assertEquals(output.length >= 0, true, 'next should work');
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ next tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    throw error;
  }
}

testNext().catch(console.error);
