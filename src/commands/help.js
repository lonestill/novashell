import chalk from 'chalk';
import { getCommandMetadata, getAllCommandMetadata } from '../utils/commandMetadata.js';
import { CommandManager } from '../CommandManager.js';

export async function help(args) {
  if (args.length > 0) {
    const commandName = args[0];
    const metadata = getCommandMetadata(commandName);
    
    if (metadata) {
      console.log(chalk.cyan.bold(`\n${commandName.toUpperCase()}\n`));
      console.log(chalk.white(metadata.description));
      console.log(chalk.gray('\nUsage:'));
      console.log(chalk.yellow(`  ${metadata.usage}`));
      
      if (metadata.aliases && metadata.aliases.length > 0) {
        console.log(chalk.gray('\nAliases:'));
        console.log(chalk.yellow(`  ${metadata.aliases.join(', ')}`));
      }
      
      if (metadata.arguments && metadata.arguments.length > 0) {
        console.log(chalk.gray('\nArguments:'));
        metadata.arguments.forEach(arg => {
          const name = typeof arg === 'string' ? arg : arg.name;
          const desc = typeof arg === 'string' ? '' : arg.description;
          const req = typeof arg === 'string' ? '' : (arg.required ? chalk.red(' [required]') : chalk.gray(' [optional]'));
          console.log(chalk.yellow(`  ${name.padEnd(25)}`) + desc + req);
        });
      }
      
      if (metadata.examples && metadata.examples.length > 0) {
        console.log(chalk.gray('\nExamples:'));
        metadata.examples.forEach(example => {
          console.log(chalk.green(`  ${example}`));
        });
      }
      
      console.log('');
    } else {
      console.error(chalk.red(`No help available for command: ${commandName}`));
      console.log(chalk.gray('Use "help" to see all available commands.\n'));
    }
    return;
  }

  const commands = {
    'help': 'Display this help message',
    'clear/cls': 'Clear the terminal screen',
    'exit/quit': 'Exit the shell',
    'echo <text>': 'Print text to the console',
    'cd <directory>': 'Change the current directory',
    'pwd': 'Print the current working directory',
    'ls/dir': 'List files and directories',
    'cat/type <file>': 'Display file contents',
    'history [options]': 'Show command history with filters',
    'env': 'Display environment variables',
    'sysinfo/sys/systeminfo': 'Display system information',
    'whoami/me': 'Display current username',
    'touch <file>': 'Create file(s) or update timestamp',
    'random [type]': 'Generate random values (string, number, uuid, hex)',
    'json [op] <file>': 'Format/validate/minify JSON files',
    'trash/recycle <file>': 'Move file(s) to recycle bin/trash',
    'rm <file>': 'Remove file(s) (moves to trash by default, use --force for permanent)',
    'stats': 'Show command usage statistics',
    'session [save|load|list|delete] <name>': 'Manage command sessions',
    'alias [list|add|remove|suggest]': 'Manage command aliases',
    'todo [list|add|done|remove]': 'Task management',
    'where [--top|--today]': 'Show directory history',
    'suggest': 'Get command suggestions based on context',
    'next': 'What to do next (based on patterns)',
    'bookmark [list|add|remove|go]': 'Manage directory bookmarks',
    'cp/copy <source> <dest>': 'Copy files',
    'mv/move <source> <dest>': 'Move files',
    'find [dir] <pattern>': 'Search for files',
    'grep <pattern> <file>': 'Search in files',
    'theme [list|set|current]': 'Manage prompt themes',
    'config [show|alias|custom]': 'Manage configuration (aliases, custom commands)',
    '<command>': 'Execute system commands (e.g., git, npm, etc.)'
  };

  console.log(chalk.cyan.bold('\nAvailable Commands:\n'));
  
  for (const [cmd, desc] of Object.entries(commands)) {
    console.log(chalk.yellow(`  ${cmd.padEnd(25)}`) + desc);
  }
  
  console.log(chalk.gray('\nUse "help <command>" for detailed information about a specific command.\n'));
}
