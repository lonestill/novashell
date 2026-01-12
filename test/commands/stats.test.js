import { stats } from '../../src/commands/stats.js';
import { assertEquals } from '../helpers.js';
import { saveCommand, getDB } from '../../src/utils/historyDB.js';

async function testStats() {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    saveCommand('test stats', 0, 5, null);
    
    await stats([]);
    assertEquals(output.length > 0, true, 'stats should output statistics');
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ stats tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    throw error;
  }
}

testStats().catch(console.error);
