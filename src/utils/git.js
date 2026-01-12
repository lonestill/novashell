import { execSync } from 'child_process';
import { cwd } from 'process';
import { existsSync } from 'fs';
import { join } from 'path';

export function getGitInfo() {
  try {
    const currentDir = cwd();
    let searchDir = currentDir;
    
    while (searchDir && searchDir !== join(searchDir, '..')) {
      const gitDir = join(searchDir, '.git');
      if (existsSync(gitDir)) {
        try {
          const branch = execSync('git rev-parse --abbrev-ref HEAD', {
            cwd: searchDir,
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'ignore']
          }).trim();
          
          const statusOutput = execSync('git status --porcelain -b', {
            cwd: searchDir,
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'ignore']
          }).trim();
          
          const hasChanges = statusOutput.split('\n').some(line => line.match(/^[^#]/));
          
          const branchStatus = execSync('git status -sb', {
            cwd: searchDir,
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'ignore']
          }).trim().split('\n')[0];
          
          const aheadMatch = branchStatus.match(/ahead (\d+)/);
          const behindMatch = branchStatus.match(/behind (\d+)/);
          const ahead = aheadMatch ? parseInt(aheadMatch[1]) : 0;
          const behind = behindMatch ? parseInt(behindMatch[1]) : 0;
          
          return {
            branch,
            hasChanges,
            ahead,
            behind,
            root: searchDir
          };
        } catch (error) {
          return null;
        }
      }
      const parentDir = join(searchDir, '..');
      if (parentDir === searchDir) break;
      searchDir = parentDir;
    }
  } catch (error) {
    return null;
  }
  return null;
}
