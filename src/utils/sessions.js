import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import { existsSync } from 'fs';

const SESSIONS_DIR = join(homedir(), '.novashell', 'sessions');
const SESSIONS_FILE = join(SESSIONS_DIR, 'sessions.json');

async function ensureSessionsDir() {
  if (!existsSync(SESSIONS_DIR)) {
    await mkdir(SESSIONS_DIR, { recursive: true });
  }
}

export async function saveSession(name, commands) {
  await ensureSessionsDir();
  
  let sessions = {};
  if (existsSync(SESSIONS_FILE)) {
    try {
      const content = await readFile(SESSIONS_FILE, 'utf-8');
      sessions = JSON.parse(content);
    } catch (error) {
      sessions = {};
    }
  }
  
  sessions[name] = {
    commands,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  
  await writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
}

export async function getSession(name) {
  if (!existsSync(SESSIONS_FILE)) {
    return null;
  }
  
  try {
    const content = await readFile(SESSIONS_FILE, 'utf-8');
    const sessions = JSON.parse(content);
    return sessions[name] || null;
  } catch (error) {
    return null;
  }
}

export async function listSessions() {
  if (!existsSync(SESSIONS_FILE)) {
    return {};
  }
  
  try {
    const content = await readFile(SESSIONS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
}

export async function deleteSession(name) {
  if (!existsSync(SESSIONS_FILE)) {
    return false;
  }
  
  try {
    const content = await readFile(SESSIONS_FILE, 'utf-8');
    const sessions = JSON.parse(content);
    if (sessions[name]) {
      delete sessions[name];
      await writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}
