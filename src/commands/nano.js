import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { cwd } from 'process';
import readline from 'readline';
import chalk from 'chalk';

export async function nanoCommand(args) {
  if (args.length === 0) {
    console.error(chalk.red('nano: missing file operand'));
    console.log(chalk.gray('Usage: nano <file>'));
    return;
  }

  const filePath = resolve(cwd(), args[0]);
  const fileExists = existsSync(filePath);
  
  let content = '';
  if (fileExists) {
    try {
      content = readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(chalk.red(`nano: cannot open file: ${error.message}`));
      return;
    }
  }

  console.log(chalk.cyan.bold('\n=== NovaShell Editor ===\n'));
  console.log(chalk.gray(`Editing: ${filePath}`));
  
  if (content) {
    console.log(chalk.gray('Current content:\n'));
    console.log(chalk.white(content));
    console.log(chalk.gray('\n--- End of file ---\n'));
  }
  
  console.log(chalk.yellow('Enter new content line by line (empty line to finish):\n'));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const lines = [];

  return new Promise((resolve) => {
    function promptLine() {
      rl.setPrompt(chalk.gray(`[${lines.length + 1}] `));
      rl.prompt();
    }

    rl.on('line', (input) => {
      if (input.trim() === '') {
        if (lines.length > 0) {
          rl.close();
          return;
        }
      } else {
        lines.push(input);
        if (!rl.closed) {
          promptLine();
        }
      }
    });

    rl.on('close', () => {
      const finalContent = lines.join('\n');
      
      try {
        writeFileSync(filePath, finalContent, 'utf-8');
        console.log(chalk.green(`\n✓ File saved: ${filePath}\n`));
      } catch (error) {
        console.error(chalk.red(`\n✗ Error saving file: ${error.message}\n`));
      }
      resolve();
    });

    promptLine();
  });
}
