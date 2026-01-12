import { spawn } from 'child_process';
import { promisify } from 'util';

export async function runCommand(command, args = []) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: 'pipe',
      shell: true
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('exit', (code) => {
      resolve({
        code: code || 0,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      });
    });
  });
}

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

export function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

export function assertArrayEquals(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

export function assertThrows(fn, message) {
  try {
    fn();
    throw new Error(message || 'Expected function to throw');
  } catch (error) {
    return error;
  }
}

export async function assertAsyncThrows(fn, message) {
  try {
    await fn();
    throw new Error(message || 'Expected async function to throw');
  } catch (error) {
    return error;
  }
}
