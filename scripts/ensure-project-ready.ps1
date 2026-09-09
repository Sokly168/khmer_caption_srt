$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot

function Refresh-SessionPath {
  $extraPaths = @(
    "$env:LOCALAPPDATA\Sthang Studio\tools\node-v22.22.0-win-x64",
    "$env:LOCALAPPDATA\Sthang Studio\tools\python-3.12",
    "$env:LOCALAPPDATA\Sthang Studio\tools\python-3.12\Scripts",
    "$env:LOCALAPPDATA\Sthang Studio\tools\ffmpeg\bin",
    "$env:LOCALAPPDATA\Programs\Python\Python312",
    "$env:LOCALAPPDATA\Programs\Python\Python312\Scripts"
  )

  $machine = [Environment]::GetEnvironmentVariable('Path', 'Machine')
  $user = [Environment]::GetEnvironmentVariable('Path', 'User')
  $combined = "$machine;$user"

  foreach ($extra in $extraPaths) {
    if (Test-Path -LiteralPath $extra) {
      $combined = "$extra;$combined"
    }
  }
  $env:Path = $combined
}

Refresh-SessionPath

# Auto-heal workspace package links if folder was renamed or moved
function Ensure-WorkspaceLinks {
  $sharedJunction = Join-Path $Root 'node_modules\@kcs\shared'
  $sharedTarget = Join-Path $Root 'packages\shared'
  if (Test-Path -LiteralPath $sharedJunction) {
    try {
      $item = Get-Item -LiteralPath $sharedJunction -Force
      if ($item.LinkType -eq 'Junction') {
        $targetPath = ($item.Target | Select-Object -First 1)
        if ($targetPath) {
          $targetPath = $targetPath.TrimEnd('\')
          if (-not [string]::Equals($targetPath, $sharedTarget.TrimEnd('\'), [StringComparison]::OrdinalIgnoreCase)) {
            Write-Host "Updating moved/renamed workspace link for @kcs/shared..." -ForegroundColor Yellow
            & cmd.exe /c "rmdir /q `"$sharedJunction`""
            & cmd.exe /c "mklink /J `"$sharedJunction`" `"$sharedTarget`""
          }
        }
      }
    } catch {}
  } elseif (Test-Path -LiteralPath (Join-Path $Root 'node_modules')) {
    try {
      $parentDir = Split-Path -Parent $sharedJunction
      if (-not (Test-Path -LiteralPath $parentDir)) {
        New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
      }
      & cmd.exe /c "mklink /J `"$sharedJunction`" `"$sharedTarget`""
    } catch {}
  }
}

Ensure-WorkspaceLinks

function Test-Node {
  try {
    $node = Get-Command node -ErrorAction Stop
    & $node.Source -e "process.exit(Number(process.versions.node.split('.')[0]) >= 20 ? 0 : 1)" *> $null
    return $LASTEXITCODE -eq 0
  } catch {
    return $false
  }
}

function Test-Python312 {
  try {
    if (Get-Command py -ErrorAction SilentlyContinue) {
      py -3.12 -c "import sys; raise SystemExit(0 if sys.version_info[:2] == (3, 12) else 1)" *> $null
      if ($LASTEXITCODE -eq 0) { return $true }
    }
  } catch {}
  try {
    if (Get-Command python -ErrorAction SilentlyContinue) {
      python -c "import sys; raise SystemExit(0 if sys.version_info[:2] == (3, 12) else 1)" *> $null
      if ($LASTEXITCODE -eq 0) { return $true }
    }
  } catch {}
  return $false
}

function Test-FFmpeg {
  return [bool](Get-Command ffmpeg -ErrorAction SilentlyContinue) -and [bool](Get-Command ffprobe -ErrorAction SilentlyContinue)
}

function Test-VCRuntime {
  $registryPaths = @(
    'HKLM:\SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64',
    'HKLM:\SOFTWARE\WOW6432Node\Microsoft\VisualStudio\14.0\VC\Runtimes\x64'
  )
  foreach ($path in $registryPaths) {
    try {
      $runtime = Get-ItemProperty -Path $path -ErrorAction Stop
      if ($runtime.Installed -eq 1) { return $true }
    } catch {}
  }
  return $false
}

function Test-NodeModules {
  $tsc = Join-Path $Root 'node_modules\typescript\bin\tsc'
  return (Test-Path -LiteralPath $tsc)
}

function Test-LocalTimingVenv {
  $venvPython = Join-Path $Root '.venv\Scripts\python.exe'
  if (-not (Test-Path -LiteralPath $venvPython)) { return $false }
  try {
    & $venvPython -c "import kfa, onnxruntime; raise SystemExit(0)" *> $null
    return $LASTEXITCODE -eq 0
  } catch {
    return $false
  }
}

function Test-ProjectBuild {
  $webDist = Join-Path $Root 'apps\web\dist\index.html'
  $sharedDist = Join-Path $Root 'packages\shared\dist\index.js'
  return (Test-Path -LiteralPath $webDist) -and (Test-Path -LiteralPath $sharedDist)
}

function Test-ServerEnv {
  $envFile = Join-Path $Root 'apps\server\.env'
  return (Test-Path -LiteralPath $envFile)
}

# Always ensure desktop shortcut exists and is up to date
function Ensure-DesktopShortcut {
  $desktop = [Environment]::GetFolderPath('Desktop')
  if ($desktop) {
    try {
      $shortcutScript = Join-Path $Root 'scripts\ensure-shortcut.ps1'
      if (Test-Path -LiteralPath $shortcutScript) {
        & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $shortcutScript
      }
    } catch {}
  }
}

# Quick check if everything is already ready (fast-path)
$systemToolsReady = (Test-Node) -and (Test-Python312) -and (Test-FFmpeg) -and (Test-VCRuntime)
$projectDependenciesReady = (Test-NodeModules) -and (Test-LocalTimingVenv) -and (Test-ProjectBuild) -and (Test-ServerEnv)

if ($systemToolsReady -and $projectDependenciesReady) {
  # Everything is ready; ensure shortcut and launch directly with no delay.
  Ensure-DesktopShortcut
  exit 0
}

# Otherwise, we need setup
Write-Host ""
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "                  Khmer Captions SRT / Sthang Studio                    " -ForegroundColor Cyan
Write-Host "      Auto-installing and configuring project for new computer...       " -ForegroundColor Yellow
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""

if (-not $systemToolsReady) {
  Write-Host "[*] Missing system prerequisites detected (Node.js, Python 3.12, FFmpeg, or VC++ Runtime)." -ForegroundColor Yellow
  Write-Host "[*] Running comprehensive Windows installer (scripts\install-new-pc.ps1)..." -ForegroundColor Yellow
  Write-Host ""

  $installScript = Join-Path $Root 'scripts\install-new-pc.ps1'
  & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $installScript
  if ($LASTEXITCODE -ne 0) {
    throw "System prerequisites setup failed with exit code $LASTEXITCODE."
  }
  Refresh-SessionPath
} else {
  # System tools are present, but project dependencies, venv, or build are missing
  Write-Host "[*] System tools are ready. Setting up project dependencies and build..." -ForegroundColor Yellow
  $setupBatch = Join-Path $Root 'setup-windows.bat'
  & cmd.exe /c "`"$setupBatch`""
  if ($LASTEXITCODE -ne 0) {
    throw "Project dependency setup and build failed with exit code $LASTEXITCODE."
  }
}

Ensure-WorkspaceLinks

# Ensure desktop shortcut is created
try {
  $shortcutScript = Join-Path $Root 'scripts\ensure-shortcut.ps1'
  if (Test-Path -LiteralPath $shortcutScript) {
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $shortcutScript
    Write-Host "[OK] Desktop shortcut created: Khmer Captions SRT" -ForegroundColor Green
  }
} catch {
  Write-Host "Note: Desktop shortcut could not be created." -ForegroundColor DarkGray
}

# Final verification
Refresh-SessionPath
if (-not (Test-NodeModules)) {
  throw "Node modules (node_modules) are not complete. Run setup-windows.bat again."
}
if (-not (Test-LocalTimingVenv)) {
  throw "Python timing environment (.venv) is not complete. Run setup-local-timing-windows.bat again."
}
if (-not (Test-ProjectBuild)) {
  Write-Host "[*] Building Sthang Studio assets..." -ForegroundColor Yellow
  & npm.cmd run build
  if ($LASTEXITCODE -ne 0) {
    throw "Project build failed with exit code $LASTEXITCODE."
  }
}

Write-Host ""
Write-Host "========================================================================" -ForegroundColor Green
Write-Host "  [OK] Setup complete! Desktop Shortcut created successfully!           " -ForegroundColor Green
Write-Host "========================================================================" -ForegroundColor Green
Write-Host ""

exit 0
