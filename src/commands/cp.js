import { copyFile, mkdir } from 'fs/promises';
import { readdir, stat } from 'fs/promises';
import { resolve, dirname, join, basename } from 'path';
import { cwd } from 'process';
import { existsSync } from 'fs';
import chalk from 'chalk';

export async function cpCommand(args) {
  if (args.length < 2) {
    console.error(chalk.red('cp: missing file operand'));
    console.log(chalk.gray('Usage: cp <source> <dest>'));
    return;
  }
  
  const source = resolve(cwd(), args[0]);
  const dest = resolve(cwd(), args[args.length - 1]);
  
  if (!existsSync(source)) {
    console.error(chalk.red(`cp: ${args[0]}: No such file or directory`));
    return;
  }
  
  try {
    const sourceStats = await stat(source);
    const destExists = existsSync(dest);
    const destStats = destExists ? await stat(dest) : null;
    
    if (sourceStats.isDirectory()) {
      console.error(chalk.red('cp: directories not supported yet. Use system cp command.'));
      return;
    }
    
    if (destStats && destStats.isDirectory()) {
      const destPath = join(dest, basename(source));
      await copyFile(source, destPath);
      console.log(chalk.green(`✓ Copied ${basename(source)} to ${destPath}`));
    } else {
      const destDir = dirname(dest);
      if (!existsSync(destDir)) {
        await mkdir(destDir, { recursive: true });
      }
      
      if (destExists) {
        console.log(chalk.yellow(`Warning: ${basename(dest)} already exists. Overwriting...`));
      }
      
      await copyFile(source, dest);
      console.log(chalk.green(`✓ Copied ${basename(source)} to ${dest}`));
    }
  } catch (error) {
    console.error(chalk.red(`cp: ${error.message}`));
  }
}
