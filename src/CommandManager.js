import { help } from './commands/help.js';
import { clear } from './commands/clear.js';
import { exit } from './commands/exit.js';
import { echo } from './commands/echo.js';
import { cd } from './commands/cd.js';
import { pwd } from './commands/pwd.js';
import { ls } from './commands/ls.js';
import { cat } from './commands/cat.js';
import { history } from './commands/history.js';
import { env } from './commands/env.js';

export class CommandManager {
  constructor() {
    this.commands = new Map();
    this.registerDefaultCommands();
  }

  registerDefaultCommands() {
    this.register('help', help);
    this.register('clear', clear);
    this.register('cls', clear);
    this.register('exit', exit);
    this.register('quit', exit);
    this.register('echo', echo);
    this.register('cd', cd);
    this.register('pwd', pwd);
    this.register('ls', ls);
    this.register('dir', ls);
    this.register('cat', cat);
    this.register('type', cat);
    this.register('history', history);
    this.register('env', env);
  }

  register(name, handler) {
    this.commands.set(name, handler);
  }

  hasCommand(name) {
    return this.commands.has(name);
  }

  async execute(name, args) {
    const handler = this.commands.get(name);
    if (handler) {
      return await handler(args);
    }
    throw new Error(`Command "${name}" not found`);
  }

  getCommandNames() {
    return Array.from(this.commands.keys());
  }
}
