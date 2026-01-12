import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import chalk from 'chalk';

export async function ls(args) {
  const targetDir = args[0] || cwd();
  
  try {
    const items = await readdir(targetDir);
    const details = await Promise.all(
      items.map(async (item) => {
        const fullPath = join(targetDir, item);
        try {
          const stats = await stat(fullPath);
          return { name: item, isDirectory: stats.isDirectory() };
        } catch {
          return { name: item, isDirectory: false };
        }
      })
    );

    details.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    const formatted = details.map(item => {
      const name = item.isDirectory ? `${item.name}/` : item.name;
      return item.isDirectory ? chalk.blue(name) : name;
    });

    console.log(formatted.join('  '));
  } catch (error) {
    console.error(chalk.red(`ls: ${error.message}`));
  }
}
