import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import { existsSync } from 'fs';

const TODOS_DIR = join(homedir(), '.novashell');
const TODOS_FILE = join(TODOS_DIR, 'todos.json');

async function ensureTodosFile() {
  if (!existsSync(TODOS_DIR)) {
    await mkdir(TODOS_DIR, { recursive: true });
  }
}

export async function getTodos() {
  await ensureTodosFile();
  
  if (!existsSync(TODOS_FILE)) {
    return [];
  }
  
  try {
    const content = await readFile(TODOS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return [];
  }
}

export async function saveTodos(todos) {
  await ensureTodosFile();
  await writeFile(TODOS_FILE, JSON.stringify(todos, null, 2), 'utf-8');
}

export async function addTodo(text) {
  const todos = await getTodos();
  const newTodo = {
    id: Date.now(),
    text,
    done: false,
    createdAt: Date.now()
  };
  todos.push(newTodo);
  await saveTodos(todos);
  return newTodo;
}

export async function completeTodo(id) {
  const todos = await getTodos();
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.done = true;
    await saveTodos(todos);
    return true;
  }
  return false;
}

export async function removeTodo(id) {
  const todos = await getTodos();
  const filtered = todos.filter(t => t.id !== id);
  if (filtered.length !== todos.length) {
    await saveTodos(filtered);
    return true;
  }
  return false;
}
