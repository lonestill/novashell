import { readFile, readdir, stat } from 'fs/promises';
import { resolve, join } from 'path';
import { cwd } from 'process';
import { existsSync } from 'fs';
import chalk from 'chalk';

export async function grepCommand(args) {
  if (args.length === 0) {
    console.error(chalk.red('grep: missing pattern'));
    console.log(chalk.gray('Usage: grep <pattern> [file...]'));
    return;
  }
  
  const pattern = args[0];
  const files = args.slice(1);
  const regex = new RegExp(pattern, 'i');
  
  if (files.length === 0) {
    console.error(chalk.red('grep: missing file operand'));
    console.log(chalk.gray('Usage: grep <pattern> <file> [file...]'));
    return;
  }
  
  async function searchFile(filePath) {
    if (!existsSync(filePath)) {
      console.error(chalk.red(`grep: ${filePath}: No such file`));
      return;
    }
    
    try {
      const stats = await stat(filePath);
      if (stats.isDirectory()) {
        console.error(chalk.red(`grep: ${filePath}: Is a directory`));
        return;
      }
      
      const content = await readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      const matches = [];
      
      lines.forEach((line, index) => {
        if (regex.test(line)) {
          matches.push({
            lineNumber: index + 1,
            line: line
          });
        }
      });
      
      if (matches.length > 0) {
        console.log(chalk.cyan.bold(`\n${filePath}:\n`));
        matches.forEach(match => {
          const highlighted = match.line.replace(regex, (match) => chalk.bgYellow.black(match));
          console.log(
            chalk.gray(`${String(match.lineNumber).padStart(4)}: `) +
            highlighted
          );
        });
        console.log('');
      }
    } catch (error) {
      if (error.code === 'EISDIR') {
        console.error(chalk.red(`grep: ${filePath}: Is a directory`));
      } else {
        console.error(chalk.red(`grep: ${filePath}: ${error.message}`));
      }
    }
  }
  
  for (const file of files) {
    const filePath = resolve(cwd(), file);
    await searchFile(filePath);
  }
}
