import { help } from '../../src/commands/help.js';
import { assertEquals } from '../helpers.js';

async function testHelp() {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = (...args) => {
    output += args.join(' ') + '\n';
  };
  
  try {
    await help([]);
    assertEquals(output.includes('help'), true, 'help should list commands');
    
    output = '';
    await help(['echo']);
    assertEquals(output.length > 0, true, 'help echo should show echo help');
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ help tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    throw error;
  }
}

testHelp().catch(console.error);
