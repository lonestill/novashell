import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

function getGitVersion() {
  try {
    const installDir = getInstallDir();
    
    if (!existsSync(installDir) || !existsSync(join(installDir, '.git'))) {
      return null;
    }
    
    const version = execSync('git describe --tags --always', {
      cwd: installDir,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    return version;
  } catch (error) {
    return null;
  }
}

function getPackageVersion() {
  try {
    const installDir = getInstallDir();
    const packagePath = join(installDir, 'package.json');
    
    if (!existsSync(packagePath)) {
      return 'unknown';
    }
    
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
    return packageJson.version || 'unknown';
  } catch (error) {
    return 'unknown';
  }
}

export function getVersion() {
  const gitVersion = getGitVersion();
  if (gitVersion) {
    return gitVersion;
  }
  return getPackageVersion();
}

export function getPackageInfo() {
  try {
    const installDir = getInstallDir();
    const packagePath = join(installDir, 'package.json');
    
    if (!existsSync(packagePath)) {
      return {
        name: 'novashell',
        version: 'unknown',
        description: ''
      };
    }
    
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
    return {
      name: packageJson.name || 'novashell',
      version: packageJson.version || 'unknown',
      description: packageJson.description || ''
    };
  } catch (error) {
    return {
      name: 'novashell',
      version: 'unknown',
      description: ''
    };
  }
}
