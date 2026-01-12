export const commandMetadata = {
  'help': {
    description: 'Display help message or information about a specific command',
    usage: 'help [command]',
    examples: ['help', 'help ls'],
    arguments: []
  },
  'clear': {
    description: 'Clear the terminal screen',
    usage: 'clear',
    examples: ['clear'],
    aliases: ['cls']
  },
  'exit': {
    description: 'Exit the shell',
    usage: 'exit',
    examples: ['exit', 'quit'],
    aliases: ['quit']
  },
  'echo': {
    description: 'Print text to the console',
    usage: 'echo <text>',
    examples: ['echo Hello World', 'echo "Hello World"'],
    arguments: [
      { name: 'text', description: 'Text to print', required: true }
    ]
  },
  'cd': {
    description: 'Change the current directory',
    usage: 'cd [directory]',
    examples: ['cd', 'cd ..', 'cd /home/user', 'cd ~/projects'],
    arguments: [
      { name: 'directory', description: 'Directory path (default: home directory)', required: false }
    ]
  },
  'pwd': {
    description: 'Print the current working directory',
    usage: 'pwd',
    examples: ['pwd']
  },
  'ls': {
    description: 'List files and directories',
    usage: 'ls [directory]',
    examples: ['ls', 'ls /home', 'ls -la'],
    aliases: ['dir'],
    arguments: [
      { name: 'directory', description: 'Directory to list (default: current directory)', required: false }
    ]
  },
  'cat': {
    description: 'Display file contents',
    usage: 'cat <file>',
    examples: ['cat file.txt', 'cat package.json'],
    aliases: ['type'],
    arguments: [
      { name: 'file', description: 'File path to display', required: true }
    ]
  },
  'history': {
    description: 'Show command history with optional filters',
    usage: 'history [options] [search]',
    examples: [
      'history',
      'history --failed',
      'history --today',
      'history --dir ./src',
      'history ls'
    ],
    arguments: [
      { name: '--failed / -f', description: 'Show only failed commands', required: false },
      { name: '--success / -s', description: 'Show only successful commands', required: false },
      { name: '--today / -t', description: 'Show commands from today', required: false },
      { name: '--dir <path>', description: 'Filter by directory', required: false },
      { name: '--branch <branch>', description: 'Filter by git branch', required: false },
      { name: '--limit <n>', description: 'Limit number of results', required: false },
      { name: 'search', description: 'Search term for command text', required: false }
    ]
  },
  'env': {
    description: 'Display environment variables',
    usage: 'env [variable]',
    examples: ['env', 'env PATH'],
    arguments: [
      { name: 'variable', description: 'Specific environment variable name', required: false }
    ]
  },
  'sysinfo': {
    description: 'Display system information (OS, CPU, memory, etc.)',
    usage: 'sysinfo',
    examples: ['sysinfo', 'sys', 'neofetch'],
    aliases: ['sys', 'systeminfo', 'info', 'neofetch']
  },
  'whoami': {
    description: 'Display current username',
    usage: 'whoami',
    examples: ['whoami', 'me'],
    aliases: ['me']
  },
  'touch': {
    description: 'Create empty file(s) or update file timestamp',
    usage: 'touch <file1> [file2 ...]',
    examples: ['touch file.txt', 'touch file1.txt file2.txt'],
    arguments: [
      { name: 'file', description: 'File(s) to create or update', required: true, multiple: true }
    ]
  },
  'random': {
    description: 'Generate random values (string, number, UUID, hex, bytes, commit)',
    usage: 'random [type] [length]',
    examples: [
      'random',
      'random string 20',
      'random number 1000',
      'random uuid',
      'random hex 32',
      'random bytes 16',
      'random commit message'
    ],
    arguments: [
      { name: 'type', description: 'Type: string, number, uuid, hex, bytes, commit (default: string)', required: false },
      { name: 'length', description: 'Length/size of random value (default: 16)', required: false }
    ]
  },
  'json': {
    description: 'Format, validate, minify, or extract data from JSON files',
    usage: 'json <operation> <file> [path]',
    examples: [
      'json format package.json',
      'json validate config.json',
      'json minify data.json',
      'json get package.json name'
    ],
    arguments: [
      { name: 'operation', description: 'Operation: format, validate, minify, beautify, pretty, get', required: true },
      { name: 'file', description: 'JSON file path', required: true },
      { name: 'path', description: 'JSON path for get operation (e.g., "name" or "dependencies.chalk")', required: false }
    ]
  },
  'trash': {
    description: 'Move file(s) to recycle bin/trash (safe deletion)',
    usage: 'trash <file1> [file2 ...]',
    examples: ['trash file.txt', 'trash old.js old.css'],
    aliases: ['recycle'],
    arguments: [
      { name: 'file', description: 'File(s) to move to trash', required: true, multiple: true }
    ]
  },
  'rm': {
    description: 'Remove file(s). By default moves to trash. Use --force for permanent deletion.',
    usage: 'rm [--force / -f] [--recursive / -r] <file1> [file2 ...]',
    examples: [
      'rm file.txt',
      'rm --force file.txt',
      'rm -rf directory'
    ],
    arguments: [
      { name: '--force / -f', description: 'Permanently delete (bypass trash)', required: false },
      { name: '--recursive / -r / -R', description: 'Recursively remove directories', required: false },
      { name: 'file', description: 'File(s) or directory(ies) to remove', required: true, multiple: true }
    ]
  },
  'stats': {
    description: 'Show command usage statistics',
    usage: 'stats',
    examples: ['stats'],
    aliases: [],
    arguments: []
  },
  'session': {
    description: 'Manage command sessions (save, load, list, delete)',
    usage: 'session [save|load|list|delete] <name>',
    examples: [
      'session save web-dev',
      'session load web-dev',
      'session list',
      'session delete web-dev'
    ],
    aliases: [],
    arguments: [
      { name: 'action', description: 'Action: save, load, list, or delete', required: true },
      { name: 'name', description: 'Session name (required for save/load/delete)', required: false }
    ]
  },
  'alias': {
    description: 'Manage command aliases',
    usage: 'alias [list|add|remove|suggest] [name] [command]',
    examples: [
      'alias',
      'alias add gs "git status"',
      'alias remove gs',
      'alias suggest'
    ],
    aliases: [],
    arguments: [
      { name: 'action', description: 'Action: list, add, remove, or suggest', required: false },
      { name: 'name', description: 'Alias name (for add/remove)', required: false },
      { name: 'command', description: 'Command to alias (for add)', required: false }
    ]
  },
  'todo': {
    description: 'Task management system',
    usage: 'todo [list|add|done|remove] [text|id]',
    examples: [
      'todo',
      'todo add "deploy to production"',
      'todo done 1',
      'todo remove 2'
    ],
    aliases: [],
    arguments: [
      { name: 'action', description: 'Action: list, add, done, or remove', required: false },
      { name: 'text|id', description: 'Todo text (for add) or ID (for done/remove)', required: false }
    ]
  },
  'where': {
    description: 'Show directory history',
    usage: 'where [--top|--today]',
    examples: [
      'where',
      'where --top',
      'where --today'
    ],
    aliases: [],
    arguments: [
      { name: '--top, -t', description: 'Show most used directories', required: false },
      { name: '--today, -d', description: 'Show directories visited today', required: false }
    ]
  },
  'suggest': {
    description: 'Get command suggestions based on current context',
    usage: 'suggest',
    examples: ['suggest'],
    aliases: [],
    arguments: []
  },
  'next': {
    description: 'What to do next (based on command patterns and context)',
    usage: 'next',
    examples: ['next'],
    aliases: [],
    arguments: []
  },
  'bookmark': {
    description: 'Manage directory bookmarks for quick navigation',
    usage: 'bookmark [list|add|remove|go] <name> [path]',
    examples: [
      'bookmark add proj ~/projects',
      'bookmark list',
      'bookmark remove proj',
      'cd proj'
    ],
    aliases: [],
    arguments: [
      { name: 'action', description: 'Action: list, add, remove, or go', required: false },
      { name: 'name', description: 'Bookmark name', required: false },
      { name: 'path', description: 'Directory path (default: current directory)', required: false }
    ]
  },
  'cp': {
    description: 'Copy files',
    usage: 'cp <source> <dest>',
    examples: ['cp file.txt backup.txt', 'cp file.txt /backup/'],
    aliases: ['copy'],
    arguments: [
      { name: 'source', description: 'Source file path', required: true },
      { name: 'dest', description: 'Destination file or directory path', required: true }
    ]
  },
  'mv': {
    description: 'Move files',
    usage: 'mv <source> <dest>',
    examples: ['mv file.txt newname.txt', 'mv file.txt /backup/'],
    aliases: ['move'],
    arguments: [
      { name: 'source', description: 'Source file path', required: true },
      { name: 'dest', description: 'Destination file or directory path', required: true }
    ]
  },
  'find': {
    description: 'Search for files by pattern',
    usage: 'find [directory] <pattern>',
    examples: ['find *.js', 'find src *.ts', 'find test*'],
    aliases: [],
    arguments: [
      { name: 'directory', description: 'Directory to search in (default: current)', required: false },
      { name: 'pattern', description: 'File name pattern (supports * wildcard)', required: true }
    ]
  },
  'grep': {
    description: 'Search for text in files',
    usage: 'grep <pattern> <file> [file...]',
    examples: ['grep "function" file.js', 'grep error *.log'],
    aliases: [],
    arguments: [
      { name: 'pattern', description: 'Search pattern (regex)', required: true },
      { name: 'file', description: 'File(s) to search in', required: true }
    ]
  },
  'theme': {
    description: 'Manage prompt themes',
    usage: 'theme [list|set|current] [name]',
    examples: ['theme list', 'theme set dark', 'theme current'],
    aliases: [],
    arguments: [
      { name: 'action', description: 'Action: list, set, or current', required: false },
      { name: 'name', description: 'Theme name (for set)', required: false }
    ]
  },
  'config': {
    description: 'Manage NovaShell configuration (command aliases, custom commands, settings)',
    usage: 'config [show|alias|custom|remove|edit] [args...]',
    examples: [
      'config show',
      'config alias list ls',
      'config custom hello "echo Hello"',
      'config remove hello',
      'config edit'
    ],
    aliases: [],
    arguments: [
      { name: 'action', description: 'Action: show, alias, custom, remove, edit', required: false },
      { name: 'name', description: 'Command/alias name', required: false },
      { name: 'command', description: 'Command to alias/execute', required: false }
    ]
  },
  'version': {
    description: 'Display NovaShell version information',
    usage: 'version',
    examples: ['version'],
    aliases: [],
    arguments: []
  },
  'update': {
    description: 'Check for updates and optionally update NovaShell',
    usage: 'update [--no-prompt]',
    examples: ['update', 'update --no-prompt'],
    aliases: [],
    arguments: [
      { name: '--no-prompt', description: 'Only check for updates, do not prompt for update', required: false }
    ]
  },
  'nano': {
    description: 'Open file in system editor (uses EDITOR env variable, or notepad/nano by default)',
    usage: 'nano <file>',
    examples: ['nano file.txt', 'nano /path/to/file.txt'],
    aliases: ['edit'],
    arguments: [
      { name: 'file', description: 'File to edit', required: true }
    ]
  }
};

export function getCommandMetadata(commandName) {
  return commandMetadata[commandName] || null;
}

export function getAllCommandMetadata() {
  return commandMetadata;
}

export function getCommandDescription(commandName) {
  const meta = getCommandMetadata(commandName);
  return meta ? meta.description : null;
}
