import { readdir, stat } from 'fs/promises';
import { resolve, join } from 'path';
import { cwd } from 'process';
import { existsSync } from 'fs';
import chalk from 'chalk';

export async function findCommand(args) {
  if (args.length === 0) {
    console.error(chalk.red('find: missing search pattern'));
    console.log(chalk.gray('Usage: find [directory] <pattern>'));
    return;
  }
  
  let searchDir = cwd();
  let pattern = args[0];
  
  if (args.length > 1 && existsSync(resolve(cwd(), args[0]))) {
    searchDir = resolve(cwd(), args[0]);
    pattern = args[1];
  }
  
  if (!existsSync(searchDir)) {
    console.error(chalk.red(`find: ${searchDir}: No such directory`));
    return;
  }
  
  const regex = new RegExp(pattern.replace(/\*/g, '.*'), 'i');
  const results = [];
  
  async function searchDirectory(dir, depth = 0, maxDepth = 10) {
    if (depth > maxDepth) return;
    
    try {
      const entries = await readdir(dir);
      
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        
        try {
          const stats = await stat(fullPath);
          
          if (regex.test(entry)) {
            results.push({
              path: fullPath,
              name: entry,
              isDirectory: stats.isDirectory()
            });
          }
          
          if (stats.isDirectory()) {
            await searchDirectory(fullPath, depth + 1, maxDepth);
          }
        } catch (error) {
          // Skip files we can't access
        }
      }
    } catch (error) {
      // Skip directories we can't access
    }
  }
  
  try {
    await searchDirectory(searchDir);
    
    if (results.length === 0) {
      console.log(chalk.gray(`No files found matching "${pattern}"`));
      return;
    }
    
    console.log(chalk.cyan.bold(`\nFound ${results.length} result(s):\n`));
    
    results.forEach(result => {
      const icon = result.isDirectory ? chalk.blue('📁') : chalk.gray('📄');
      const path = result.path;
      console.log(`${icon} ${chalk.cyan(path)}`);
    });
    
    console.log('');
  } catch (error) {
    console.error(chalk.red(`find: ${error.message}`));
  }
}
