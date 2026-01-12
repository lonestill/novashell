import { cat } from '../../src/commands/cat.js';
import { assertEquals } from '../helpers.js';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

async function testCat() {
  const testFile = join(tmpdir(), `test-cat-${Date.now()}.txt`);
  const testContent = 'Hello World\nTest Content';
  
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    writeFileSync(testFile, testContent, 'utf-8');
    
    await cat([testFile]);
    assertEquals(output.includes('Hello World'), true, 'cat should output file content');
    
    console.log = originalLog;
    console.error = originalError;
    
    if (existsSync(testFile)) {
      unlinkSync(testFile);
    }
    console.log('✓ cat tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    if (existsSync(testFile)) {
      try {
        unlinkSync(testFile);
      } catch {}
    }
    throw error;
  }
}

testCat().catch(console.error);
