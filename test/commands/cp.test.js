import { cpCommand } from '../../src/commands/cp.js';
import { assertEquals } from '../helpers.js';
import { writeFileSync, existsSync, unlinkSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

async function testCp() {
  const testFile = join(tmpdir(), `test-cp-${Date.now()}-src.txt`);
  const testDest = join(tmpdir(), `test-cp-${Date.now()}-dest.txt`);
  const testContent = 'Test content for copy';
  
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    writeFileSync(testFile, testContent, 'utf-8');
    
    await cpCommand([testFile, testDest]);
    assertEquals(existsSync(testDest), true, 'cp should copy file');
    
    const copiedContent = readFileSync(testDest, 'utf-8');
    assertEquals(copiedContent, testContent, 'cp should copy file content correctly');
    
    if (existsSync(testFile)) unlinkSync(testFile);
    if (existsSync(testDest)) unlinkSync(testDest);
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ cp tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    if (existsSync(testFile)) try { unlinkSync(testFile); } catch {}
    if (existsSync(testDest)) try { unlinkSync(testDest); } catch {}
    throw error;
  }
}

testCp().catch(console.error);
