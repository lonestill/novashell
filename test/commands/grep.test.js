import { grepCommand } from '../../src/commands/grep.js';
import { assertEquals } from '../helpers.js';
import { writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

async function testGrep() {
  const testFile = join(tmpdir(), `test-grep-${Date.now()}.txt`);
  const testContent = 'Hello World\nTest Pattern\nAnother line';
  
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    writeFileSync(testFile, testContent, 'utf-8');
    
    await grepCommand(['Pattern', testFile]);
    assertEquals(output.includes('Pattern'), true, 'grep should find pattern');
    
    if (existsSync(testFile)) unlinkSync(testFile);
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ grep tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    if (existsSync(testFile)) try { unlinkSync(testFile); } catch {}
    throw error;
  }
}

testGrep().catch(console.error);
