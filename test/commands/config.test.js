import { configCommand } from '../../src/commands/config.js';
import { assertEquals } from '../helpers.js';

async function testConfig() {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    await configCommand(['show']);
    assertEquals(output.length > 0, true, 'config show should work');
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ config tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    throw error;
  }
}

testConfig().catch(console.error);
