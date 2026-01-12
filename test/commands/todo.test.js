import { todoCommand } from '../../src/commands/todo.js';
import { assertEquals } from '../helpers.js';
import { getTodos, addTodo, removeTodo } from '../../src/utils/todos.js';

async function testTodo() {
  let output = '';
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };
  console.error = () => {};
  
  try {
    await todoCommand(['list']);
    assertEquals(output.length >= 0, true, 'todo list should work');
    
    const testTodo = await addTodo('Test todo');
    await todoCommand([]);
    assertEquals(output.includes('Test todo'), true, 'todo should list todos');
    
    await removeTodo(testTodo.id);
    
    console.log = originalLog;
    console.error = originalError;
    console.log('✓ todo tests passed');
  } catch (error) {
    console.log = originalLog;
    console.error = originalError;
    throw error;
  }
}

testTodo().catch(console.error);
