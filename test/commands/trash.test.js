import { trash } from '../../src/commands/trash.js';
import { assertEquals } from '../helpers.js';
import { writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

async function testTrash() {
  const testFile = join(tmpdir(), `test-trash-${Date.now()}.txt`);
  
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    writeFileSync(testFile, 'test content', 'utf-8');
    
    await trash([testFile]);
    assertEquals(existsSync(testFile), false, 'trash should move file to trash');
    
    if (existsSync(testFile)) unlinkSync(testFile);
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ trash tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    if (existsSync(testFile)) try { unlinkSync(testFile); } catch {}
    throw error;
  }
}

testTrash().catch(console.error);
