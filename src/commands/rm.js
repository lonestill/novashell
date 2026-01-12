import { unlink, rm } from 'fs/promises';
import { resolve } from 'path';
import { cwd } from 'process';
import { existsSync, statSync } from 'fs';
import chalk from 'chalk';
import { trash } from './trash.js';

export async function rmCommand(args) {
  if (args.length === 0) {
    console.error(chalk.red('rm: missing file operand'));
    return;
  }

  const force = args.includes('--force') || args.includes('-f');
  const recursive = args.includes('-r') || args.includes('-R') || args.includes('--recursive');
  const files = args.filter(arg => !arg.startsWith('-'));

  if (files.length === 0) {
    console.error(chalk.red('rm: missing file operand'));
    return;
  }

  for (const file of files) {
    const filePath = resolve(cwd(), file);
    
    if (!existsSync(filePath)) {
      console.error(chalk.red(`rm: ${file}: No such file or directory`));
      continue;
    }

    try {
      if (force) {
        await removePermanently(filePath, recursive);
      } else {
        await trash([file]);
      }
    } catch (error) {
      console.error(chalk.red(`rm: ${error.message}`));
    }
  }
}

async function removePermanently(filePath, recursive) {
  const stats = statSync(filePath);
  
  if (stats.isDirectory()) {
    if (recursive) {
      await rm(filePath, { recursive: true, force: true });
    } else {
      throw new Error(`${filePath}: is a directory (use -r to remove)`);
    }
  } else {
    await unlink(filePath);
  }
}
