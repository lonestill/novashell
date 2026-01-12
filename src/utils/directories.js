import { getDB } from './historyDB.js';

export function getDirectoryHistory(limit = 50) {
  const database = getDB();
  
  const directories = database.prepare(`
    SELECT directory, COUNT(*) as count, MAX(timestamp) as last_used
    FROM commands
    GROUP BY directory
    ORDER BY last_used DESC
    LIMIT ?
  `).all(limit);
  
  return directories;
}

export function getTopDirectories(limit = 10) {
  const database = getDB();
  
  const directories = database.prepare(`
    SELECT directory, COUNT(*) as count
    FROM commands
    GROUP BY directory
    ORDER BY count DESC
    LIMIT ?
  `).all(limit);
  
  return directories;
}
