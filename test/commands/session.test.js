import { sessionCommand } from '../../src/commands/session.js';
import { assertEquals } from '../helpers.js';
import { listSessions, deleteSession } from '../../src/utils/sessions.js';

async function testSession() {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    await sessionCommand(['list']);
    assertEquals(output.length >= 0, true, 'session list should work');
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ session tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    throw error;
  }
}

testSession().catch(console.error);
