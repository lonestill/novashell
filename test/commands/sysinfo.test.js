import { sysinfo } from '../../src/commands/sysinfo.js';
import { assertEquals } from '../helpers.js';

async function testSysinfo() {
  let output = '';
  const originalLog = console.log;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  
  try {
    await sysinfo([]);
    assertEquals(output.length > 0, true, 'sysinfo should output system information');
    assertEquals(output.includes('System') || output.includes('OS'), true, 'sysinfo should include system info');
    
    console.log = originalLog;
    console.log('✓ sysinfo tests passed');
  } catch (error) {
    console.log = originalLog;
    throw error;
  }
}

testSysinfo().catch(console.error);
