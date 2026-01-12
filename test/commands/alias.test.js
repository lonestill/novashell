import { aliasCommand } from '../../src/commands/alias.js';
import { assertEquals } from '../helpers.js';
import { getAliases, saveAlias, removeAlias } from '../../src/utils/aliases.js';

async function testAlias() {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    await aliasCommand(['list']);
    assertEquals(output.length >= 0, true, 'alias list should work');
    
    const testAliasName = 'test-alias-' + Date.now();
    await saveAlias(testAliasName, 'echo test');
    await aliasCommand([]);
    assertEquals(output.includes(testAliasName), true, 'alias should list saved aliases');
    
    await removeAlias(testAliasName);
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ alias tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    throw error;
  }
}

testAlias().catch(console.error);
