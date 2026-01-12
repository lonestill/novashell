import chalk from 'chalk';
import { saveSession, getSession, listSessions, deleteSession } from '../utils/sessions.js';
import { getCommands } from '../utils/historyDB.js';

export async function sessionCommand(args) {
  const action = args[0];
  
  if (!action) {
    console.error(chalk.red('session: missing action'));
    console.log(chalk.gray('Usage: session [save|load|list|delete|create] <name>'));
    return;
  }
  
  try {
    switch (action) {
      case 'save':
      case 'create': {
        const name = args[1];
        if (!name) {
          console.error(chalk.red('session: missing session name'));
          return;
        }
        
        const recentCommands = getCommands({ limit: 20 });
        const commands = recentCommands.map(cmd => cmd.command);
        await saveSession(name, commands);
        console.log(chalk.green(`✓ Session "${name}" saved with ${commands.length} commands`));
        break;
      }
      
      case 'load':
      case 'restore': {
        const name = args[1];
        if (!name) {
          console.error(chalk.red('session: missing session name'));
          return;
        }
        
        const session = await getSession(name);
        if (!session) {
          console.error(chalk.red(`session: session "${name}" not found`));
          return;
        }
        
        console.log(chalk.cyan(`\nSession "${name}" (${session.commands.length} commands):\n`));
        session.commands.forEach((cmd, index) => {
          console.log(chalk.gray(`${String(index + 1).padStart(3)}. `) + chalk.white(cmd));
        });
        console.log(chalk.gray('\nRun these commands manually or use "session exec <name>" to execute them.\n'));
        break;
      }
      
      case 'list':
      case 'ls': {
        const sessions = await listSessions();
        const sessionNames = Object.keys(sessions);
        
        if (sessionNames.length === 0) {
          console.log(chalk.gray('No sessions found.'));
          return;
        }
        
        console.log(chalk.cyan.bold('\nSaved Sessions:\n'));
        sessionNames.forEach(name => {
          const session = sessions[name];
          const date = new Date(session.updatedAt).toLocaleString();
          console.log(
            chalk.yellow(`  ${name.padEnd(20)}`) +
            chalk.gray(`(${session.commands.length} commands, updated: ${date})`)
          );
        });
        console.log('');
        break;
      }
      
      case 'delete':
      case 'rm': {
        const name = args[1];
        if (!name) {
          console.error(chalk.red('session: missing session name'));
          return;
        }
        
        const deleted = await deleteSession(name);
        if (deleted) {
          console.log(chalk.green(`✓ Session "${name}" deleted`));
        } else {
          console.error(chalk.red(`session: session "${name}" not found`));
        }
        break;
      }
      
      default:
        console.error(chalk.red(`session: unknown action "${action}"`));
        console.log(chalk.gray('Available: save, load, list, delete'));
    }
  } catch (error) {
    console.error(chalk.red(`session: ${error.message}`));
  }
}
