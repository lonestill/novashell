import chalk from 'chalk';
import { getConfig, saveConfig, setCommandAlias, removeCommandAlias, setCustomCommand, removeCustomCommand } from '../utils/config.js';

export async function configCommand(args) {
  const action = args[0];
  
  if (!action || action === 'show' || action === 'list') {
    const config = await getConfig();
    
    console.log(chalk.cyan.bold('\nNovaShell Configuration:\n'));
    
    if (Object.keys(config.commandAliases || {}).length > 0) {
      console.log(chalk.white.bold('Command Aliases (Renames):\n'));
      for (const [alias, command] of Object.entries(config.commandAliases)) {
        console.log(chalk.yellow(`  ${alias.padEnd(20)}`) + chalk.gray('→ ') + chalk.green(command));
      }
      console.log('');
    }
    
    if (Object.keys(config.customCommands || {}).length > 0) {
      console.log(chalk.white.bold('Custom Commands (String):\n'));
      for (const [name, command] of Object.entries(config.customCommands)) {
        console.log(chalk.yellow(`  ${name.padEnd(20)}`) + chalk.gray('→ ') + chalk.green(command));
      }
      console.log('');
    }
    
    const jsCommands = await listJSCommands();
    if (jsCommands.length > 0) {
      console.log(chalk.white.bold('Custom Commands (JS):\n'));
      for (const name of jsCommands) {
        const path = getJSCommandPath(name);
        const exists = existsSync(path);
        const icon = exists ? chalk.green('✓') : chalk.red('✗');
        console.log(chalk.yellow(`  ${icon} ${name.padEnd(18)}`) + chalk.gray(path));
      }
      console.log('');
    }
    
    console.log(chalk.white.bold('Settings:\n'));
    console.log(chalk.yellow(`  historySize:           `) + chalk.green(config.settings?.historySize || 1000));
    console.log(chalk.yellow(`  enableNotifications:   `) + chalk.green(config.settings?.enableNotifications !== false));
    console.log(chalk.yellow(`  notificationThreshold: `) + chalk.green(config.settings?.notificationThreshold || 10000) + 'ms');
    console.log('');
    return;
  }
  
  if (action === 'alias' || action === 'rename') {
    if (args.length < 3) {
      console.error(chalk.red('config: missing arguments'));
      console.log(chalk.gray('Usage: config alias <alias> <command>'));
      console.log(chalk.gray('Example: config alias list ls'));
      return;
    }
    
    const alias = args[1];
    const command = args[2];
    
    await setCommandAlias(alias, command);
    console.log(chalk.green(`✓ Command alias "${alias}" → "${command}" created`));
    console.log(chalk.gray('Alias will be available after restarting NovaShell.\n'));
    return;
  }
  
  if (action === 'unalias' || action === 'unrename') {
    if (args.length < 2) {
      console.error(chalk.red('config: missing alias name'));
      return;
    }
    
    const alias = args[1];
    const removed = await removeCommandAlias(alias);
    if (removed) {
      console.log(chalk.green(`✓ Command alias "${alias}" removed`));
    } else {
      console.error(chalk.red(`config: alias "${alias}" not found`));
    }
    return;
  }
  
  if (action === 'custom' || action === 'add') {
    if (args.length < 3) {
      console.error(chalk.red('config: missing arguments'));
      console.log(chalk.gray('Usage: config custom <name> <command>'));
      console.log(chalk.gray('Usage: config custom <name> --js <file.js>'));
      console.log(chalk.gray('Example: config custom hello "echo Hello World"'));
      console.log(chalk.gray('Example: config custom build "npm run build"'));
      console.log(chalk.gray('Example: config custom mycmd --js ~/mycommand.js'));
      return;
    }
    
    const name = args[1];
    
    if (args[2] === '--js' || args[2] === '--file') {
      if (args.length < 4) {
        console.error(chalk.red('config: missing file path'));
        console.log(chalk.gray('Usage: config custom <name> --js <file.js>'));
        return;
      }
      
      const filePath = args[3];
      const { readFile } = await import('fs/promises');
      const { resolve } = await import('path');
      
      try {
        const code = await readFile(resolve(filePath), 'utf-8');
        await createJSCommand(name, code);
        console.log(chalk.green(`✓ JS command "${name}" created from ${filePath}`));
        console.log(chalk.gray('Command will be available after restarting NovaShell.\n'));
      } catch (error) {
        console.error(chalk.red(`config: Failed to create JS command: ${error.message}`));
      }
      return;
    }
    
    const command = args.slice(2).join(' ');
    await setCustomCommand(name, command);
    console.log(chalk.green(`✓ Custom command "${name}" created: ${command}`));
    console.log(chalk.gray('Command will be available immediately.\n'));
    return;
  }
  
  if (action === 'template' || action === 'init') {
    const name = args[1];
    if (!name) {
      console.error(chalk.red('config: missing command name'));
      console.log(chalk.gray('Usage: config template <name>'));
      return;
    }
    
    const template = await getJSCommandTemplate();
    const path = getJSCommandPath(name);
    const { writeFile } = await import('fs/promises');
    
    try {
      await createJSCommand(name, template);
      console.log(chalk.green(`✓ JS command template created: ${name}`));
      console.log(chalk.gray(`Edit the file: ${path}`));
      console.log(chalk.gray('Command will be available after restarting NovaShell.\n'));
    } catch (error) {
      console.error(chalk.red(`config: Failed to create template: ${error.message}`));
    }
    return;
  }
  
  if (action === 'remove' || action === 'rm') {
    if (args.length < 2) {
      console.error(chalk.red('config: missing command name'));
      return;
    }
    
    const name = args[1];
    const removedCustom = await removeCustomCommand(name);
    const removedAlias = await removeCommandAlias(name);
    const removedJS = await removeJSCommand(name);
    
    if (removedCustom || removedAlias || removedJS) {
      console.log(chalk.green(`✓ Command "${name}" removed`));
    } else {
      console.error(chalk.red(`config: command "${name}" not found`));
    }
    return;
  }
  
  if (action === 'edit') {
    const { join } = await import('path');
    const { homedir } = await import('os');
    const configPath = join(homedir(), '.novashell', 'config.json');
    console.log(chalk.cyan('\nConfiguration file location:'));
    console.log(chalk.yellow(configPath));
    console.log(chalk.gray('\nYou can edit this file directly with your text editor.\n'));
    return;
  }
  
  console.error(chalk.red(`config: unknown action "${action}"`));
  console.log(chalk.gray('Usage: config [show|alias|custom|remove|edit|template]'));
  console.log(chalk.gray('  show                  - Show current configuration'));
  console.log(chalk.gray('  alias <name> <cmd>    - Rename/create command alias'));
  console.log(chalk.gray('  custom <name> <cmd>   - Add custom string command'));
  console.log(chalk.gray('  custom <name> --js <file> - Add custom JS command from file'));
  console.log(chalk.gray('  template <name>       - Create JS command template'));
  console.log(chalk.gray('  remove <name>         - Remove alias/custom/JS command'));
  console.log(chalk.gray('  edit                  - Show config file location'));
}
