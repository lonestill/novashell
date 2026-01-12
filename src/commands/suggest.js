import chalk from 'chalk';
import { getCommands, getDB } from '../utils/historyDB.js';
import { getGitInfo } from '../utils/git.js';
import { cwd } from 'process';

export async function suggestCommand(args) {
  const database = getDB();
  const gitInfo = getGitInfo();
  const currentDir = cwd();
  
  try {
    const recentCommands = getCommands({ directory: currentDir, limit: 10 });
    
    if (recentCommands.length === 0) {
      console.log(chalk.gray('No suggestions available. Start using commands to get suggestions.'));
      return;
    }
    
    console.log(chalk.cyan.bold('\nSuggested Commands:\n'));
    
    const commandCounts = {};
    recentCommands.forEach(cmd => {
      const cmdBase = cmd.command.split(' ')[0];
      commandCounts[cmdBase] = (commandCounts[cmdBase] || 0) + 1;
    });
    
    const sortedCommands = Object.entries(commandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    sortedCommands.forEach(([cmd, count], index) => {
      console.log(
        chalk.gray(`  ${index + 1}. `) +
        chalk.yellow(cmd.padEnd(15)) +
        chalk.gray(`(used ${count}× in this directory)`)
      );
    });
    
    if (gitInfo) {
      console.log(chalk.cyan.bold('\nGit Context:\n'));
      if (gitInfo.hasChanges) {
        console.log(chalk.gray('  • ') + chalk.yellow('git status') + chalk.gray(' - Check changes'));
        console.log(chalk.gray('  • ') + chalk.yellow('git add .') + chalk.gray(' - Stage changes'));
      }
      if (gitInfo.ahead > 0) {
        console.log(chalk.gray('  • ') + chalk.yellow('git push') + chalk.gray(` - Push ${gitInfo.ahead} commit(s)`));
      }
      if (gitInfo.behind > 0) {
        console.log(chalk.gray('  • ') + chalk.yellow('git pull') + chalk.gray(` - Pull ${gitInfo.behind} commit(s)`));
      }
    }
    
    console.log('');
  } catch (error) {
    console.error(chalk.red(`suggest: ${error.message}`));
  }
}
