$ErrorActionPreference = "Stop"

$REPO_URL = "https://github.com/lonestill/novashell.git"
$INSTALL_DIR = "$env:USERPROFILE\.novashell"
$DATA_DIR = "$env:USERPROFILE\.novashell"

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

$isUpdate = $false
$removeData = $false

if (Test-Path $INSTALL_DIR) {
    Write-Warn "NovaShell installation directory already exists: $INSTALL_DIR"
    Write-Host ""
    Write-Info "What would you like to do?"
    Write-Info "  1. Update code (keep your config, history, and data)"
    Write-Info "  2. Full reinstall (remove everything and start fresh)"
    Write-Info "  3. Cancel"
    Write-Host ""
    $choice = Read-Host "Enter your choice (1/2/3)"
    
    if ($choice -eq "1") {
        $isUpdate = $true
        Write-Info "Updating NovaShell..."
        Write-Host ""
        
        $configExists = Test-Path "$DATA_DIR\config.json"
        $dbExists = Test-Path "$DATA_DIR\history.db"
        $otherDataExists = (Test-Path "$DATA_DIR\logs") -or (Test-Path "$DATA_DIR\sessions") -or (Test-Path "$DATA_DIR\bookmarks.json") -or (Test-Path "$DATA_DIR\aliases.json") -or (Test-Path "$DATA_DIR\todos.json")
        
        if ($configExists -or $dbExists -or $otherDataExists) {
            Write-Warn "Found user data (config, history, sessions, etc.)"
            $removeDataChoice = Read-Host "Do you want to remove user data? (y/N)"
            if ($removeDataChoice -eq "y" -or $removeDataChoice -eq "Y") {
                $removeData = $true
            }
        }
    } elseif ($choice -eq "2") {
        Write-Warn "This will remove all NovaShell files including your config, history, and data."
        $confirm = Read-Host "Are you sure? (y/N)"
        if ($confirm -eq "y" -or $confirm -eq "Y") {
            Remove-Item -Recurse -Force $INSTALL_DIR
            Write-Info "Removed existing installation"
            $isUpdate = $false
        } else {
            Write-Error "Installation cancelled"
        }
    } else {
        Write-Error "Installation cancelled"
    }
}

if ($isUpdate) {
    Set-Location $INSTALL_DIR
    
    Write-Info "Pulling latest changes..."
    try {
        git pull
        if ($LASTEXITCODE -ne 0) {
            Write-Warn "Git pull failed. Attempting to reset and pull..."
            git fetch origin
            git reset --hard origin/main
            if ($LASTEXITCODE -ne 0) {
                Write-Error "Failed to update repository"
            }
        }
    } catch {
        Write-Error "Failed to update repository: $_"
    }
    
    Write-Info "✓ Code updated"
    Write-Host ""
    
    if ($removeData) {
        Write-Info "Removing user data..."
        if (Test-Path "$DATA_DIR\config.json") { Remove-Item -Force "$DATA_DIR\config.json" }
        if (Test-Path "$DATA_DIR\history.db") { Remove-Item -Force "$DATA_DIR\history.db" }
        if (Test-Path "$DATA_DIR\logs") { Remove-Item -Recurse -Force "$DATA_DIR\logs" }
        if (Test-Path "$DATA_DIR\sessions") { Remove-Item -Recurse -Force "$DATA_DIR\sessions" }
        if (Test-Path "$DATA_DIR\bookmarks.json") { Remove-Item -Force "$DATA_DIR\bookmarks.json" }
        if (Test-Path "$DATA_DIR\aliases.json") { Remove-Item -Force "$DATA_DIR\aliases.json" }
        if (Test-Path "$DATA_DIR\todos.json") { Remove-Item -Force "$DATA_DIR\todos.json" }
        Write-Info "✓ User data removed"
        Write-Host ""
    }
} else {
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
}

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

$npmBinPath = "$env:APPDATA\npm"
$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
$pathContainsNpm = $userPath -split ';' | Where-Object { $_ -eq $npmBinPath }

if (-not $pathContainsNpm) {
    Write-Warn "npm bin directory is not in your PATH. Adding it now..."
    try {
        $newPath = if ($userPath) { "$userPath;$npmBinPath" } else { $npmBinPath }
        [Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
        $env:Path += ";$npmBinPath"
        Write-Info "✓ Added npm bin directory to PATH"
        Write-Warn "Note: Please restart PowerShell for the change to take effect in all new windows."
    } catch {
        Write-Warn "Could not add npm to PATH automatically. Please add it manually:"
        Write-Info "[Environment]::SetEnvironmentVariable('Path', `$env:Path + ';$env:APPDATA\npm', 'User')"
    }
    Write-Host ""
}

Write-Info "Installation complete!"
Write-Info "======================"
Write-Host ""
Write-Info "You can now run NovaShell with:"
Write-Info "  novashell"
Write-Host ""
Write-Info "If the command is not found, restart your terminal or run:"
Write-Info "  `$env:Path += ';$env:APPDATA\npm'; novashell"
Write-Host ""
Write-Info "To update, run this installer again."
Write-Info "To uninstall, run: npm unlink -g novashell; Remove-Item -Recurse -Force $INSTALL_DIR"
