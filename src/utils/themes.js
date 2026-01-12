import { readFile, writeFile, mkdir } from 'fs/promises';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const THEMES_DIR = join(homedir(), '.novashell');
const THEME_FILE = join(THEMES_DIR, 'theme.json');

const DEFAULT_THEME = 'default';

const BUILT_IN_THEMES = {
  default: {
    name: 'Default',
    prompt: {
      shellName: { color: 'green' },
      separator: { color: 'gray' },
      path: { color: 'cyan' },
      gitBranch: { color: 'magenta' },
      gitChanges: { color: 'yellow' },
      prompt: { color: 'yellow' }
    }
  },
  dark: {
    name: 'Dark',
    prompt: {
      shellName: { color: 'greenBright' },
      separator: { color: 'gray' },
      path: { color: 'cyanBright' },
      gitBranch: { color: 'magentaBright' },
      gitChanges: { color: 'yellowBright' },
      prompt: { color: 'yellowBright' }
    }
  },
  minimal: {
    name: 'Minimal',
    prompt: {
      shellName: { color: 'gray' },
      separator: { color: 'gray' },
      path: { color: 'white' },
      gitBranch: { color: 'gray' },
      gitChanges: { color: 'gray' },
      prompt: { color: 'gray' }
    }
  },
  colorful: {
    name: 'Colorful',
    prompt: {
      shellName: { color: 'red' },
      separator: { color: 'blue' },
      path: { color: 'yellow' },
      gitBranch: { color: 'green' },
      gitChanges: { color: 'magenta' },
      prompt: { color: 'cyan' }
    }
  }
};

async function ensureThemesDir() {
  if (!existsSync(THEMES_DIR)) {
    await mkdir(THEMES_DIR, { recursive: true });
  }
}

export function getBuiltInThemes() {
  return BUILT_IN_THEMES;
}

export async function getCurrentTheme() {
  await ensureThemesDir();
  
  if (!existsSync(THEME_FILE)) {
    return DEFAULT_THEME;
  }
  
  try {
    const content = await readFile(THEME_FILE, 'utf-8');
    const data = JSON.parse(content);
    return data.theme || DEFAULT_THEME;
  } catch (error) {
    return DEFAULT_THEME;
  }
}

export async function setTheme(themeName) {
  await ensureThemesDir();
  
  const data = {
    theme: themeName,
    updatedAt: Date.now()
  };
  
  await writeFile(THEME_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function getTheme(name) {
  return BUILT_IN_THEMES[name] || BUILT_IN_THEMES[DEFAULT_THEME];
}

export function getCurrentThemeSync() {
  if (!existsSync(THEMES_DIR)) {
    try {
      mkdirSync(THEMES_DIR, { recursive: true });
    } catch (error) {
      return DEFAULT_THEME;
    }
  }
  
  if (!existsSync(THEME_FILE)) {
    return DEFAULT_THEME;
  }
  
  try {
    const content = readFileSync(THEME_FILE, 'utf-8');
    const data = JSON.parse(content);
    return data.theme || DEFAULT_THEME;
  } catch (error) {
    return DEFAULT_THEME;
  }
}
