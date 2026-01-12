import { touch } from '../../src/commands/touch.js';
import { assertEquals } from '../helpers.js';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

async function testTouch() {
  const testFile = join(tmpdir(), `test-touch-${Date.now()}.txt`);
  
  try {
    await touch([testFile]);
    assertEquals(existsSync(testFile), true, 'touch should create file');
    
    await unlinkSync(testFile);
    console.log('✓ touch tests passed');
  } catch (error) {
    if (existsSync(testFile)) {
      try {
        await unlinkSync(testFile);
      } catch {}
    }
    throw error;
  }
}

testTouch().catch(console.error);
