import chalk from 'chalk';
import { getAliases, saveAlias, removeAlias } from '../utils/aliases.js';
import { getDB } from '../utils/historyDB.js';

export async function aliasCommand(args) {
  if (args.length === 0) {
    const aliases = await getAliases();
    const aliasNames = Object.keys(aliases);
    
    if (aliasNames.length === 0) {
      console.log(chalk.gray('No aliases defined.'));
      return;
    }
    
    console.log(chalk.cyan.bold('\nAliases:\n'));
    aliasNames.forEach(name => {
      console.log(
        chalk.yellow(`  ${name.padEnd(20)}`) +
        chalk.white(aliases[name])
      );
    });
    console.log('');
    return;
  }
  
  const action = args[0];
  
  if (action === 'add' || action === 'set') {
    if (args.length < 3) {
      console.error(chalk.red('alias: missing arguments'));
      console.log(chalk.gray('Usage: alias add <name> <command>'));
      return;
    }
    
    const name = args[1];
    const command = args.slice(2).join(' ');
    await saveAlias(name, command);
    console.log(chalk.green(`✓ Alias "${name}" created: ${command}`));
    return;
  }
  
  if (action === 'remove' || action === 'rm' || action === 'delete') {
    if (args.length < 2) {
      console.error(chalk.red('alias: missing alias name'));
      return;
    }
    
    const name = args[1];
    const removed = await removeAlias(name);
    if (removed) {
      console.log(chalk.green(`✓ Alias "${name}" removed`));
    } else {
      console.error(chalk.red(`alias: alias "${name}" not found`));
    }
    return;
  }
  
  if (action === 'suggest') {
    const database = getDB();
    const topCommands = database.prepare(`
      SELECT command, COUNT(*) as count
      FROM commands
      WHERE LENGTH(command) > 5 AND LENGTH(command) < 50
      GROUP BY command
      HAVING count >= 5
      ORDER BY count DESC
      LIMIT 10
    `).all();
    
    if (topCommands.length === 0) {
      console.log(chalk.gray('No suggestions available. Use more commands to get suggestions.'));
      return;
    }
    
    console.log(chalk.cyan.bold('\nSuggested Aliases (frequently used commands):\n'));
    topCommands.forEach((cmd, index) => {
      const cmdParts = cmd.command.split(' ');
      const suggestedAlias = cmdParts[0].substring(0, 3) + (cmdParts.length > 1 ? cmdParts[1].substring(0, 1) : '');
      console.log(
        chalk.gray(`  ${(index + 1).toString().padStart(2)}. `) +
        chalk.yellow(suggestedAlias.padEnd(10)) +
        chalk.white('→ ') +
        chalk.green(cmd.command.substring(0, 50)) +
        chalk.gray(` (${cmd.count}×)`)
      );
    });
    console.log(chalk.gray('\nUse "alias add <name> <command>" to create an alias.\n'));
    return;
  }
  
  console.error(chalk.red(`alias: unknown action "${action}"`));
  console.log(chalk.gray('Usage: alias [list|add|remove|suggest]'));
}
