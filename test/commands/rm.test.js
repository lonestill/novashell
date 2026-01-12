import { rmCommand } from '../../src/commands/rm.js';
import { assertEquals } from '../helpers.js';
import { writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

async function testRm() {
  const testFile = join(tmpdir(), `test-rm-${Date.now()}.txt`);
  
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    writeFileSync(testFile, 'test content', 'utf-8');
    
    await rmCommand(['--force', testFile]);
    assertEquals(existsSync(testFile), false, 'rm --force should delete file');
    
    if (existsSync(testFile)) unlinkSync(testFile);
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ rm tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    if (existsSync(testFile)) try { unlinkSync(testFile); } catch {}
    throw error;
  }
}

testRm().catch(console.error);
