# Installation Guide

## Before Using the Installers

**Important:** Update the repository URL in the install scripts before using them.

1. Open `install.sh` (Linux/macOS) or `install.ps1` (Windows)
2. Replace `YOUR_USERNAME` with your actual GitHub username
3. Update the repository URL if your repo has a different name or location

Example:
```bash
# In install.sh, change:
REPO_URL="https://github.com/YOUR_USERNAME/novashell.git"
# To:
REPO_URL="https://github.com/yourusername/novashell.git"
```

## Quick Install

### Linux/macOS
```bash
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/novashell/main/install.sh | bash
```

### Windows (PowerShell)
```powershell
iwr -useb https://raw.githubusercontent.com/YOUR_USERNAME/novashell/main/install.ps1 | iex
```

## What the Installers Do

1. Check for prerequisites (Node.js, npm, git)
2. Clone the repository to `~/.novashell` (Linux/macOS) or `%USERPROFILE%\.novashell` (Windows)
3. Install npm dependencies
4. Link the `novashell` command globally via `npm link`

## Manual Installation

See the main README.md for manual installation instructions.

## Uninstallation

**Linux/macOS:**
```bash
npm unlink -g novashell
rm -rf ~/.novashell
```

**Windows:**
```powershell
npm unlink -g novashell
Remove-Item -Recurse -Force $env:USERPROFILE\.novashell
```
