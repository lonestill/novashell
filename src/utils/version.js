import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getGitVersion() {
  try {
    const rootDir = join(__dirname, '..', '..');
    const version = execSync('git describe --tags --always', {
      cwd: rootDir,
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
    const packagePath = join(__dirname, '..', '..', 'package.json');
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
    const packagePath = join(__dirname, '..', '..', 'package.json');
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
