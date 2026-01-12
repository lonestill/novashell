# NovaShell Commands Reference

Complete reference guide for all NovaShell commands.

## Table of Contents

- [File Operations](#file-operations)
- [System Information](#system-information)
- [History & Context](#history--context)
- [Productivity](#productivity)
- [Navigation](#navigation)
- [Utilities](#utilities)
- [System Commands](#system-commands)

---

## File Operations

### `ls` / `dir`
List files and directories in the current directory or specified path.

**Usage:**
```bash
ls [directory]
dir [directory]
```

**Examples:**
```bash
ls
ls /home/user
ls -la
```

**Aliases:** `dir`

---

### `cd`
Change the current directory. Supports bookmark names as directory arguments.

**Usage:**
```bash
cd [directory]
```

**Examples:**
```bash
cd ..
cd /home/user/documents
cd my_folder
cd ~
cd mybookmark              # Use bookmark name (see bookmark command)
```

**Features:**
- Supports bookmark names (see `bookmark` command)
- Defaults to home directory if no argument provided

---

### `pwd`
Print the current working directory.

**Usage:**
```bash
pwd
```

---

### `cat` / `type`
Display file contents.

**Usage:**
```bash
cat <file>
type <file>
```

**Examples:**
```bash
cat myfile.txt
cat /etc/hosts
cat package.json
```

**Aliases:** `type`

---

### `touch`
Create new empty files or update the modification timestamp of existing files.

**Usage:**
```bash
touch <file1> [file2 ...]
```

**Examples:**
```bash
touch newfile.txt
touch file1.js file2.ts file3.js
```

---

### `trash` / `recycle`
Move file(s) to the system's recycle bin/trash (Windows) or trash (Linux/macOS).

**Usage:**
```bash
trash <file1> [file2 ...]
recycle <file1> [file2 ...]
```

**Examples:**
```bash
trash old_file.txt
trash temp_folder/
trash file1.txt file2.txt file3.txt
```

**Aliases:** `recycle`

**Note:** Files moved to trash can be recovered from the system's recycle bin/trash.

---

### `rm`
Remove file(s). By default, files are moved to trash. Use `--force` for permanent deletion.

**Usage:**
```bash
rm [--force|-f] [-r|-R|--recursive] <file1> [file2 ...]
```

**Options:**
- `--force`, `-f`: Perform permanent deletion (bypass trash)
- `-r`, `-R`, `--recursive`: Remove directories and their contents recursively

**Examples:**
```bash
rm myfile.txt                    # Moves to trash
rm --force important.log         # Permanently deletes
rm -r mydir                      # Moves directory to trash
rm --force -r temp_folder        # Permanently deletes directory
```

**Note:** By default, `rm` uses the `trash` command to move files to the recycle bin. This is safer than permanent deletion.

---

## System Information

### `sysinfo` / `sys` / `systeminfo` / `neofetch` / `info`
Display detailed system information in a beautiful, formatted output.

**Usage:**
```bash
sysinfo
sys
systeminfo
neofetch
info
```

**Examples:**
```bash
sysinfo
sys
```

**Aliases:** `sys`, `systeminfo`, `neofetch`, `info`

**Output includes:**
- Operating system
- Hostname and username
- Architecture
- CPU model and cores
- Memory usage (with visual bar)
- Node.js version
- System uptime

---

### `whoami` / `me`
Display the current username.

**Usage:**
```bash
whoami
me
```

**Aliases:** `me`

---

### `env`
Display all environment variables.

**Usage:**
```bash
env
```

---

## History & Context

### `history`
Show command history with powerful filtering options.

**Usage:**
```bash
history [options] [search]
```

**Options:**
- `--failed`, `-f`: Show only failed commands (exit code != 0)
- `--success`, `-s`: Show only successful commands (exit code = 0)
- `--today`, `-t`: Show commands executed today
- `--dir <path>`: Filter commands by directory path
- `--branch <name>`: Filter commands by git branch name
- `--limit <n>`: Limit the number of results (default: 50)
- `search`: Search term to filter commands

**Examples:**
```bash
history
history --failed
history --today --limit 10
history --dir src --branch main
history git status
history --failed --today
```

**Features:**
- Stores commands in SQLite database with metadata
- Tracks exit codes, execution time, directory, git branch
- Contextual filtering based on working directory and git status

---

### `stats`
Display comprehensive statistics about command usage.

**Usage:**
```bash
stats
```

**Output includes:**
- Total commands executed
- Success/failure rates
- Average execution time
- Top 10 most used commands
- Top 5 most used directories
- Top 5 most used git branches

**Examples:**
```bash
stats
```

---

### `where`
Show directory history and navigation information.

**Usage:**
```bash
where [--top|--today]
```

**Options:**
- `--top`, `-t`: Show most used directories (ranked by command count)
- `--today`, `-d`: Show directories visited today

**Examples:**
```bash
where                    # Recent directories
where --top              # Most used directories
where --today            # Directories visited today
```

---

## Productivity

### `alias`
Manage command aliases for faster command execution.

**Usage:**
```bash
alias                          # List all aliases
alias add <name> <command>     # Create new alias
alias remove <name>            # Remove alias
alias suggest                  # Get alias suggestions
```

**Examples:**
```bash
alias
alias add gs "git status"
alias add ll "ls -la"
alias remove gs
alias suggest                  # Get suggestions based on frequently used commands
```

**Features:**
- Aliases are automatically expanded when commands are executed
- `suggest` command analyzes your command history to suggest useful aliases
- Aliases persist across shell sessions

---

### `session`
Save and restore command sessions for workflow management.

**Usage:**
```bash
session save <name>      # Save current command history as session
session load <name>      # Display saved session commands
session list             # List all saved sessions
session delete <name>    # Delete a session
```

**Examples:**
```bash
session save web-dev
session save deploy
session list
session load web-dev
session delete deploy
```

**Use Cases:**
- Save common workflow command sequences
- Share command sequences with team members
- Restore working environment after restart

---

### `todo`
Task management system built into the shell.

**Usage:**
```bash
todo                    # List all todos
todo add <text>         # Add new todo
todo done <id>          # Mark todo as completed
todo remove <id>        # Remove todo
```

**Examples:**
```bash
todo
todo add "deploy to production"
todo add "fix bug in user auth"
todo done 1
todo remove 2
```

**Features:**
- Persistent task storage
- Mark tasks as completed
- Simple task tracking without external tools

---

### `suggest`
Get command suggestions based on current context.

**Usage:**
```bash
suggest
```

**Output includes:**
- Most used commands in current directory
- Git context suggestions (if in git repository)
- Context-aware recommendations

**Examples:**
```bash
suggest
```

---

### `next`
Get suggestions on what to do next based on command patterns and context.

**Usage:**
```bash
next
```

**Output includes:**
- Pattern-based suggestions (commands you often run after the last command)
- Git status recommendations
- Project context hints (if package.json exists)

**Examples:**
```bash
next
```

**Features:**
- Analyzes your command patterns
- Suggests next steps based on git status
- Provides project-specific recommendations

---

### `bookmark`
Manage directory bookmarks for quick navigation.

**Usage:**
```bash
bookmark [list|add|remove|go] <name> [path]
```

**Actions:**
- `list`, `ls`: List all bookmarks
- `add`, `set <name> [path]`: Add a bookmark (default: current directory)
- `remove`, `rm`, `delete <name>`: Remove a bookmark
- `go`, `cd <name>`: Get bookmark path

**Examples:**
```bash
bookmark add proj ~/projects
bookmark add work
bookmark list
bookmark remove proj
cd proj                    # Use bookmark with cd command
bookmark go work
```

**Features:**
- Bookmarks are automatically resolved in `cd` command
- Shows validity status (✓/✗) for each bookmark
- Persistent storage across sessions

---

## File Operations (Extended)

### `cp` / `copy`
Copy files from source to destination.

**Usage:**
```bash
cp <source> <dest>
copy <source> <dest>
```

**Examples:**
```bash
cp file.txt backup.txt
cp file.txt /backup/
cp config.json config.backup.json
```

**Aliases:** `copy`

**Features:**
- Automatically creates destination directory if needed
- Warns when overwriting existing files
- Cross-platform file copying

---

### `mv` / `move`
Move or rename files.

**Usage:**
```bash
mv <source> <dest>
move <source> <dest>
```

**Examples:**
```bash
mv file.txt newname.txt
mv file.txt /backup/
mv old.js new.js
```

**Aliases:** `move`

**Features:**
- Supports both moving and renaming
- Automatically creates destination directory if needed
- Cross-platform file operations

---

### `find`
Search for files by pattern.

**Usage:**
```bash
find [directory] <pattern>
```

**Examples:**
```bash
find *.js
find src *.ts
find test*
find . "*.json"
```

**Features:**
- Supports wildcard patterns (`*`)
- Recursive directory search
- Case-insensitive matching
- Color-coded output (📁 for directories, 📄 for files)

---

### `grep`
Search for text patterns in files.

**Usage:**
```bash
grep <pattern> <file> [file...]
```

**Examples:**
```bash
grep "function" file.js
grep error *.log
grep "import.*from" src/*.js
```

**Features:**
- Regular expression support
- Case-insensitive matching
- Highlighted matches
- Line numbers displayed
- Multiple file support

---

## Navigation

### `clear` / `cls`
Clear the terminal screen.

**Usage:**
```bash
clear
cls
```

**Aliases:** `cls`

---

### `help`
Display help information for commands.

**Usage:**
```bash
help                    # List all available commands
help <command>          # Get detailed help for a specific command
```

**Examples:**
```bash
help
help ls
help history
help stats
```

---

### `exit` / `quit`
Exit the shell.

**Usage:**
```bash
exit
quit
```

**Aliases:** `quit`

---

### `config`
Manage NovaShell configuration (command aliases, custom commands, settings).

**Usage:**
```bash
config [show|alias|custom|remove|edit] [args...]
```

**Actions:**
- `show`, `list`: Show current configuration
- `alias <name> <command>`: Rename/create command alias (e.g., `config alias list ls`)
- `custom <name> <command>`: Add custom command (e.g., `config custom hello "echo Hello"`)
- `remove <name>`, `rm`: Remove alias/custom command
- `edit`: Show config file location

**Examples:**
```bash
config show
config alias list ls                    # Rename 'ls' to 'list'
config alias dir ls                     # Create alias 'dir' for 'ls'
config custom hello "echo Hello World"  # Create custom command
config custom build "npm run build"     # Create custom build command
config remove hello                     # Remove custom command
config edit                             # Show config file location
```

**Features:**
- Command aliases: Rename built-in commands (e.g., `list` → `ls`)
- Custom commands: Create shortcuts for frequently used commands
- Persistent configuration stored in `~/.novashell/config.json`
- Custom commands support arguments (passed after command name)

**Configuration File:**
The configuration file is located at `~/.novashell/config.json` and can be edited directly:

```json
{
  "commandAliases": {
    "list": "ls",
    "dir": "ls"
  },
  "customCommands": {
    "hello": "echo Hello World",
    "build": "npm run build"
  },
  "settings": {
    "historySize": 1000,
    "enableNotifications": true,
    "notificationThreshold": 10000
  }
}
```

**Note:** Command aliases require restarting NovaShell to take effect. Custom commands are available immediately.

---

## Utilities

### `echo`
Print text to the console.

**Usage:**
```bash
echo <text>
```

**Examples:**
```bash
echo Hello World
echo "Hello, NovaShell!"
echo $HOME
```

---

### `random`
Generate random values (string, number, UUID, hex, bytes).

**Usage:**
```bash
random [type] [length]
```

**Types:**
- `string`: Random alphanumeric string (default)
- `number`: Random number (length is max value)
- `uuid`: Generate UUID v4
- `hex`: Random hexadecimal string
- `bytes`: Random bytes in hex format

**Examples:**
```bash
random                    # Random string (16 chars)
random string 20          # Random string (20 chars)
random number 1000        # Random number 0-1000
random uuid               # Generate UUID
random hex 32             # 32-character hex string
random bytes 16           # 16 random bytes
```

---

### `json`
Format, validate, minify, or extract data from JSON files.

**Usage:**
```bash
json <operation> <file> [path]
```

**Operations:**
- `format`, `beautify`, `pretty`: Pretty-print JSON with indentation
- `validate`: Check if JSON is valid
- `minify`: Output minified JSON (no whitespace)
- `get`: Extract value by JSON path

**Examples:**
```bash
json format config.json
json validate data.json
json minify package.json
json get package.json name
json get config.json database.host
```

---

## System Commands

NovaShell can execute any system command (like `git`, `npm`, `docker`, etc.).

**Examples:**
```bash
git status
npm install
docker ps
python script.py
```

**Features:**
- All system commands work normally
- Commands are logged to history with full context
- Execution time and exit codes are tracked
- Notifications for long-running commands (>10 seconds)

---

## Smart Features

### Typo Detection
NovaShell automatically detects typos in commands and suggests corrections using Levenshtein distance algorithm.

**Example:**
```
$ helpp
Command "helpp" not found.
Did you mean one of these?
  1. help
```

### Cyrillic Layout Detection
Detects when commands are typed in Cyrillic keyboard layout and offers transliteration.

**Example:**
```
$ сгкд
Command "сгкд" appears to be in Cyrillic layout.
Did you mean: curl?
```

### Auto-completion
Press `Tab` for intelligent command and file completion:
- Command name completion
- File and directory path completion
- Command-specific argument suggestions

### Contextual History
History is stored with rich metadata:
- Command text
- Execution directory
- Git branch (if in git repository)
- Exit code (success/failure)
- Execution time
- Timestamp
- Output (optional)

### Git Integration
The prompt automatically displays:
- Current git branch
- Uncommitted changes indicator (*)
- Commits ahead/behind remote (↑↓)

### Smart Notifications
Long-running commands (>10 seconds) trigger system notifications when completed.

### Command Logging
All commands are automatically logged to JSON files in `~/.novashell/logs/`.

---

## Configuration

All NovaShell data is stored in `~/.novashell/`:
- `history.db`: SQLite database with command history
- `aliases.json`: User-defined aliases
- `sessions.json`: Saved command sessions
- `todos.json`: Task list
- `logs/`: Command execution logs

---

## Tips & Tricks

1. **Use aliases for frequently used commands:**
   ```bash
   alias add gs "git status"
   alias add gp "git push"
   ```

2. **Save common workflows as sessions:**
   ```bash
   session save deploy
   session load deploy
   ```

3. **Use `next` when unsure what to do:**
   ```bash
   next
   ```

4. **Filter history by context:**
   ```bash
   history --dir src --branch feature
   history --failed --today
   ```

5. **Use `stats` to analyze your command usage:**
   ```bash
   stats
   ```

6. **Combine commands with system pipes:**
   ```bash
   ls | grep .js
   git log --oneline | head -10
   ```

---

## Getting Help

- Use `help` command for quick reference
- Use `help <command>` for detailed information about a specific command
- Check this document for comprehensive reference

---