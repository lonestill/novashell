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
import { sysinfo } from './commands/sysinfo.js';
import { touch } from './commands/touch.js';
import { random } from './commands/random.js';
import { json } from './commands/json.js';
import { whoami } from './commands/whoami.js';
import { trash } from './commands/trash.js';
import { rmCommand } from './commands/rm.js';
import { stats } from './commands/stats.js';
import { sessionCommand } from './commands/session.js';
import { aliasCommand } from './commands/alias.js';
import { todoCommand } from './commands/todo.js';
import { whereCommand } from './commands/where.js';
import { suggestCommand } from './commands/suggest.js';
import { nextCommand } from './commands/next.js';

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
    this.register('sysinfo', sysinfo);
    this.register('systeminfo', sysinfo);
    this.register('sys', sysinfo);
    this.register('whoami', whoami);
    this.register('me', whoami);
    this.register('info', sysinfo);
    this.register('neofetch', sysinfo);
    this.register('touch', touch);
    this.register('random', random);
    this.register('json', json);
    this.register('trash', trash);
    this.register('recycle', trash);
    this.register('rm', rmCommand);
    this.register('stats', stats);
    this.register('session', sessionCommand);
    this.register('alias', aliasCommand);
    this.register('todo', todoCommand);
    this.register('where', whereCommand);
    this.register('suggest', suggestCommand);
    this.register('next', nextCommand);
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
