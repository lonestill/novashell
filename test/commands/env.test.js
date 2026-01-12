import { env } from '../../src/commands/env.js';
import { assertEquals } from '../helpers.js';

async function testEnv() {
  let output = '';
  const originalLog = console.log;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  
  try {
    await env([]);
    assertEquals(output.includes('PATH'), true, 'env should output PATH variable');
    assertEquals(output.length > 0, true, 'env should output environment variables');
    
    output = '';
    await env(['PATH']);
    assertEquals(output.length > 0, true, 'env PATH should output PATH value');
    
    console.log = originalLog;
    console.log('✓ env tests passed');
  } catch (error) {
    console.log = originalLog;
    throw error;
  }
}

testEnv().catch(console.error);
