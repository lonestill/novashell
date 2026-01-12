import { json } from '../../src/commands/json.js';
import { assertEquals } from '../helpers.js';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

async function testJson() {
  const testFile = join(tmpdir(), `test-json-${Date.now()}.json`);
  const validJson = JSON.stringify({ name: 'test', value: 123 });
  
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    writeFileSync(testFile, validJson, 'utf-8');
    
    await json(['validate', testFile]);
    assertEquals(output.includes('Valid') || output.includes('valid'), true, 'json validate should validate JSON');
    
    output = '';
    await json(['format', testFile]);
    assertEquals(output.includes('test'), true, 'json format should format JSON');
    
    output = '';
    await json(['minify', testFile]);
    assertEquals(output.includes('"name":"test"'), true, 'json minify should minify JSON');
    
    console.log = originalLog;
    console.error = originalError;
    
    if (existsSync(testFile)) {
      unlinkSync(testFile);
    }
    console.log('✓ json tests passed');
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

testJson().catch(console.error);
