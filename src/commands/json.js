import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { cwd } from 'process';
import chalk from 'chalk';

export async function json(args) {
  if (args.length === 0) {
    console.error(chalk.red('json: missing operation'));
    console.log(chalk.gray('Usage: json [format|validate|minify|beautify] <file>'));
    return;
  }

  const operation = args[0].toLowerCase();
  const filePath = args[1];

  if (!filePath) {
    console.error(chalk.red('json: missing file argument'));
    return;
  }

  try {
    const fullPath = resolve(cwd(), filePath);
    const content = await readFile(fullPath, 'utf-8');
    
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      console.error(chalk.red(`json: Invalid JSON - ${error.message}`));
      return;
    }

    switch (operation) {
      case 'format':
      case 'beautify':
      case 'pretty':
        console.log(JSON.stringify(parsed, null, 2));
        break;
      
      case 'validate':
        console.log(chalk.green('✓ Valid JSON'));
        break;
      
      case 'minify':
        console.log(JSON.stringify(parsed));
        break;
      
      case 'get':
        if (args.length < 3) {
          console.error(chalk.red('json: get requires a path'));
          return;
        }
        const path = args.slice(2).join('.');
        const keys = path.split('.');
        let value = parsed;
        for (const key of keys) {
          if (value && typeof value === 'object' && key in value) {
            value = value[key];
          } else {
            console.error(chalk.red(`json: path "${path}" not found`));
            return;
          }
        }
        console.log(JSON.stringify(value, null, 2));
        break;
      
      default:
        console.error(chalk.red(`json: unknown operation "${operation}"`));
        console.log(chalk.gray('Available: format, validate, minify, get'));
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(chalk.red(`json: file not found: ${filePath}`));
    } else {
      console.error(chalk.red(`json: ${error.message}`));
    }
  }
}
