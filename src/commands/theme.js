import chalk from 'chalk';
import { getBuiltInThemes, getCurrentTheme, setTheme } from '../utils/themes.js';

export async function themeCommand(args) {
  const action = args[0];
  
  if (!action || action === 'list' || action === 'ls') {
    const themes = getBuiltInThemes();
    const current = await getCurrentTheme();
    
    console.log(chalk.cyan.bold('\nAvailable Themes:\n'));
    
    Object.keys(themes).forEach(name => {
      const theme = themes[name];
      const isCurrent = name === current;
      const prefix = isCurrent ? chalk.green('→ ') : '  ';
      console.log(prefix + chalk.yellow(name.padEnd(15)) + chalk.gray(theme.name));
    });
    
    console.log(chalk.gray('\nUse "theme set <name>" to change theme.'));
    console.log(chalk.gray('Theme changes apply immediately to the next prompt.\n'));
    return;
  }
  
  if (action === 'set') {
    if (args.length < 2) {
      console.error(chalk.red('theme: missing theme name'));
      return;
    }
    
    const themeName = args[1];
    const themes = getBuiltInThemes();
    
    if (!themes[themeName]) {
      console.error(chalk.red(`theme: theme "${themeName}" not found`));
      console.log(chalk.gray('Use "theme list" to see available themes.'));
      return;
    }
    
    await setTheme(themeName);
    console.log(chalk.green(`✓ Theme set to "${themeName}"`));
    console.log(chalk.gray('Theme will be applied to the next prompt.\n'));
    return;
  }
  
  if (action === 'current') {
    const current = await getCurrentTheme();
    console.log(chalk.cyan(current));
    return;
  }
  
  console.error(chalk.red(`theme: unknown action "${action}"`));
  console.log(chalk.gray('Usage: theme [list|set|current]'));
}
