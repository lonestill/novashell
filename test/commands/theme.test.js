import { themeCommand } from '../../src/commands/theme.js';
import { assertEquals } from '../helpers.js';

async function testTheme() {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    await themeCommand(['list']);
    assertEquals(output.length > 0, true, 'theme list should output themes');
    
    output = '';
    await themeCommand(['current']);
    assertEquals(output.length > 0, true, 'theme current should output current theme');
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ theme tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    throw error;
  }
}

testTheme().catch(console.error);
