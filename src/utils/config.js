import { readFile, writeFile, mkdir } from 'fs/promises';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const CONFIG_DIR = join(homedir(), '.novashell');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG = {
  commandAliases: {},
  customCommands: {},
  settings: {
    historySize: 1000,
    enableNotifications: true,
    notificationThreshold: 10000
  }
};

async function ensureConfigDir() {
  if (!existsSync(CONFIG_DIR)) {
    await mkdir(CONFIG_DIR, { recursive: true });
  }
}

export async function getConfig() {
  await ensureConfigDir();
  
  if (!existsSync(CONFIG_FILE)) {
    return DEFAULT_CONFIG;
  }
  
  try {
    const content = await readFile(CONFIG_FILE, 'utf-8');
    const config = JSON.parse(content);
    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
    return DEFAULT_CONFIG;
  }
}

export function getConfigSync() {
  if (!existsSync(CONFIG_DIR)) {
    try {
      mkdirSync(CONFIG_DIR, { recursive: true });
    } catch (error) {
      return DEFAULT_CONFIG;
    }
  }
  
  if (!existsSync(CONFIG_FILE)) {
    return DEFAULT_CONFIG;
  }
  
  try {
    const content = readFileSync(CONFIG_FILE, 'utf-8');
    const config = JSON.parse(content);
    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
    return DEFAULT_CONFIG;
  }
}

export async function saveConfig(config) {
  await ensureConfigDir();
  await writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

export async function setCommandAlias(alias, command) {
  const config = await getConfig();
  config.commandAliases = config.commandAliases || {};
  config.commandAliases[alias] = command;
  await saveConfig(config);
}

export async function removeCommandAlias(alias) {
  const config = await getConfig();
  if (config.commandAliases && config.commandAliases[alias]) {
    delete config.commandAliases[alias];
    await saveConfig(config);
    return true;
  }
  return false;
}

export async function setCustomCommand(name, command) {
  const config = await getConfig();
  config.customCommands = config.customCommands || {};
  config.customCommands[name] = command;
  await saveConfig(config);
}

export async function removeCustomCommand(name) {
  const config = await getConfig();
  if (config.customCommands && config.customCommands[name]) {
    delete config.customCommands[name];
    await saveConfig(config);
    return true;
  }
  return false;
}

export async function getCustomCommands() {
  const config = await getConfig();
  return config.customCommands || {};
}

export function getCustomCommandsSync() {
  const config = getConfigSync();
  return config.customCommands || {};
}

export function getCommandAliasesSync() {
  const config = getConfigSync();
  return config.commandAliases || {};
}
