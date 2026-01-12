import chalk from 'chalk';
import { getCommands } from '../utils/historyDB.js';

export async function history(args) {
  const filters = {};
  let searchTerm = null;
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--failed' || arg === '-f') {
      filters.failed = true;
    } else if (arg === '--success' || arg === '-s') {
      filters.failed = false;
    } else if (arg === '--today' || arg === '-t') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filters.since = today.getTime();
    } else if (arg === '--dir' && args[i + 1]) {
      filters.directory = args[i + 1];
      i++;
    } else if (arg === '--branch' && args[i + 1]) {
      filters.gitBranch = args[i + 1];
      i++;
    } else if (arg === '--limit' && args[i + 1]) {
      filters.limit = parseInt(args[i + 1]);
      i++;
    } else if (!arg.startsWith('--')) {
      searchTerm = arg;
    }
  }
  
  if (searchTerm) {
    filters.command = searchTerm;
  }
  
  if (Object.keys(filters).length === 0 && !searchTerm) {
    filters.limit = 50;
  }
  
  try {
    const commands = getCommands(filters);
    
    if (commands.length === 0) {
      console.log(chalk.gray('No commands found matching the criteria.'));
      return;
    }
    
    console.log(chalk.cyan.bold(`\nCommand History (${commands.length} entries):\n`));
    
    commands.forEach((cmd, index) => {
      const date = new Date(cmd.timestamp);
      const timeStr = date.toLocaleString();
      const exitIcon = cmd.exit_code === 0 ? chalk.green('✓') : chalk.red('✗');
      const timeInfo = cmd.execution_time ? ` [${cmd.execution_time}ms]` : '';
      const branchInfo = cmd.git_branch ? chalk.gray(` [${cmd.git_branch}]`) : '';
      
      console.log(
        chalk.gray(`${String(index + 1).padStart(3)}. `) +
        exitIcon + ' ' +
        chalk.yellow(timeStr) +
        branchInfo +
        timeInfo +
        '\n   ' +
        chalk.white(cmd.command) +
        (cmd.directory ? chalk.gray(` (${cmd.directory})`) : '')
      );
    });
    
    console.log('');
  } catch (error) {
    console.error(chalk.red(`history: ${error.message}`));
  }
}
