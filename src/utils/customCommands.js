import { readFile, writeFile, mkdir, readdir, stat } from 'fs/promises';
import { readFileSync, existsSync, mkdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';

const COMMANDS_DIR = join(homedir(), '.novashell', 'commands');

async function ensureCommandsDir() {
  if (!existsSync(COMMANDS_DIR)) {
    await mkdir(COMMANDS_DIR, { recursive: true });
  }
}

export function ensureCommandsDirSync() {
  if (!existsSync(COMMANDS_DIR)) {
    mkdirSync(COMMANDS_DIR, { recursive: true });
  }
}

export async function createJSCommand(name, code) {
  await ensureCommandsDir();
  const commandFile = join(COMMANDS_DIR, `${name}.js`);
  await writeFile(commandFile, code, 'utf-8');
  return commandFile;
}

export async function removeJSCommand(name) {
  await ensureCommandsDir();
  const commandFile = join(COMMANDS_DIR, `${name}.js`);
  if (existsSync(commandFile)) {
    const { unlink } = await import('fs/promises');
    await unlink(commandFile);
    return true;
  }
  return false;
}

export async function listJSCommands() {
  await ensureCommandsDir();
  if (!existsSync(COMMANDS_DIR)) {
    return [];
  }
  
  try {
    const files = await readdir(COMMANDS_DIR);
    return files
      .filter(file => file.endsWith('.js'))
      .map(file => file.replace('.js', ''));
  } catch (error) {
    return [];
  }
}

export async function loadJSCommand(name) {
  await ensureCommandsDir();
  const commandFile = join(COMMANDS_DIR, `${name}.js`);
  
  if (!existsSync(commandFile)) {
    return null;
  }
  
  try {
    const fileUrl = `file://${resolve(commandFile)}`;
    const module = await import(fileUrl);
    return module.default || module;
  } catch (error) {
    throw new Error(`Failed to load JS command "${name}": ${error.message}`);
  }
}

export async function loadJSCommandAsync(name) {
  return await loadJSCommand(name);
}

async function loadJSCommandModule(code, filePath) {
  const moduleCode = `
    ${code}
    
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = typeof command !== 'undefined' ? command : (typeof default !== 'undefined' ? default : null);
    } else {
      export default typeof command !== 'undefined' ? command : null;
    }
  `;
  
  const dataUrl = `data:text/javascript;base64,${Buffer.from(moduleCode).toString('base64')}`;
  const module = await import(dataUrl);
  return module.default || module;
}

function loadJSCommandModuleSync(code, filePath) {
  try {
    const vm = require('vm');
    const Module = require('module');
    
    const sandbox = {
      console,
      process,
      Buffer,
      setTimeout,
      setInterval,
      clearTimeout,
      clearInterval,
      require,
      module: { exports: {} },
      exports: {},
      __dirname: COMMANDS_DIR,
      __filename: filePath
    };
    
    const wrappedCode = `
      (function(exports, require, module, __filename, __dirname) {
        ${code}
        
        if (typeof command === 'function') {
          module.exports = command;
        } else if (typeof module.exports.command === 'function') {
          module.exports = module.exports.command;
        }
      })
    `;
    
    const script = new vm.Script(wrappedCode);
    const context = vm.createContext(sandbox);
    script.runInContext(context);
    
    const commandFunction = context.module.exports;
    return commandFunction;
  } catch (error) {
    throw new Error(`Failed to execute JS command: ${error.message}`);
  }
}

export function getJSCommandPath(name) {
  return join(COMMANDS_DIR, `${name}.js`);
}

export async function getJSCommandTemplate() {
  return `export default async function command(args) {
  // Your custom command implementation
  // args is an array of arguments passed to the command
  
  console.log('Hello from custom command!');
  console.log('Arguments:', args);
  
  // Return exit code (0 for success, non-zero for error)
  return 0;
}

// Or use CommonJS style:
// module.exports = async function(args) {
//   return 0;
// }
`;
}
