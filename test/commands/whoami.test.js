import { whoami } from '../../src/commands/whoami.js';
import { assertEquals } from '../helpers.js';
import { userInfo } from 'os';

async function testWhoami() {
  let output = '';
  const originalLog = console.log;
  console.log = (...args) => {
    output = args.join(' ');
  };
  
  try {
    await whoami([]);
    const expectedUser = userInfo().username;
    assertEquals(output, expectedUser, 'whoami should output current username');
    
    console.log = originalLog;
    console.log('✓ whoami tests passed');
  } catch (error) {
    console.log = originalLog;
    throw error;
  }
}

testWhoami().catch(console.error);
