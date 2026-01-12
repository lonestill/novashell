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
  console.log(chalk.gray('Type your content. Press Enter on empty line to finish.\n'));
  
  if (content) {
    console.log(chalk.gray('Current content:\n'));
    console.log(chalk.white(content));
    console.log(chalk.gray('\n--- End of file ---\n'));
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const lines = [];
  let currentLine = '';

  if (content) {
    const existingLines = content.split('\n');
    for (const line of existingLines) {
      lines.push(line);
    }
  }

  function promptLine() {
    if (lines.length > 0) {
      rl.setPrompt(chalk.gray(`[${lines.length + 1}] `));
    } else {
      rl.setPrompt(chalk.gray('[1] '));
    }
    rl.prompt();
  }

  rl.on('line', (input) => {
    if (input.trim() === '' && lines.length > 0 && currentLine === '') {
      rl.close();
      return;
    }
    
    lines.push(input);
    currentLine = input;
    
    if (input.trim() === '' && lines.length > 0) {
      rl.close();
      return;
    }
    
    promptLine();
  });

  rl.on('close', () => {
    const finalContent = lines.join('\n');
    
    try {
      writeFileSync(filePath, finalContent, 'utf-8');
      console.log(chalk.green(`\n✓ File saved: ${filePath}\n`));
    } catch (error) {
      console.error(chalk.red(`\n✗ Error saving file: ${error.message}\n`));
    }
  });

  if (content) {
    console.log(chalk.yellow('Press Enter to start editing, or type new content line by line.\n'));
    promptLine();
  } else {
    console.log(chalk.yellow('Enter file content (empty line to save and exit):\n'));
    promptLine();
  }
}
