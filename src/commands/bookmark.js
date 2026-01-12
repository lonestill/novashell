import chalk from 'chalk';
import { getBookmarks, addBookmark, removeBookmark, getBookmark } from '../utils/bookmarks.js';
import { cwd } from 'process';
import { existsSync } from 'fs';

export async function bookmarkCommand(args) {
  const action = args[0];
  
  if (!action || action === 'list' || action === 'ls') {
    const bookmarks = await getBookmarks();
    const bookmarkNames = Object.keys(bookmarks);
    
    if (bookmarkNames.length === 0) {
      console.log(chalk.gray('No bookmarks defined. Use "bookmark add <name>" to create one.'));
      return;
    }
    
    console.log(chalk.cyan.bold('\nBookmarks:\n'));
    bookmarkNames.forEach(name => {
      const path = bookmarks[name];
      const exists = existsSync(path);
      const icon = exists ? chalk.green('✓') : chalk.red('✗');
      console.log(
        chalk.gray(`  ${icon} `) +
        chalk.yellow(name.padEnd(20)) +
        chalk.cyan(path)
      );
    });
    console.log('');
    return;
  }
  
  if (action === 'add' || action === 'set') {
    if (args.length < 2) {
      console.error(chalk.red('bookmark: missing bookmark name'));
      console.log(chalk.gray('Usage: bookmark add <name> [path]'));
      return;
    }
    
    const name = args[1];
    const path = args[2] || cwd();
    
    if (!existsSync(path)) {
      console.error(chalk.red(`bookmark: path does not exist: ${path}`));
      return;
    }
    
    await addBookmark(name, path);
    console.log(chalk.green(`✓ Bookmark "${name}" added: ${path}`));
    return;
  }
  
  if (action === 'remove' || action === 'rm' || action === 'delete') {
    if (args.length < 2) {
      console.error(chalk.red('bookmark: missing bookmark name'));
      return;
    }
    
    const name = args[1];
    const removed = await removeBookmark(name);
    if (removed) {
      console.log(chalk.green(`✓ Bookmark "${name}" removed`));
    } else {
      console.error(chalk.red(`bookmark: bookmark "${name}" not found`));
    }
    return;
  }
  
  if (action === 'go' || action === 'cd') {
    if (args.length < 2) {
      console.error(chalk.red('bookmark: missing bookmark name'));
      return;
    }
    
    const name = args[1];
    const path = await getBookmark(name);
    if (path) {
      console.log(path);
    } else {
      console.error(chalk.red(`bookmark: bookmark "${name}" not found`));
    }
    return;
  }
  
  const bookmark = await getBookmark(action);
  if (bookmark) {
    console.log(bookmark);
    return;
  }
  
  console.error(chalk.red(`bookmark: unknown action "${action}"`));
  console.log(chalk.gray('Usage: bookmark [list|add|remove|go] <name>'));
}
