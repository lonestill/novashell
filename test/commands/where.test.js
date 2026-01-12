import { whereCommand } from '../../src/commands/where.js';
import { assertEquals } from '../helpers.js';
import { saveCommand } from '../../src/utils/historyDB.js';

async function testWhere() {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    saveCommand('test', 0, 5, null);
    
    await whereCommand([]);
    assertEquals(output.length > 0, true, 'where should output directory history');
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ where tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    throw error;
  }
}

testWhere().catch(console.error);
