import { findSimilarCommands } from '../../src/utils/typoChecker.js';
import { assertEquals } from '../helpers.js';

function testTypoChecker() {
  const commands = ['help', 'echo', 'cd', 'ls', 'cat', 'exit'];
  
  const suggestions1 = findSimilarCommands('hel', commands);
  assertEquals(suggestions1.includes('help'), true, 'Should find "help" for "hel"');
  
  const suggestions2 = findSimilarCommands('ecoh', commands, 0.5);
  assertEquals(suggestions2.includes('echo'), true, 'Should find "echo" for "ecoh" with lower threshold');
  
  const suggestions3 = findSimilarCommands('xyz', commands);
  assertEquals(suggestions3.length, 0, 'Should return empty for unrelated command');
  
  const suggestions4 = findSimilarCommands('ls', commands);
  assertEquals(suggestions4.length, 0, 'Should not suggest exact matches');
  
  console.log('✓ typoChecker tests passed');
}

testTypoChecker();
