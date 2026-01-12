#!/bin/bash

set -e

REPO_URL="https://github.com/lonestill/novashell.git"
INSTALL_DIR="$HOME/.novashell"
DATA_DIR="$HOME/.novashell"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

error() {
    echo -e "${RED}Error: $1${NC}" >&2
    exit 1
}

info() {
    echo -e "${GREEN}$1${NC}"
}

warn() {
    echo -e "${YELLOW}$1${NC}"
}

check_command() {
    if ! command -v "$1" &> /dev/null; then
        return 1
    fi
    return 0
}

info "NovaShell Installer"
info "=================="
echo ""

if ! check_command node; then
    error "Node.js is not installed. Please install Node.js 14+ from https://nodejs.org/"
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    error "Node.js version 14 or higher is required. Current version: $(node -v)"
fi

info "✓ Node.js $(node -v) found"

if ! check_command npm; then
    error "npm is not installed. Please install npm."
fi

info "✓ npm $(npm -v) found"

if ! check_command git; then
    error "git is not installed. Please install git."
fi

info "✓ git found"
echo ""

IS_UPDATE=false
REMOVE_DATA=false

if [ -d "$INSTALL_DIR" ]; then
    warn "NovaShell installation directory already exists: $INSTALL_DIR"
    echo ""
    info "What would you like to do?"
    info "  1. Update code (keep your config, history, and data)"
    info "  2. Full reinstall (remove everything and start fresh)"
    info "  3. Cancel"
    echo ""
    read -p "Enter your choice (1/2/3): " choice
    
    if [ "$choice" = "1" ]; then
        IS_UPDATE=true
        info "Updating NovaShell..."
        echo ""
        
        if [ -f "$DATA_DIR/config.json" ] || [ -f "$DATA_DIR/history.db" ] || [ -d "$DATA_DIR/logs" ] || [ -d "$DATA_DIR/sessions" ] || [ -f "$DATA_DIR/bookmarks.json" ] || [ -f "$DATA_DIR/aliases.json" ] || [ -f "$DATA_DIR/todos.json" ]; then
            warn "Found user data (config, history, sessions, etc.)"
            read -p "Do you want to remove user data? (y/N): " remove_data_choice
            if [ "$remove_data_choice" = "y" ] || [ "$remove_data_choice" = "Y" ]; then
                REMOVE_DATA=true
            fi
        fi
    elif [ "$choice" = "2" ]; then
        warn "This will remove all NovaShell files including your config, history, and data."
        read -p "Are you sure? (y/N): " confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            rm -rf "$INSTALL_DIR"
            info "Removed existing installation"
            IS_UPDATE=false
        else
            error "Installation cancelled"
        fi
    else
        error "Installation cancelled"
    fi
fi

if [ "$IS_UPDATE" = true ]; then
    cd "$INSTALL_DIR"
    
    info "Pulling latest changes..."
    if ! git pull; then
        warn "Git pull failed. Attempting to reset and pull..."
        git fetch origin
        git reset --hard origin/main
        if [ $? -ne 0 ]; then
            error "Failed to update repository"
        fi
    fi
    
    info "✓ Code updated"
    echo ""
    
    if [ "$REMOVE_DATA" = true ]; then
        info "Removing user data..."
        [ -f "$DATA_DIR/config.json" ] && rm -f "$DATA_DIR/config.json"
        [ -f "$DATA_DIR/history.db" ] && rm -f "$DATA_DIR/history.db"
        [ -d "$DATA_DIR/logs" ] && rm -rf "$DATA_DIR/logs"
        [ -d "$DATA_DIR/sessions" ] && rm -rf "$DATA_DIR/sessions"
        [ -f "$DATA_DIR/bookmarks.json" ] && rm -f "$DATA_DIR/bookmarks.json"
        [ -f "$DATA_DIR/aliases.json" ] && rm -f "$DATA_DIR/aliases.json"
        [ -f "$DATA_DIR/todos.json" ] && rm -f "$DATA_DIR/todos.json"
        info "✓ User data removed"
        echo ""
    fi
else
    info "Cloning repository..."
    if ! git clone "$REPO_URL" "$INSTALL_DIR"; then
        error "Failed to clone repository. Please check your internet connection and repository URL."
    fi
    
    info "✓ Repository cloned"
    echo ""
    
    cd "$INSTALL_DIR"
fi

info "Installing dependencies..."
if ! npm install; then
    error "Failed to install dependencies"
fi

info "✓ Dependencies installed"
echo ""

info "Linking globally..."
if ! npm link; then
    if [ -w "$(npm root -g)" ]; then
        error "Failed to link globally. Please run with sudo or check npm permissions."
    else
        warn "Global npm directory requires root permissions."
        info "Attempting to link with sudo..."
        if ! sudo npm link; then
            error "Failed to link globally with sudo"
        fi
    fi
fi

info "✓ NovaShell linked globally"
echo ""

BIN_DIR="$HOME/.local/bin"
if [ -d "$BIN_DIR" ] && [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    warn "Note: $BIN_DIR is not in your PATH."
    warn "Add this line to your ~/.bashrc or ~/.zshrc:"
    echo "export PATH=\"\$HOME/.local/bin:\$PATH\""
    echo ""
fi

info "Installation complete!"
info "======================"
echo ""
info "You can now run NovaShell with:"
info "  novashell"
echo ""
info "To update, run this installer again."
info "To uninstall, run: npm unlink -g novashell && rm -rf $INSTALL_DIR"
