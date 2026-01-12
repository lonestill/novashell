import { chdir } from 'process';
import { existsSync } from 'fs';
import chalk from 'chalk';
import { getBookmark } from '../utils/bookmarks.js';

export async function cd(args) {
  let targetDir = args[0] || process.env.HOME || process.env.USERPROFILE;
  
  if (!targetDir) {
    console.error(chalk.red('cd: HOME directory not set'));
    return;
  }

  const bookmark = await getBookmark(targetDir);
  if (bookmark) {
    targetDir = bookmark;
  }

  if (!existsSync(targetDir)) {
    console.error(chalk.red(`cd: ${targetDir}: No such file or directory`));
    return;
  }

  try {
    chdir(targetDir);
  } catch (error) {
    console.error(chalk.red(`cd: ${error.message}`));
  }
}
