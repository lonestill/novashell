# NovaShell

A custom cross-platform CLI shell/console built with Node.js. This interactive shell provides a custom command-line interface with built-in commands and the ability to execute system commands.

## Features

- 🚀 **Interactive Shell**: Full-featured interactive command-line interface
- 🌍 **Cross-Platform**: Works on Windows, macOS, and Linux
- 📝 **Built-in Commands**: Essential commands like `cd`, `ls`, `cat`, `echo`, etc.
- 🔄 **System Command Execution**: Run any system command (git, npm, etc.)
- 📜 **Command History**: Navigate through command history with arrow keys
- 🎨 **Colored Output**: Beautiful colored prompt and output
- 🔍 **Auto-completion**: Tab completion for commands
- ⚙️ **Custom Commands**: Create custom commands from strings or JavaScript files
- 🎯 **Smart Suggestions**: Context-aware command suggestions
- 📊 **Statistics**: Command usage statistics
- 🔖 **Bookmarks**: Directory bookmarks for quick navigation
- 📋 **Todo List**: Built-in task management
- 🎨 **Themes**: Customizable prompt themes

## Installation

### Quick Install (Recommended)

**Linux/macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/lonestill/novashell/main/install.sh | bash
```

**Windows (PowerShell):**
```powershell
iwr -useb https://raw.githubusercontent.com/lonestill/novashell/main/install.ps1 | iex
```

### Manual Installation

1. Clone this repository:
```bash
git clone https://github.com/lonestill/novashell
cd novashell
```

2. Install dependencies:
```bash
npm install
```

3. Link globally:
```bash
npm link
```

## Usage

Run the shell:
```bash
novashell
```

Or from the project directory:
```bash
npm start
# or
node index.js
```

## Testing

Run tests:
```bash
npm test
```

## Documentation

- **[COMMANDS.md](COMMANDS.md)** - Complete command reference with detailed descriptions and examples

## Built-in Commands

| Command | Description |
|---------|-------------|
| `help` | Display help message |
| `clear` / `cls` | Clear the terminal screen |
| `exit` / `quit` | Exit the shell |
| `echo <text>` | Print text to console |
| `cd <directory>` | Change directory |
| `pwd` | Print current directory |
| `ls` / `dir` | List files and directories |
| `cat` / `type <file>` | Display file contents |
| `history` | Show command history |
| `env` | Display environment variables |
| `sysinfo` / `sys` | Display system information |
| `config` | Manage configuration (aliases, custom commands) |
| ... and many more! |

See [COMMANDS.md](COMMANDS.md) for complete documentation.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
