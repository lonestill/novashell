import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { resolve } from 'path';
import { cwd } from 'process';
import { existsSync } from 'fs';
import chalk from 'chalk';

export async function touch(args) {
  if (args.length === 0) {
    console.error(chalk.red('touch: missing file operand'));
    return;
  }

  for (const file of args) {
    const filePath = resolve(cwd(), file);
    const dir = dirname(filePath);

    try {
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }

      if (!existsSync(filePath)) {
        await writeFile(filePath, '');
      } else {
        const { utimes } = await import('fs/promises');
        const now = new Date();
        await utimes(filePath, now, now);
      }
    } catch (error) {
      console.error(chalk.red(`touch: ${error.message}`));
    }
  }
}
