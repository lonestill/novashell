import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import { existsSync } from 'fs';

const BOOKMARKS_DIR = join(homedir(), '.novashell');
const BOOKMARKS_FILE = join(BOOKMARKS_DIR, 'bookmarks.json');

async function ensureBookmarksFile() {
  if (!existsSync(BOOKMARKS_DIR)) {
    await mkdir(BOOKMARKS_DIR, { recursive: true });
  }
}

export async function getBookmarks() {
  await ensureBookmarksFile();
  
  if (!existsSync(BOOKMARKS_FILE)) {
    return {};
  }
  
  try {
    const content = await readFile(BOOKMARKS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
}

export async function saveBookmarks(bookmarks) {
  await ensureBookmarksFile();
  await writeFile(BOOKMARKS_FILE, JSON.stringify(bookmarks, null, 2), 'utf-8');
}

export async function addBookmark(name, path) {
  const bookmarks = await getBookmarks();
  bookmarks[name] = path;
  await saveBookmarks(bookmarks);
}

export async function removeBookmark(name) {
  const bookmarks = await getBookmarks();
  if (bookmarks[name]) {
    delete bookmarks[name];
    await saveBookmarks(bookmarks);
    return true;
  }
  return false;
}

export async function getBookmark(name) {
  const bookmarks = await getBookmarks();
  return bookmarks[name] || null;
}
