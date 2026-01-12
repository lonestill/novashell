import { echo } from '../../src/commands/echo.js';
import { assertEquals, assertThrows } from '../helpers.js';

async function testEcho() {
  let output = '';
  const originalLog = console.log;
  console.log = (...args) => {
    output = args.join(' ');
  };
  
  try {
    await echo(['Hello', 'World']);
    assertEquals(output, 'Hello World', 'Echo should output arguments');
    
    output = '';
    await echo(['Single']);
    assertEquals(output, 'Single', 'Echo should handle single argument');
    
    output = '';
    await echo([]);
    assertEquals(output, '', 'Echo should handle empty arguments');
    
    console.log = originalLog;
    console.log('✓ echo tests passed');
  } catch (error) {
    console.log = originalLog;
    throw error;
  }
}

testEcho().catch(console.error);
