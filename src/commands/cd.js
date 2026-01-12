import { chdir } from 'process';
import { existsSync } from 'fs';
import chalk from 'chalk';

export async function cd(args) {
  const targetDir = args[0] || process.env.HOME || process.env.USERPROFILE;
  
  if (!targetDir) {
    console.error(chalk.red('cd: HOME directory not set'));
    return;
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
