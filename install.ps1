$ErrorActionPreference = "Stop"

$REPO_URL = "https://github.com/lonestill/novashell.git"
$INSTALL_DIR = "$env:USERPROFILE\.novashell"

function Write-Info {
    Write-Host $args -ForegroundColor Green
}

function Write-Warn {
    Write-Host $args -ForegroundColor Yellow
}

function Write-Error {
    Write-Host "Error: $args" -ForegroundColor Red
    exit 1
}

Write-Info "NovaShell Installer"
Write-Info "=================="
Write-Host ""

$nodeVersion = $null
try {
    $nodeVersion = node -v 2>$null
    if (-not $nodeVersion) {
        Write-Error "Node.js is not installed. Please install Node.js 14+ from https://nodejs.org/"
    }
} catch {
    Write-Error "Node.js is not installed. Please install Node.js 14+ from https://nodejs.org/"
}

Write-Info "✓ Node.js $nodeVersion found"

$npmVersion = $null
try {
    $npmVersion = npm -v 2>$null
    if (-not $npmVersion) {
        Write-Error "npm is not installed. Please install npm."
    }
} catch {
    Write-Error "npm is not installed. Please install npm."
}

Write-Info "✓ npm $npmVersion found"

$gitVersion = $null
try {
    $gitVersion = git --version 2>$null
    if (-not $gitVersion) {
        Write-Error "git is not installed. Please install git from https://git-scm.com/"
    }
} catch {
    Write-Error "git is not installed. Please install git from https://git-scm.com/"
}

Write-Info "✓ git found"
Write-Host ""

if (Test-Path $INSTALL_DIR) {
    Write-Warn "Installation directory already exists: $INSTALL_DIR"
    $response = Read-Host "Do you want to remove it and reinstall? (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        Remove-Item -Recurse -Force $INSTALL_DIR
        Write-Info "Removed existing installation"
    } else {
        Write-Error "Installation cancelled"
    }
}

Write-Info "Cloning repository..."
try {
    git clone $REPO_URL $INSTALL_DIR
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to clone repository. Please check your internet connection and repository URL."
    }
} catch {
    Write-Error "Failed to clone repository: $_"
}

Write-Info "✓ Repository cloned"
Write-Host ""

Set-Location $INSTALL_DIR

Write-Info "Installing dependencies..."
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install dependencies"
    }
} catch {
    Write-Error "Failed to install dependencies: $_"
}

Write-Info "✓ Dependencies installed"
Write-Host ""

Write-Info "Linking globally..."
try {
    npm link
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to link globally. You may need to run PowerShell as Administrator."
    }
} catch {
    Write-Error "Failed to link globally: $_"
}

Write-Info "✓ NovaShell linked globally"
Write-Host ""

Write-Info "Installation complete!"
Write-Info "======================"
Write-Host ""
Write-Info "You can now run NovaShell with:"
Write-Info "  novashell"
Write-Host ""
Write-Info "To update, run this installer again."
Write-Info "To uninstall, run: npm unlink -g novashell; Remove-Item -Recurse -Force $INSTALL_DIR"
