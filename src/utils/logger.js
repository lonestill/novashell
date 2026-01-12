import { appendFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import { existsSync } from 'fs';

const LOG_DIR = join(homedir(), '.novashell', 'logs');
const LOG_FILE = join(LOG_DIR, `commands-${new Date().toISOString().split('T')[0]}.log`);

export async function logCommand(command, output, exitCode, executionTime) {
  try {
    if (!existsSync(LOG_DIR)) {
      await mkdir(LOG_DIR, { recursive: true });
    }
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      command,
      exitCode,
      executionTime,
      output: output ? output.substring(0, 10000) : null
    };
    
    await appendFile(LOG_FILE, JSON.stringify(logEntry) + '\n', 'utf-8');
  } catch (error) {
  }
}
