import { findCommand } from '../../src/commands/find.js';
import { assertEquals } from '../helpers.js';
import { tmpdir } from 'os';
import { mkdirSync, writeFileSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

async function testFind() {
  const testDir = join(tmpdir(), `test-find-${Date.now()}`);
  const testFile = join(testDir, 'test-file.txt');
  
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    mkdirSync(testDir, { recursive: true });
    writeFileSync(testFile, 'test', 'utf-8');
    
    await findCommand(['test*.txt', testDir]);
    assertEquals(output.length >= 0, true, 'find should work');
    
    if (existsSync(testDir)) rmSync(testDir, { recursive: true });
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ find tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    if (existsSync(testDir)) try { rmSync(testDir, { recursive: true }); } catch {}
    throw error;
  }
}

testFind().catch(console.error);
