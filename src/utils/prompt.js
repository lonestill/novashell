import { cwd } from 'process';
import { platform, homedir } from 'os';
import chalk from 'chalk';
import { getGitInfo } from './git.js';
import { getCurrentThemeSync, getTheme } from './themes.js';

export function getPrompt() {
  const currentTheme = getCurrentThemeSync();
  const theme = getTheme(currentTheme);
  const promptColors = theme.prompt;
  
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
  
  let prompt = chalk[promptColors.shellName.color]('novashell') + 
               chalk[promptColors.separator.color](':') + 
               chalk[promptColors.path.color](displayPath);
  
  const gitInfo = getGitInfo();
  if (gitInfo) {
    prompt += chalk[promptColors.separator.color](' (');
    prompt += chalk[promptColors.gitBranch.color](gitInfo.branch);
    
    if (gitInfo.hasChanges) {
      prompt += chalk[promptColors.gitChanges.color]('*');
    }
    
    if (gitInfo.ahead > 0) {
      prompt += chalk.green(` ${gitInfo.ahead}↑`);
    }
    
    if (gitInfo.behind > 0) {
      prompt += chalk.red(` ${gitInfo.behind}↓`);
    }
    
    prompt += chalk[promptColors.separator.color](')');
  }
  
  prompt += chalk[promptColors.prompt.color]('$ ') + chalk.reset('');
  
  return prompt;
}
