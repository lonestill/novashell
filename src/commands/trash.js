import { spawn } from 'child_process';
import { platform } from 'os';
import { resolve } from 'path';
import { cwd } from 'process';
import { existsSync } from 'fs';
import chalk from 'chalk';

export async function trash(args) {
  if (args.length === 0) {
    console.error(chalk.red('trash: missing file operand'));
    return;
  }

  const isWindows = platform() === 'win32';
  
  for (const file of args) {
    const filePath = resolve(cwd(), file);
    
    if (!existsSync(filePath)) {
      console.error(chalk.red(`trash: ${file}: No such file or directory`));
      continue;
    }

    try {
      if (isWindows) {
        await trashWindows(filePath);
      } else {
        await trashUnix(filePath);
      }
    } catch (error) {
      console.error(chalk.red(`trash: ${error.message}`));
    }
  }
}

function trashWindows(filePath) {
  return new Promise((resolve, reject) => {
    const script = `
      $shell = New-Object -ComObject Shell.Application
      $folder = $shell.NameSpace(0xA)
      $item = $shell.NameSpace((Get-Item '${filePath.replace(/'/g, "''")}').DirectoryName).ParseName((Get-Item '${filePath.replace(/'/g, "''")}').Name)
      $folder.MoveHere($item, 0x14)
    `;
    
    const child = spawn('powershell', ['-Command', script], {
      stdio: 'pipe',
      shell: false
    });

    child.on('error', (error) => {
      reject(new Error(`Failed to move to recycle bin: ${error.message}`));
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('Failed to move to recycle bin'));
      }
    });

    child.stderr.on('data', () => {
    });
  });
}

function trashUnix(filePath) {
  return new Promise((resolve, reject) => {
    const child = spawn('gio', ['trash', filePath], {
      stdio: 'pipe',
      shell: false
    });

    child.on('error', () => {
      const rmtrash = spawn('rmtrash', [filePath], {
        stdio: 'pipe',
        shell: false
      });

      rmtrash.on('error', () => {
        reject(new Error('Neither gio nor rmtrash found. Install gio (GNOME) or rmtrash'));
      });

      rmtrash.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error('Failed to move to trash'));
        }
      });
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('Failed to move to trash'));
      }
    });
  });
}
