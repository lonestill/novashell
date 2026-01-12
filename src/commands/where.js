import chalk from 'chalk';
import { getDirectoryHistory, getTopDirectories } from '../utils/directories.js';
import { getDB } from '../utils/historyDB.js';
import { cwd } from 'process';

export async function whereCommand(args) {
  const filter = args[0];
  
  if (filter === '--top' || filter === '-t') {
    const directories = getTopDirectories(10);
    
    if (directories.length === 0) {
      console.log(chalk.gray('No directory history.'));
      return;
    }
    
    console.log(chalk.cyan.bold('\nMost Used Directories:\n'));
    directories.forEach((dir, index) => {
      const icon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
      console.log(
        chalk.gray(`  ${icon} `) +
        chalk.cyan(dir.directory.padEnd(60)) +
        chalk.green(dir.count + ' commands')
      );
    });
    console.log('');
    return;
  }
  
  if (filter === '--today' || filter === '-d') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const since = today.getTime();
    
    const database = getDB();
    const directories = database.prepare(`
      SELECT DISTINCT directory
      FROM commands
      WHERE timestamp >= ?
      ORDER BY timestamp DESC
    `).all(since);
    
    if (directories.length === 0) {
      console.log(chalk.gray('No directories visited today.'));
      return;
    }
    
    console.log(chalk.cyan.bold('\nDirectories Visited Today:\n'));
    directories.forEach(dir => {
      const isCurrent = dir.directory === cwd();
      const prefix = isCurrent ? chalk.green('→ ') : '  ';
      console.log(prefix + chalk.cyan(dir.directory));
    });
    console.log('');
    return;
  }
  
  const directories = getDirectoryHistory(20);
  
  if (directories.length === 0) {
    console.log(chalk.gray('No directory history.'));
    return;
  }
  
  console.log(chalk.cyan.bold('\nRecent Directories:\n'));
  directories.forEach(dir => {
    const date = new Date(dir.last_used).toLocaleString();
    const isCurrent = dir.directory === cwd();
    const prefix = isCurrent ? chalk.green('→ ') : '  ';
    console.log(
      prefix +
      chalk.cyan(dir.directory.padEnd(55)) +
      chalk.gray(`(${dir.count} commands, ${date})`)
    );
  });
  console.log('');
}
