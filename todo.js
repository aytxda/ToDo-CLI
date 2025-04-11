const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

// Get the path for the todos.json file in the same folder as this script
const todosFile = path.join(__dirname, 'todos.json');

// Function to read to-dos from the file
function readTodos() {
  try {
    // Read the file and convert JSON string to an array
    return JSON.parse(fs.readFileSync(todosFile));
  } catch (error) {
    // If file not found or invalid, return an empty array
    return [];
  }
}

// Function to write to-dos to the file
function writeTodos(todos) {
  // Convert the array to a JSON string and write it to the file
  fs.writeFileSync(todosFile, JSON.stringify(todos, null, 2));
}

// Create the 'todo' command with options
program
  .command('todo')
  .description('Manage your todo list')
  .option('--add <task>', 'Add a new task')
  .option('--remove <task>', 'Remove a task')
  .option('--list', 'List all tasks')
  .action(options => {
    // Load current tasks from the JSON file
    const todos = readTodos();

    if (options.add) {
      // Add a new task
      todos.push(options.add);
      writeTodos(todos);
      console.log('Task added:', options.add);
    } else if (options.remove) {
      // Find and remove a task
      const index = todos.indexOf(options.remove);
      if (index !== -1) {
        todos.splice(index, 1);
        writeTodos(todos);
        console.log('Task removed:', options.remove);
      } else {
        console.log('Task not found:', options.remove);
      }
    } else if (options.list) {
      // List all tasks
      console.log('Your to-do list:');
      todos.forEach((task, index) => {
        console.log(`${index + 1}. ${task}`);
      });
    } else {
      console.log('No valid option provided. Use --help for more information.');
    }
  });

// Process command line arguments
program.parse(process.argv);
