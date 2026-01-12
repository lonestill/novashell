import { CommandManager } from '../src/CommandManager.js';
import { assertEquals } from './helpers.js';

async function testCommandManager() {
  const manager = new CommandManager();
  
  assertEquals(manager.hasCommand('help'), true, 'CommandManager should have help command');
  assertEquals(manager.hasCommand('echo'), true, 'CommandManager should have echo command');
  assertEquals(manager.hasCommand('nonexistent'), false, 'CommandManager should not have nonexistent command');
  
  const commandNames = manager.getCommandNames();
  assertEquals(commandNames.includes('help'), true, 'getCommandNames should include help');
  assertEquals(commandNames.includes('echo'), true, 'getCommandNames should include echo');
  
  let output = '';
  const originalLog = console.log;
  console.log = (...args) => {
    output = args.join(' ');
  };
  
  try {
    await manager.execute('echo', ['test']);
    assertEquals(output, 'test', 'CommandManager should execute echo command');
    
    console.log = originalLog;
    console.log('✓ CommandManager tests passed');
  } catch (error) {
    console.log = originalLog;
    throw error;
  }
}

testCommandManager().catch(console.error);
