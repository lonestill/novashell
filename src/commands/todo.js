import chalk from 'chalk';
import { getTodos, addTodo, completeTodo, removeTodo } from '../utils/todos.js';

export async function todoCommand(args) {
  const action = args[0];
  
  if (!action || action === 'list' || action === 'ls') {
    const todos = await getTodos();
    const activeTodos = todos.filter(t => !t.done);
    const completedTodos = todos.filter(t => t.done);
    
    if (activeTodos.length === 0 && completedTodos.length === 0) {
      console.log(chalk.gray('No todos. Use "todo add <text>" to create one.'));
      return;
    }
    
    if (activeTodos.length > 0) {
      console.log(chalk.cyan.bold('\nActive Todos:\n'));
      activeTodos.forEach((todo, index) => {
        console.log(
          chalk.gray(`  ${String(index + 1).padStart(2)}. `) +
          chalk.white('[ ] ') +
          chalk.yellow(todo.text)
        );
      });
    }
    
    if (completedTodos.length > 0 && args[0] !== 'list') {
      console.log(chalk.gray('\nCompleted Todos:\n'));
      completedTodos.slice(0, 5).forEach(todo => {
        console.log(
          chalk.gray('  ✓ ') +
          chalk.gray(todo.text)
        );
      });
      if (completedTodos.length > 5) {
        console.log(chalk.gray(`  ... and ${completedTodos.length - 5} more`));
      }
    }
    
    console.log('');
    return;
  }
  
  if (action === 'add') {
    if (args.length < 2) {
      console.error(chalk.red('todo: missing todo text'));
      return;
    }
    
    const text = args.slice(1).join(' ');
    const todo = await addTodo(text);
    console.log(chalk.green(`✓ Todo added: ${text}`));
    return;
  }
  
  if (action === 'done' || action === 'complete') {
    if (args.length < 2) {
      console.error(chalk.red('todo: missing todo ID'));
      return;
    }
    
    const id = parseInt(args[1]);
    const completed = await completeTodo(id);
    if (completed) {
      console.log(chalk.green('✓ Todo completed'));
    } else {
      console.error(chalk.red(`todo: todo #${id} not found`));
    }
    return;
  }
  
  if (action === 'remove' || action === 'rm' || action === 'delete') {
    if (args.length < 2) {
      console.error(chalk.red('todo: missing todo ID'));
      return;
    }
    
    const id = parseInt(args[1]);
    const removed = await removeTodo(id);
    if (removed) {
      console.log(chalk.green('✓ Todo removed'));
    } else {
      console.error(chalk.red(`todo: todo #${id} not found`));
    }
    return;
  }
  
  console.error(chalk.red(`todo: unknown action "${action}"`));
  console.log(chalk.gray('Usage: todo [list|add|done|remove]'));
}
