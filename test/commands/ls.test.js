import { ls } from '../../src/commands/ls.js';
import { assertEquals } from '../helpers.js';
import { cwd } from 'process';

async function testLs() {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    await ls([]);
    assertEquals(output.length > 0, true, 'ls should output directory listing');
    
    output = '';
    await ls([cwd()]);
    assertEquals(output.length > 0, true, 'ls should list specified directory');
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ ls tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    throw error;
  }
}

testLs().catch(console.error);
