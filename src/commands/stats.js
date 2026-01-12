import chalk from 'chalk';
import { getDB } from '../utils/historyDB.js';

export async function stats(args) {
  const database = getDB();
  
  try {
    const totalCommands = database.prepare('SELECT COUNT(*) as count FROM commands').get().count;
    const successfulCommands = database.prepare('SELECT COUNT(*) as count FROM commands WHERE exit_code = 0').get().count;
    const failedCommands = database.prepare('SELECT COUNT(*) as count FROM commands WHERE exit_code != 0').get().count;
    const avgExecutionTime = database.prepare('SELECT AVG(execution_time) as avg FROM commands WHERE execution_time > 0').get().avg || 0;
    
    const topCommands = database.prepare(`
      SELECT command, COUNT(*) as count, 
             AVG(execution_time) as avg_time,
             SUM(CASE WHEN exit_code = 0 THEN 1 ELSE 0 END) as successes,
             SUM(CASE WHEN exit_code != 0 THEN 1 ELSE 0 END) as failures
      FROM commands
      GROUP BY command
      ORDER BY count DESC
      LIMIT 10
    `).all();
    
    const topDirectories = database.prepare(`
      SELECT directory, COUNT(*) as count
      FROM commands
      GROUP BY directory
      ORDER BY count DESC
      LIMIT 10
    `).all();
    
    const topBranches = database.prepare(`
      SELECT git_branch, COUNT(*) as count
      FROM commands
      WHERE git_branch IS NOT NULL
      GROUP BY git_branch
      ORDER BY count DESC
      LIMIT 5
    `).all();
    
    console.log(chalk.cyan.bold('\n╭─────────────────────────────────────────╮'));
    console.log(chalk.cyan.bold('│') + '        ' + chalk.white.bold('Command Statistics') + '        ' + chalk.cyan.bold('│'));
    console.log(chalk.cyan.bold('╰─────────────────────────────────────────╯\n'));
    
    console.log(chalk.white.bold('Overview'));
    console.log(chalk.gray('  ├─') + chalk.white(' Total commands:     ') + chalk.green(totalCommands.toLocaleString()));
    console.log(chalk.gray('  ├─') + chalk.white(' Successful:         ') + chalk.green(successfulCommands.toLocaleString()) + 
                chalk.gray(` (${((successfulCommands / totalCommands) * 100).toFixed(1)}%)`));
    console.log(chalk.gray('  ├─') + chalk.white(' Failed:             ') + chalk.red(failedCommands.toLocaleString()) + 
                chalk.gray(` (${((failedCommands / totalCommands) * 100).toFixed(1)}%)`));
    console.log(chalk.gray('  └─') + chalk.white(' Avg execution time: ') + chalk.green(avgExecutionTime.toFixed(0) + 'ms'));
    
    if (topCommands.length > 0) {
      console.log(chalk.white.bold('\nTop Commands'));
      topCommands.forEach((cmd, index) => {
        const successRate = cmd.count > 0 ? ((cmd.successes / cmd.count) * 100).toFixed(0) : 0;
        const icon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
        const cmdName = cmd.command.substring(0, 40) + (cmd.command.length > 40 ? '...' : '');
        console.log(
          chalk.gray(`  ${icon} `) +
          chalk.yellow(cmdName.padEnd(43)) +
          chalk.green(`${cmd.count}`.padStart(5) + '×') +
          chalk.gray(` (${successRate}% success, ${cmd.avg_time ? cmd.avg_time.toFixed(0) : 0}ms avg)`)
        );
      });
    }
    
    if (topDirectories.length > 0) {
      console.log(chalk.white.bold('\nTop Directories'));
      topDirectories.slice(0, 5).forEach(dir => {
        const shortDir = dir.directory.length > 50 
          ? '...' + dir.directory.slice(-47)
          : dir.directory;
        console.log(
          chalk.gray('  • ') +
          chalk.cyan(shortDir.padEnd(53)) +
          chalk.green(dir.count + ' commands')
        );
      });
    }
    
    if (topBranches.length > 0) {
      console.log(chalk.white.bold('\nTop Git Branches'));
      topBranches.forEach(branch => {
        console.log(
          chalk.gray('  • ') +
          chalk.magenta(branch.git_branch.padEnd(30)) +
          chalk.green(branch.count + ' commands')
        );
      });
    }
    
    console.log('');
  } catch (error) {
    console.error(chalk.red(`stats: ${error.message}`));
  }
}
