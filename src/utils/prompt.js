import { cwd } from 'process';
import { platform, homedir } from 'os';
import chalk from 'chalk';

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
  
  const prompt = chalk.green('novashell') + chalk.gray(':') + 
                 chalk.cyan(displayPath) + 
                 chalk.yellow('$ ') + 
                 chalk.reset('');
  
  return prompt;
}
