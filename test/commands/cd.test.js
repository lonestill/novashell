import { cd } from '../../src/commands/cd.js';
import { assertEquals } from '../helpers.js';
import { cwd, chdir } from 'process';
import { homedir } from 'os';

async function testCd() {
  const originalCwd = cwd();
  const home = homedir();
  
  try {
    await cd([home]);
    assertEquals(cwd(), home, 'cd should change directory');
    
    await cd([originalCwd]);
    assertEquals(cwd(), originalCwd, 'cd should change back');
    
    console.log('✓ cd tests passed');
  } catch (error) {
    try {
      chdir(originalCwd);
    } catch {}
    throw error;
  }
}

testCd().catch(console.error);
