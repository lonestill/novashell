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
git clone <https://github.com/lonestill/novashell>
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

## Documentation

- **[COMMANDS.md](COMMANDS.md)** - Complete command reference with detailed descriptions and examples
## Adding Custom Commands

To add a custom command, create a file in `src/commands/`:

```javascript
export async function mycommand(args) {
  console.log('My command executed!', args);
}
```

Then register it in `src/CommandManager.js`:

```javascript
import { mycommand } from './commands/mycommand.js';

this.register('mycommand', mycommand);
```

## Requirements

- Node.js 14.0.0 or higher

## License

MIT
