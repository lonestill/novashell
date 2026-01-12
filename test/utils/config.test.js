import { getConfigSync, getCustomCommandsSync, getCommandAliasesSync } from '../../src/utils/config.js';
import { assertEquals } from '../helpers.js';

function testConfig() {
  const config = getConfigSync();
  assertEquals(typeof config, 'object', 'getConfigSync should return object');
  assertEquals(typeof config.customCommands, 'object', 'Config should have customCommands');
  assertEquals(typeof config.commandAliases, 'object', 'Config should have commandAliases');
  assertEquals(typeof config.settings, 'object', 'Config should have settings');
  
  const customCommands = getCustomCommandsSync();
  assertEquals(typeof customCommands, 'object', 'getCustomCommandsSync should return object');
  
  const aliases = getCommandAliasesSync();
  assertEquals(typeof aliases, 'object', 'getCommandAliasesSync should return object');
  
  console.log('✓ config tests passed');
}

testConfig();
