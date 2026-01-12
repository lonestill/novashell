#!/usr/bin/env node

import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commandsDir = join(__dirname, '..', 'src', 'commands');
const commands = (await readdir(commandsDir))
  .filter(f => f.endsWith('.js') && f !== 'exit.js')
  .map(f => f.replace('.js', ''))
  .sort();

const completerFile = join(__dirname, '..', 'src', 'utils', 'completer.js');
const metadataFile = join(__dirname, '..', 'src', 'utils', 'commandMetadata.js');
const commandsMdFile = join(__dirname, '..', 'COMMANDS.md');

const completerContent = readFileSync(completerFile, 'utf-8');
const metadataContent = readFileSync(metadataFile, 'utf-8');
const commandsMdContent = readFileSync(commandsMdFile, 'utf-8');

console.log(`\nChecking coverage for ${commands.length} commands:\n`);
console.log('='.repeat(80));

const issues = {
  completer: [],
  metadata: [],
  commandsMd: []
};

for (const cmd of commands) {
  const cmdPattern = new RegExp(`['"]${cmd}['"]`);
  const hasCompleter = completerContent.includes(`'${cmd}'`) || completerContent.includes(`"${cmd}"`);
  const hasMetadata = metadataContent.includes(`'${cmd}':`) || metadataContent.includes(`"${cmd}":`);
  const hasCommandsMd = commandsMdContent.includes(`### \`${cmd}\``) || commandsMdContent.includes(`### \`${cmd}/`);

  if (!hasCompleter) {
    issues.completer.push(cmd);
  }
  if (!hasMetadata) {
    issues.metadata.push(cmd);
  }
  if (!hasCommandsMd) {
    issues.commandsMd.push(cmd);
  }

  const status = [
    hasCompleter ? '✓' : '✗',
    hasMetadata ? '✓' : '✗',
    hasCommandsMd ? '✓' : '✗'
  ].join(' ');

  console.log(`${cmd.padEnd(20)} Completer: ${status}`);
}

console.log('\n' + '='.repeat(80));
console.log('\nSummary:\n');

if (issues.completer.length > 0) {
  console.log(`✗ Missing in completer (${issues.completer.length}):`, issues.completer.join(', '));
} else {
  console.log('✓ All commands have completer support');
}

if (issues.metadata.length > 0) {
  console.log(`✗ Missing in metadata (${issues.metadata.length}):`, issues.metadata.join(', '));
} else {
  console.log('✓ All commands have metadata');
}

if (issues.commandsMd.length > 0) {
  console.log(`✗ Missing in COMMANDS.md (${issues.commandsMd.length}):`, issues.commandsMd.join(', '));
} else {
  console.log('✓ All commands are documented in COMMANDS.md');
}

console.log('');
