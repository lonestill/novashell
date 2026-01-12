import { cwd } from 'process';
import { platform, homedir } from 'os';
import chalk from 'chalk';
import { getGitInfo } from './git.js';

export function getPrompt() {
  const currentDir = cwd();
  const home = homedir();
  const isWindows = platform() === 'win32';
  
  let displayPath = currentDir;
  if (currentDir.startsWith(home)) {
    displayPath = '~' + currentDir.slice(home.length);
  }
  
  if (isWindows) {
    displayPath = displayPath.replace(/\\/g, '/');
  }
  
  let prompt = chalk.green('novashell') + chalk.gray(':') + 
               chalk.cyan(displayPath);
  
  const gitInfo = getGitInfo();
  if (gitInfo) {
    prompt += chalk.gray(' (');
    prompt += chalk.magenta(gitInfo.branch);
    
    if (gitInfo.hasChanges) {
      prompt += chalk.yellow('*');
    }
    
    if (gitInfo.ahead > 0) {
      prompt += chalk.green(` ${gitInfo.ahead}↑`);
    }
    
    if (gitInfo.behind > 0) {
      prompt += chalk.red(` ${gitInfo.behind}↓`);
    }
    
    prompt += chalk.gray(')');
  }
  
  prompt += chalk.yellow('$ ') + chalk.reset('');
  
  return prompt;
}
