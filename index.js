#!/usr/bin/env node

import readline from 'readline';
import { spawn } from 'child_process';
import chalk from 'chalk';
import { CommandManager } from './src/CommandManager.js';
import { getPrompt } from './src/utils/prompt.js';
import { createCompleter } from './src/utils/completer.js';
import { findSimilarCommands } from './src/utils/typoChecker.js';
import { translitFromCyrillic, hasCyrillic } from './src/utils/translit.js';
import { saveCommand, closeDB } from './src/utils/historyDB.js';
import { logCommand } from './src/utils/logger.js';
import { sendNotification } from './src/utils/notifications.js';
import { getAlias } from './src/utils/aliases.js';

class NovaShell {
  constructor() {
    this.commandManager = new CommandManager();
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      completer: createCompleter(this.commandManager),
      historySize: 1000
    });
    
    this.history = [];
    this.running = true;
    
    this.rl.on('SIGINT', () => {
      console.log('\n');
      this.displayPrompt();
    });
  }

  start() {
    console.log(chalk.cyan.bold('Welcome to NovaShell!'));
    console.log(chalk.gray('Type "help" for available commands, "exit" to quit.\n'));
    process.on('exit', () => closeDB());
    process.on('SIGINT', () => {
      closeDB();
      process.exit(0);
    });
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
    let command = parts[0];
    let args = parts.slice(1);

    const aliasCommand = await getAlias(command);
    if (aliasCommand) {
      const aliasParts = this.parseCommand(aliasCommand);
      command = aliasParts[0];
      args = aliasParts.slice(1).concat(args);
    }

    const startTime = Date.now();
    let exitCode = 0;
    let output = null;

    try {
      if (this.commandManager.hasCommand(command)) {
        await this.commandManager.execute(command, args);
        exitCode = 0;
      } 
      else {
        if (hasCyrillic(command)) {
          const transliteratedCommand = translitFromCyrillic(command);
          await this.askForLayoutConfirmation(command, transliteratedCommand, args, trimmed);
          exitCode = 0;
        } else {
          const similarCommands = findSimilarCommands(
            command, 
            this.commandManager.getCommandNames()
          );
          
          if (similarCommands.length > 0) {
            await this.askForTypoConfirmation(command, similarCommands, args, trimmed);
            exitCode = 0;
          } else {
            exitCode = await this.executeSystemCommand(command, args) || 0;
          }
        }
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      exitCode = 1;
      output = error.message;
    }

    const executionTime = Date.now() - startTime;
    
    try {
      saveCommand(trimmed, exitCode, executionTime, output);
      await logCommand(trimmed, output, exitCode, executionTime);
      
      if (executionTime > 10000) {
        sendNotification(
          'Command Completed',
          `Command finished in ${(executionTime / 1000).toFixed(1)}s`,
          exitCode === 0 ? 'info' : 'error'
        );
      }
    } catch (error) {
    }

    if (this.running) {
      this.displayPrompt();
    }
  }

  async askForLayoutConfirmation(command, transliteratedCommand, args, fullInput) {
    return new Promise((resolve) => {
      console.log(chalk.yellow(`\nCommand "${command}" appears to be in Cyrillic layout.`));
      console.log(chalk.gray(`Did you mean: ${chalk.cyan(transliteratedCommand)}?`));
      
      const prompt = chalk.gray('Use suggested command? (Y/n): ');
      this.rl.question(prompt, (answer) => {
        const normalized = answer.trim().toLowerCase();
        if (normalized === '' || normalized === 'y' || normalized === 'yes') {
          const newInput = fullInput.replace(new RegExp(`^${command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), transliteratedCommand);
          console.log(chalk.green(`Using: ${newInput}\n`));
          
          const newParts = this.parseCommand(newInput);
          const newCmd = newParts[0];
          const newArgs = newParts.slice(1);
          
          if (this.commandManager.hasCommand(newCmd)) {
            this.commandManager.execute(newCmd, newArgs).then(() => {
              resolve();
            }).catch((error) => {
              console.error(chalk.red(`Error: ${error.message}`));
              resolve();
            });
          } else {
            this.executeSystemCommand(newCmd, newArgs).then(() => {
              resolve();
            });
          }
        } else {
          console.log(chalk.gray('Continuing with original command...\n'));
          this.executeSystemCommand(command, args).then(() => {
            resolve();
          });
        }
      });
    });
  }

  async askForTypoConfirmation(command, suggestions, args, fullInput) {
    return new Promise((resolve) => {
      console.log(chalk.yellow(`\nCommand "${command}" not found.`));
      console.log(chalk.gray('Did you mean one of these?'));
      suggestions.forEach((sug, i) => {
        console.log(chalk.cyan(`  ${i + 1}. ${sug}`));
      });
      
      const prompt = chalk.gray('Enter number to use suggested command, or press Enter to continue: ');
      this.rl.question(prompt, async (answer) => {
        const num = parseInt(answer.trim());
        if (num >= 1 && num <= suggestions.length) {
          const selectedCommand = suggestions[num - 1];
          const newInput = fullInput.replace(new RegExp(`^${command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), selectedCommand);
          console.log(chalk.green(`Using: ${newInput}\n`));
          
          const newParts = this.parseCommand(newInput);
          const newCmd = newParts[0];
          const newArgs = newParts.slice(1);
          
          try {
            if (this.commandManager.hasCommand(newCmd)) {
              this.commandManager.execute(newCmd, newArgs).then(() => {
                resolve();
              }).catch((error) => {
                console.error(chalk.red(`Error: ${error.message}`));
                resolve();
              });
            } else {
              this.executeSystemCommand(newCmd, newArgs).then(() => {
                resolve();
              });
            }
          } catch (error) {
            console.error(chalk.red(`Error: ${error.message}`));
            resolve();
          }
        } else {
          console.log(chalk.gray('Continuing with system command...\n'));
          this.executeSystemCommand(command, args).then(() => {
            resolve();
          });
        }
      });
    });
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
        resolve(127);
      });

      child.on('exit', (code) => {
        resolve(code || 0);
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
