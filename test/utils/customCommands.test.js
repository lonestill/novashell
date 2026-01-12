import { createJSCommand, removeJSCommand, listJSCommands, getJSCommandTemplate, getJSCommandPath } from '../../src/utils/customCommands.js';
import { assertEquals, assertAsyncThrows } from '../helpers.js';
import { existsSync } from 'fs';
import { unlink } from 'fs/promises';

async function testCustomCommands() {
  const testCommandName = 'test-command-' + Date.now();
  const testCode = `export default async function command(args) {
  console.log('Test command');
  return 0;
}`;
  
  try {
    await createJSCommand(testCommandName, testCode);
    const path = getJSCommandPath(testCommandName);
    assertEquals(existsSync(path), true, 'JS command file should be created');
    
    const commands = await listJSCommands();
    assertEquals(commands.includes(testCommandName), true, 'listJSCommands should include created command');
    
    const template = await getJSCommandTemplate();
    assertEquals(typeof template, 'string', 'getJSCommandTemplate should return string');
    assertEquals(template.length > 0, true, 'Template should not be empty');
    
    await removeJSCommand(testCommandName);
    assertEquals(existsSync(path), false, 'JS command file should be removed');
    
    console.log('✓ customCommands tests passed');
  } catch (error) {
    // Cleanup
    try {
      await removeJSCommand(testCommandName);
    } catch {}
    throw error;
  }
}

testCustomCommands().catch(console.error);
