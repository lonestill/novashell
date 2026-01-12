import { random } from '../../src/commands/random.js';
import { assertEquals } from '../helpers.js';

async function testRandom() {
  let output = '';
  const originalLog = console.log;
  console.log = (...args) => {
    output = args.join(' ');
  };
  
  try {
    await random(['string', '10']);
    assertEquals(output.length, 10, 'random string should generate string of specified length');
    
    output = '';
    await random(['number', '100']);
    const num = parseInt(output);
    assertEquals(isNaN(num), false, 'random number should generate a number');
    assertEquals(num >= 0 && num < 100, true, 'random number should be in range');
    
    output = '';
    await random(['uuid']);
    assertEquals(output.length, 36, 'random uuid should generate UUID');
    assertEquals(output.includes('-'), true, 'UUID should contain hyphens');
    
    console.log = originalLog;
    console.log('✓ random tests passed');
  } catch (error) {
    console.log = originalLog;
    throw error;
  }
}

testRandom().catch(console.error);
