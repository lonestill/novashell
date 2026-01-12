import { readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { cwd } from 'process';
import { getCommandDescription } from './commandMetadata.js';

const FILE_COMMANDS = ['cat', 'type', 'touch', 'trash', 'recycle', 'rm', 'cp', 'copy', 'mv', 'move', 'grep', 'find', 'ls', 'dir'];
const DIR_COMMANDS = ['cd'];

const COMMAND_ARGUMENTS = {
  json: ['format', 'validate', 'minify', 'beautify', 'pretty', 'get'],
  random: ['string', 'number', 'uuid', 'hex', 'bytes', 'commit'],
  history: ['--failed', '--success', '--today', '--dir', '--branch', '--limit', '-f', '-s', '-t'],
  session: ['save', 'load', 'list', 'delete'],
  alias: ['add', 'remove', 'suggest', 'list'],
  todo: ['add', 'done', 'remove', 'list'],
  bookmark: ['add', 'remove', 'list', 'go'],
  theme: ['list', 'set', 'current'],
  config: ['show', 'alias', 'custom', 'remove', 'edit', 'template'],
  update: ['--no-prompt']
};

export function createCompleter(commandManager) {
  return (line) => {
    try {
      const trimmed = line.trim();
      const parts = trimmed.split(/\s+/);
      const command = parts[0] || '';
      const currentArg = parts[parts.length - 1] || '';
      const isFirstWord = parts.length === 1;

      if (isFirstWord) {
        return completeCommand(currentArg, commandManager);
      } else {
        return completeArgument(command, currentArg, parts, trimmed.endsWith(' '));
      }
    } catch (error) {
      return [[], line];
    }
  };
}

function completeCommand(line, commandManager) {
  const commands = commandManager.getCommandNames();
  const hits = commands.filter(cmd => cmd.startsWith(line));
  
  if (hits.length === 0) {
    return [commands, line];
  }

  if (hits.length === 1 && hits[0] === line) {
    return [[hits[0] + ' '], line];
  }

  return [hits, line];
}

function completeArgument(command, currentArg, parts, endsWithSpace) {
  if (command === 'json') {
    if (parts.length === 2) {
      const args = COMMAND_ARGUMENTS.json || [];
      const matches = args.filter(arg => arg.startsWith(currentArg));
      return [matches.length > 0 ? matches : args, currentArg];
    } else if (parts.length >= 3) {
      return completeFile(currentArg, false);
    }
  }

  if (command === 'random') {
    if (parts.length === 2) {
      const args = COMMAND_ARGUMENTS.random || [];
      const matches = args.filter(arg => arg.startsWith(currentArg));
      return [matches.length > 0 ? matches : args, currentArg];
    }
  }

  if (command === 'history') {
    const args = COMMAND_ARGUMENTS.history || [];
    const usedArgs = parts.slice(1);
    const availableArgs = args.filter(arg => {
      if (usedArgs.includes(arg)) return false;
      if (arg.startsWith('--')) {
        const shortVersion = arg.replace('--', '-');
        if (usedArgs.includes(shortVersion)) return false;
      } else if (arg.startsWith('-') && arg.length === 2) {
        const longVersion = arg.replace('-', '--') + arg.slice(1);
        if (usedArgs.includes(longVersion)) return false;
      }
      return arg.startsWith(currentArg);
    });
    
    if (availableArgs.length > 0) {
      return [availableArgs, currentArg];
    }
    
    if (currentArg.startsWith('--') || currentArg.startsWith('-')) {
      return [args.filter(arg => arg.startsWith(currentArg) && !usedArgs.includes(arg)), currentArg];
    }
  }

  const needsFile = FILE_COMMANDS.includes(command);
  const needsDirectory = DIR_COMMANDS.includes(command);

  if (needsFile || needsDirectory) {
    return completeFile(currentArg, needsDirectory);
  }

  return [[], currentArg];
}

function completeFile(line, directoriesOnly = false) {
  try {
    const normalized = line.replace(/\\/g, '/');
    const pathParts = normalized.split('/').filter(p => p !== '');
    const searchDir = pathParts.length > 1 
      ? resolve(cwd(), ...pathParts.slice(0, -1))
      : cwd();
    
    const searchPattern = pathParts[pathParts.length - 1] || '';

    if (!existsSync(searchDir)) {
      return [[], line];
    }

    const items = readdirSync(searchDir);
    const matches = [];

    for (const item of items) {
      if (searchPattern && !item.startsWith(searchPattern)) continue;

      try {
        const fullPath = join(searchDir, item);
        const stats = statSync(fullPath);
        
        if (directoriesOnly && !stats.isDirectory()) continue;
        
        const displayName = item + (stats.isDirectory() ? '/' : '');
        matches.push(displayName);
      } catch {
        matches.push(item);
      }
    }

    if (matches.length === 0) {
      return [[], line];
    }

    if (matches.length === 1) {
      const match = matches[0];
      const prefix = pathParts.length > 1 
        ? pathParts.slice(0, -1).join('/') + '/'
        : '';
      const completion = prefix + match + (match.endsWith('/') ? '' : ' ');
      return [[completion], line];
    }

    const commonPrefix = findCommonPrefix(matches);
    if (commonPrefix && commonPrefix.length > searchPattern.length) {
      return [[commonPrefix], line];
    }

    const prefix = pathParts.length > 1 
      ? pathParts.slice(0, -1).join('/') + '/'
      : '';
    
    const completions = matches.map(m => prefix + m);
    return [completions, line];
  } catch (error) {
    return [[], line];
  }
}

function findCommonPrefix(strings) {
  if (strings.length === 0) return '';
  if (strings.length === 1) return strings[0];

  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (prefix === '') return '';
    }
  }
  return prefix;
}
