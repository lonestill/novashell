#!/usr/bin/env node

import readline from 'readline';
import { spawn } from 'child_process';
import chalk from 'chalk';
import { CommandManager } from './src/CommandManager.js';
import { getPrompt } from './src/utils/prompt.js';

class NovaShell {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      completer: this.completer.bind(this),
      historySize: 1000
    });
    
    this.commandManager = new CommandManager();
    this.history = [];
    this.running = true;
    
    this.rl.on('SIGINT', () => {
      console.log('\n');
      this.displayPrompt();
    });
  }

  completer(line) {
    const commands = this.commandManager.getCommandNames();
    const hits = commands.filter(cmd => cmd.startsWith(line));
    return [hits.length ? hits : commands, line];
  }

  start() {
    console.log(chalk.cyan.bold('Welcome to NovaShell!'));
    console.log(chalk.gray('Type "help" for available commands, "exit" to quit.\n'));
    this.displayPrompt();
  }

  displayPrompt() {
    const prompt = getPrompt();
    this.rl.question(prompt, (input) => {
      this.processInput(input);
    });
  }

  async processInput(input) {
    const trimmed = input.trim();
    
    if (!trimmed) {
      this.displayPrompt();
      return;
    }

    if (trimmed && trimmed !== this.history[this.history.length - 1]) {
      this.history.push(trimmed);
    }

    const parts = this.parseCommand(trimmed);
    const command = parts[0];
    const args = parts.slice(1);

    try {
      if (this.commandManager.hasCommand(command)) {
        await this.commandManager.execute(command, args);
      } 
      else {
        await this.executeSystemCommand(command, args);
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }

    if (this.running) {
      this.displayPrompt();
    }
  }

  parseCommand(input) {
    const parts = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = null;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      
      if ((char === '"' || char === "'") && (i === 0 || input[i - 1] !== '\\')) {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuotes = false;
          quoteChar = null;
        } else {
          current += char;
        }
      } else if (char === ' ' && !inQuotes) {
        if (current) {
          parts.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }
    
    if (current) {
      parts.push(current);
    }

    return parts;
  }

  async executeSystemCommand(command, args) {
    return new Promise((resolve) => {
      const fullCommand = args.length > 0 
        ? `${command} ${args.map(arg => {
            if (arg.includes(' ')) {
              return `"${arg.replace(/"/g, '\\"')}"`;
            }
            return arg;
          }).join(' ')}`
        : command;

      const child = spawn(fullCommand, {
        stdio: 'inherit',
        shell: true
      });

      child.on('error', (error) => {
        console.error(chalk.red(`Command not found: ${command}`));
        resolve();
      });

      child.on('exit', (code) => {
        resolve();
      });
    });
  }

  stop() {
    this.running = false;
    this.rl.close();
    console.log(chalk.cyan('\nGoodbye!'));
    process.exit(0);
  }
}

const shell = new NovaShell();
shell.start();
