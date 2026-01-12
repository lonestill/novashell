import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { cwd, platform, env } from 'process';
import { spawn } from 'child_process';
import chalk from 'chalk';

export async function nanoCommand(args) {
  if (args.length === 0) {
    console.error(chalk.red('nano: missing file operand'));
    console.log(chalk.gray('Usage: nano <file>'));
    return;
  }

  const filePath = resolve(cwd(), args[0]);
  const fileExists = existsSync(filePath);
  
  if (!fileExists) {
    try {
      writeFileSync(filePath, '', 'utf-8');
    } catch (error) {
      console.error(chalk.red(`nano: cannot create file: ${error.message}`));
      return;
    }
  }

  const isWindows = platform() === 'win32';
  const editor = env.EDITOR || env.VISUAL || (isWindows ? 'notepad' : 'nano');

  console.log(chalk.cyan.bold(`\nOpening ${filePath} in ${editor}...\n`));

  return new Promise((resolve) => {
    const child = spawn(editor, [filePath], {
      stdio: 'inherit',
      shell: isWindows
    });

    child.on('error', (error) => {
      console.error(chalk.red(`\nnano: Failed to open editor: ${error.message}\n`));
      resolve();
    });

    child.on('exit', (code) => {
      if (code === 0) {
        console.log(chalk.green(`\n✓ File saved: ${filePath}\n`));
      } else {
        console.log(chalk.yellow(`\nEditor exited with code ${code}\n`));
      }
      resolve();
    });
  });
}
