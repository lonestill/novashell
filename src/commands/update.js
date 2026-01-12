import chalk from 'chalk';
import { getVersion } from '../utils/version.js';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';
import { existsSync } from 'fs';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getCurrentVersion() {
  return getVersion();
}

function getInstallDir() {
  const packageDir = join(__dirname, '..', '..');
  const homeDir = homedir();
  const defaultInstallDir = join(homeDir, '.novashell');
  
  if (existsSync(defaultInstallDir)) {
    return defaultInstallDir;
  }
  
  if (existsSync(join(packageDir, '.git'))) {
    return packageDir;
  }
  
  return defaultInstallDir;
}

function getLatestVersionFromGit() {
  try {
    const installDir = getInstallDir();
    
    if (!existsSync(installDir) || !existsSync(join(installDir, '.git'))) {
      return null;
    }
    
    execSync('git fetch --tags', {
      cwd: installDir,
      stdio: ['ignore', 'ignore', 'ignore']
    });
    
    const latestTag = execSync('git describe --tags --abbrev=0', {
      cwd: installDir,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    
    return latestTag;
  } catch (error) {
    return null;
  }
}

function compareVersions(v1, v2) {
  const cleanV1 = v1.replace(/^v/, '').replace(/-.*$/, '');
  const cleanV2 = v2.replace(/^v/, '').replace(/-.*$/, '');
  
  const parts1 = cleanV1.split('.').map(Number);
  const parts2 = cleanV2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  
  return 0;
}

function askUser(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

export async function updateCommand(args) {
  console.log(chalk.cyan.bold('\nChecking for updates...\n'));
  
  const currentVersion = getCurrentVersion();
  console.log(chalk.gray(`Current version: ${chalk.yellow(currentVersion)}`));
  
  try {
    const latestVersion = getLatestVersionFromGit();
    
    if (!latestVersion) {
      console.log(chalk.red('\nUnable to check for updates. Make sure you are in a git repository.'));
      console.log('');
      return;
    }
    
    console.log(chalk.gray(`Latest version:  ${chalk.yellow(latestVersion)}`));
    
    if (currentVersion === latestVersion || compareVersions(currentVersion, latestVersion) >= 0) {
      console.log(chalk.green('\n✓ You are running the latest version!'));
      console.log('');
      return;
    }
    
    console.log(chalk.yellow(`\n⚠ Update available: ${latestVersion}`));
    console.log(chalk.gray(`\nTo update, run:`));
    console.log(chalk.cyan(`  git pull`));
    console.log(chalk.cyan(`  npm install`));
    console.log(chalk.gray(`\nOr if you want to update to the latest tag:`));
    console.log(chalk.cyan(`  git checkout ${latestVersion}`));
    console.log(chalk.cyan(`  npm install`));
    console.log('');
    
    if (!args.includes('--no-prompt')) {
      const answer = await askUser(chalk.yellow('\nDo you want to update now? (y/n): '));
      
      if (answer === 'y' || answer === 'yes') {
        console.log(chalk.cyan('\nUpdating...\n'));
        
        const installDir = getInstallDir();
        
        try {
          execSync('git pull', {
            cwd: installDir,
            stdio: 'inherit'
          });
          
          console.log(chalk.green('\n✓ Update completed!'));
          console.log(chalk.gray('Run "npm install" to update dependencies if needed.'));
          console.log('');
        } catch (error) {
          console.error(chalk.red('\n✗ Update failed. Please update manually.'));
          console.log('');
        }
      } else {
        console.log(chalk.gray('\nUpdate cancelled.'));
        console.log('');
      }
    }
  } catch (error) {
    console.error(chalk.red(`\nError checking for updates: ${error.message}`));
    console.log('');
  }
}
