import Database from 'better-sqlite3';
import { homedir } from 'os';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { cwd } from 'process';
import { getGitInfo } from './git.js';

const DB_PATH = join(homedir(), '.novashell', 'history.db');
const DB_DIR = join(homedir(), '.novashell');

let db = null;

function initDB() {
  if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true });
  }
  
  db = new Database(DB_PATH);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS commands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      command TEXT NOT NULL,
      directory TEXT NOT NULL,
      git_branch TEXT,
      exit_code INTEGER,
      execution_time INTEGER,
      timestamp INTEGER NOT NULL,
      output TEXT
    );
    
    CREATE INDEX IF NOT EXISTS idx_timestamp ON commands(timestamp);
    CREATE INDEX IF NOT EXISTS idx_directory ON commands(directory);
    CREATE INDEX IF NOT EXISTS idx_git_branch ON commands(git_branch);
    CREATE INDEX IF NOT EXISTS idx_exit_code ON commands(exit_code);
  `);
  
  return db;
}

export function getDB() {
  if (!db) {
    initDB();
  }
  return db;
}

export function saveCommand(command, exitCode, executionTime, output = null) {
  const database = getDB();
  const gitInfo = getGitInfo();
  
  const stmt = database.prepare(`
    INSERT INTO commands (command, directory, git_branch, exit_code, execution_time, timestamp, output)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    command,
    cwd(),
    gitInfo?.branch || null,
    exitCode,
    executionTime,
    Date.now(),
    output
  );
}

export function getCommands(filters = {}) {
  const database = getDB();
  let query = 'SELECT * FROM commands WHERE 1=1';
  const params = [];
  
  if (filters.command) {
    query += ' AND command LIKE ?';
    params.push(`%${filters.command}%`);
  }
  
  if (filters.directory) {
    query += ' AND directory LIKE ?';
    params.push(`%${filters.directory}%`);
  }
  
  if (filters.gitBranch) {
    query += ' AND git_branch = ?';
    params.push(filters.gitBranch);
  }
  
  if (filters.failed !== undefined) {
    if (filters.failed) {
      query += ' AND exit_code != 0';
    } else {
      query += ' AND exit_code = 0';
    }
  }
  
  if (filters.since) {
    query += ' AND timestamp >= ?';
    params.push(filters.since);
  }
  
  if (filters.until) {
    query += ' AND timestamp <= ?';
    params.push(filters.until);
  }
  
  query += ' ORDER BY timestamp DESC LIMIT ?';
  params.push(filters.limit || 100);
  
  const stmt = database.prepare(query);
  return stmt.all(...params);
}

export function closeDB() {
  if (db) {
    db.close();
    db = null;
  }
}
