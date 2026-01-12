import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import { existsSync } from 'fs';

const ALIASES_DIR = join(homedir(), '.novashell');
const ALIASES_FILE = join(ALIASES_DIR, 'aliases.json');

async function ensureAliasesFile() {
  if (!existsSync(ALIASES_DIR)) {
    await mkdir(ALIASES_DIR, { recursive: true });
  }
}

export async function getAliases() {
  await ensureAliasesFile();
  
  if (!existsSync(ALIASES_FILE)) {
    return {};
  }
  
  try {
    const content = await readFile(ALIASES_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
}

export async function saveAlias(name, command) {
  await ensureAliasesFile();
  
  const aliases = await getAliases();
  aliases[name] = command;
  
  await writeFile(ALIASES_FILE, JSON.stringify(aliases, null, 2), 'utf-8');
}

export async function removeAlias(name) {
  await ensureAliasesFile();
  
  const aliases = await getAliases();
  if (aliases[name]) {
    delete aliases[name];
    await writeFile(ALIASES_FILE, JSON.stringify(aliases, null, 2), 'utf-8');
    return true;
  }
  return false;
}

export async function getAlias(name) {
  const aliases = await getAliases();
  return aliases[name] || null;
}
