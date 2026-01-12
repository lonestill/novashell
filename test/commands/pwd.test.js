import { pwd } from '../../src/commands/pwd.js';
import { assertEquals } from '../helpers.js';

async function testPwd() {
  let output = '';
  const originalLog = console.log;
  console.log = (...args) => {
    output = args.join(' ');
  };
  
  try {
    await pwd([]);
    assertEquals(output.length > 0, true, 'pwd should output current directory');
    assertEquals(output.includes(process.cwd()), true, 'pwd should output current working directory');
    
    console.log = originalLog;
    console.log('✓ pwd tests passed');
  } catch (error) {
    console.log = originalLog;
    throw error;
  }
}

testPwd().catch(console.error);
