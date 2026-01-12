import chalk from 'chalk';
import { getCommands } from '../utils/historyDB.js';
import { getGitInfo } from '../utils/git.js';
import { cwd } from 'process';
import { existsSync } from 'fs';
import { join } from 'path';

export async function nextCommand(args) {
  const currentDir = cwd();
  const gitInfo = getGitInfo();
  
  try {
    const lastCommand = getCommands({ limit: 1 })[0];
    
    console.log(chalk.cyan.bold('\nWhat to do next:\n'));
    
    if (!lastCommand) {
      console.log(chalk.gray('  No command history. Start by running some commands.'));
      console.log('');
      return;
    }
    
    const lastCmd = lastCommand.command.split(' ')[0];
    const recentCommands = getCommands({ directory: currentDir, limit: 20 });
    
    const patterns = {};
    for (let i = 0; i < recentCommands.length - 1; i++) {
      const current = recentCommands[i].command.split(' ')[0];
      const next = recentCommands[i + 1].command.split(' ')[0];
      const key = `${current} -> ${next}`;
      patterns[key] = (patterns[key] || 0) + 1;
    }
    
    const sortedPatterns = Object.entries(patterns)
      .filter(([pattern]) => pattern.startsWith(lastCmd + ' ->'))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    if (sortedPatterns.length > 0) {
      console.log(chalk.white('Based on your patterns:\n'));
      sortedPatterns.forEach(([pattern, count], index) => {
        const nextCmd = pattern.split(' -> ')[1];
        console.log(
          chalk.gray(`  ${index + 1}. `) +
          chalk.yellow(nextCmd) +
          chalk.gray(` (you often run this after ${lastCmd}, ${count}×)`)
        );
      });
    }
    
    if (gitInfo) {
      console.log(chalk.white('\nGit suggestions:\n'));
      if (gitInfo.hasChanges) {
        console.log(chalk.gray('  • ') + chalk.yellow('git status') + chalk.gray(' - View changes'));
      }
      if (gitInfo.ahead > 0) {
        console.log(chalk.gray('  • ') + chalk.yellow('git push') + chalk.gray(` - Push ${gitInfo.ahead} commit(s)`));
      }
    }
    
    if (existsSync(join(currentDir, 'package.json'))) {
      console.log(chalk.white('\nProject context:\n'));
      console.log(chalk.gray('  • ') + chalk.yellow('npm install') + chalk.gray(' - Install dependencies'));
      console.log(chalk.gray('  • ') + chalk.yellow('npm start') + chalk.gray(' - Start project'));
    }
    
    console.log('');
  } catch (error) {
    console.error(chalk.red(`next: ${error.message}`));
  }
}
