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
      console.log(chalk.white.bold('Custom Commands:\n'));
      for (const [name, command] of Object.entries(config.customCommands)) {
        console.log(chalk.yellow(`  ${name.padEnd(20)}`) + chalk.gray('→ ') + chalk.green(command));
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
      console.log(chalk.gray('Example: config custom hello "echo Hello World"'));
      console.log(chalk.gray('Example: config custom build "npm run build"'));
      return;
    }
    
    const name = args[1];
    const command = args.slice(2).join(' ');
    
    await setCustomCommand(name, command);
    console.log(chalk.green(`✓ Custom command "${name}" created: ${command}`));
    console.log(chalk.gray('Command will be available immediately.\n'));
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
    
    if (removedCustom || removedAlias) {
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
  console.log(chalk.gray('Usage: config [show|alias|custom|remove|edit]'));
  console.log(chalk.gray('  show                  - Show current configuration'));
  console.log(chalk.gray('  alias <name> <cmd>    - Rename/create command alias'));
  console.log(chalk.gray('  custom <name> <cmd>   - Add custom command'));
  console.log(chalk.gray('  remove <name>         - Remove alias/custom command'));
  console.log(chalk.gray('  edit                  - Show config file location'));
}
