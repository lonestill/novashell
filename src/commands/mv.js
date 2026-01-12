import { rename, mkdir } from 'fs/promises';
import { copyFile, unlink } from 'fs/promises';
import { stat } from 'fs/promises';
import { resolve, dirname, join, basename } from 'path';
import { cwd } from 'process';
import { existsSync } from 'fs';
import chalk from 'chalk';

export async function mvCommand(args) {
  if (args.length < 2) {
    console.error(chalk.red('mv: missing file operand'));
    console.log(chalk.gray('Usage: mv <source> <dest>'));
    return;
  }
  
  const source = resolve(cwd(), args[0]);
  const dest = resolve(cwd(), args[args.length - 1]);
  
  if (!existsSync(source)) {
    console.error(chalk.red(`mv: ${args[0]}: No such file or directory`));
    return;
  }
  
  try {
    const sourceStats = await stat(source);
    const destExists = existsSync(dest);
    const destStats = destExists ? await stat(dest) : null;
    
    if (sourceStats.isDirectory()) {
      console.error(chalk.red('mv: directories not supported yet. Use system mv command.'));
      return;
    }
    
    if (destStats && destStats.isDirectory()) {
      const destPath = join(dest, basename(source));
      await copyFile(source, destPath);
      await unlink(source);
      console.log(chalk.green(`✓ Moved ${basename(source)} to ${destPath}`));
    } else {
      const destDir = dirname(dest);
      if (destDir !== dirname(source)) {
        if (!existsSync(destDir)) {
          await mkdir(destDir, { recursive: true });
        }
        await copyFile(source, dest);
        await unlink(source);
      } else {
        await rename(source, dest);
      }
      console.log(chalk.green(`✓ Moved ${basename(source)} to ${dest}`));
    }
  } catch (error) {
    console.error(chalk.red(`mv: ${error.message}`));
  }
}
