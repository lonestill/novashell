import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { cwd } from 'process';
import chalk from 'chalk';

export async function cat(args) {
  if (args.length === 0) {
    console.error(chalk.red('cat: missing file argument'));
    return;
  }

  const filePath = resolve(cwd(), args[0]);
  
  try {
    const content = await readFile(filePath, 'utf-8');
    console.log(content);
  } catch (error) {
    console.error(chalk.red(`cat: ${error.message}`));
  }
}
