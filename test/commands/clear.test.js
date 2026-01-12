import { clear } from '../../src/commands/clear.js';

async function testClear() {
  try {
    await clear([]);
    console.log('✓ clear tests passed');
  } catch (error) {
    throw error;
  }
}

testClear().catch(console.error);
