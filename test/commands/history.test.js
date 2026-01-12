import { history } from '../../src/commands/history.js';
import { assertEquals } from '../helpers.js';
import { saveCommand, getDB, closeDB } from '../../src/utils/historyDB.js';

async function testHistory() {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    saveCommand('test command', 0, 10, null);
    
    await history([]);
    assertEquals(output.length > 0, true, 'history should output command history');
    
    output = '';
    await history(['--limit', '5']);
    assertEquals(output.length > 0, true, 'history with limit should work');
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ history tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    throw error;
  }
}

testHistory().catch(console.error);
