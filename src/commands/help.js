import chalk from 'chalk';

export async function help(args) {
  const commands = {
    'help': 'Display this help message',
    'clear/cls': 'Clear the terminal screen',
    'exit/quit': 'Exit the shell',
    'echo <text>': 'Print text to the console',
    'cd <directory>': 'Change the current directory',
    'pwd': 'Print the current working directory',
    'ls/dir': 'List files and directories',
    'cat/type <file>': 'Display file contents',
    'history': 'Show command history',
    'env': 'Display environment variables',
    '<command>': 'Execute system commands (e.g., git, npm, etc.)'
  };

  console.log(chalk.cyan.bold('\nAvailable Commands:\n'));
  
  for (const [cmd, desc] of Object.entries(commands)) {
    console.log(chalk.yellow(`  ${cmd.padEnd(25)}`) + desc);
  }
  
  console.log('');
}
