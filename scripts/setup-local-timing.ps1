$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host ""
Write-Host "=== Sthang Studio - Local Khmer Timing Setup ===" -ForegroundColor Cyan
Write-Host "Setting up Python 3.12 virtual environment and Khmer alignment tools..." -ForegroundColor DarkGray

function Refresh-Path {
  $machine = [Environment]::GetEnvironmentVariable('Path', 'Machine')
  $user = [Environment]::GetEnvironmentVariable('Path', 'User')
  $env:Path = "$machine;$user"
}

function Find-Python312Executable {
  # 1. Check py launcher
  try {
    $py = Get-Command py -ErrorAction SilentlyContinue
    if ($py) {
      & $py.Source -3.12 -c "import sys; raise SystemExit(0 if sys.version_info[:2] == (3, 12) else 1)" *> $null
      if ($LASTEXITCODE -eq 0) {
        return @{ Exe = $py.Source; Args = @('-3.12') }
      }
    }
  } catch {}

  # 2. Check python in PATH
  try {
    $python = Get-Command python -ErrorAction SilentlyContinue
    if ($python) {
      & $python.Source -c "import sys; raise SystemExit(0 if sys.version_info[:2] == (3, 12) else 1)" *> $null
      if ($LASTEXITCODE -eq 0) {
        return @{ Exe = $python.Source; Args = @() }
      }
    }
  } catch {}

  # 3. Check known directories
  $localBase = if ($env:LOCALAPPDATA) { $env:LOCALAPPDATA } else { $env:USERPROFILE }
  $knownPaths = @(
    (Join-Path $localBase 'Sthang Studio\tools\python-3.12\python.exe'),
    (Join-Path $localBase 'Programs\Python\Python312\python.exe'),
    'C:\Python312\python.exe',
    'C:\Program Files\Python312\python.exe'
  )

  foreach ($candidate in $knownPaths) {
    if (Test-Path -LiteralPath $candidate) {
      try {
        & $candidate -c "import sys; raise SystemExit(0 if sys.version_info[:2] == (3, 12) else 1)" *> $null
        if ($LASTEXITCODE -eq 0) {
          return @{ Exe = $candidate; Args = @() }
        }
      } catch {}
    }
  }

  return $null
}

$VenvDir = Join-Path $Root '.venv'
$VenvPython = Join-Path $VenvDir 'Scripts\python.exe'

# If .venv already exists, check if it is completely working
if (Test-Path -LiteralPath $VenvPython) {
  $quickCheck = [bool]((& $VenvPython -c "import kfa, faster_whisper, onnxruntime; print('OK')" 2>&1) -match 'OK')
  if ($quickCheck) {
    Write-Host "[OK] Local timing environment (.venv) is already complete and verified." -ForegroundColor Green
    exit 0
  }
}

# Find Python 3.12
$pyInfo = Find-Python312Executable
if (-not $pyInfo) {
  throw "Python 3.12 is required for Khmer alignment but was not found. Please run INSTALL-NEW-PC.bat or install Python 3.12."
}

# Create .venv if missing
if (-not (Test-Path -LiteralPath $VenvPython)) {
  Write-Host "Creating Python 3.12 virtual environment in .venv..." -ForegroundColor Yellow
  $createArgs = $pyInfo.Args + @('-m', 'venv', $VenvDir)
  & $pyInfo.Exe $createArgs
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $VenvPython)) {
    throw "Failed to create Python virtual environment in $VenvDir."
  }
  Write-Host "[OK] Virtual environment created." -ForegroundColor Green
}

# Ensure pip is up to date
Write-Host "Updating pip in virtual environment..." -ForegroundColor DarkGray
& $VenvPython -m pip install --upgrade pip --no-warn-script-location --quiet
if ($LASTEXITCODE -ne 0) {
  Write-Host "pip upgrade warning; continuing with package installation..." -ForegroundColor DarkGray
}

# Install KFA dependencies
Write-Host "Installing KFA Khmer alignment dependencies..." -ForegroundColor Yellow
$kfaReq = Join-Path $Root 'local-timing\requirements-kfa.txt'
if (-not (Test-Path -LiteralPath $kfaReq)) {
  throw "Missing requirements file: $kfaReq"
}
& $VenvPython -m pip install -r $kfaReq --no-warn-script-location
if ($LASTEXITCODE -ne 0) {
  throw "Failed to install KFA runtime dependencies."
}

# Install KFA 0.2.0 with --no-deps
Write-Host "Installing KFA 0.2.0..." -ForegroundColor Yellow
& $VenvPython -m pip install --no-deps kfa==0.2.0 --no-warn-script-location
if ($LASTEXITCODE -ne 0) {
  throw "Failed to install KFA 0.2.0."
}

# Install Whisper fallback dependencies
Write-Host "Installing Whisper fallback dependencies..." -ForegroundColor Yellow
$whisperReq = Join-Path $Root 'local-timing\requirements-whisper.txt'
if (Test-Path -LiteralPath $whisperReq) {
  & $VenvPython -m pip install -r $whisperReq --no-warn-script-location
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Whisper fallback installation encountered an issue; continuing." -ForegroundColor Yellow
  }
}

# Verify local timing packages
Write-Host "Verifying local timing packages..." -ForegroundColor Yellow
$verifyCommand = "import kfa, onnxruntime; print('Timing stack OK')"
$verifyOutput = & $VenvPython -c $verifyCommand 2>&1
if ($LASTEXITCODE -ne 0 -or $verifyOutput -notmatch 'Timing stack OK') {
  throw "Local timing verification failed: $verifyOutput"
}
Write-Host "[OK] Local timing packages verified." -ForegroundColor Green

# Prewarm KFA model if possible
Write-Host "Checking / Prewarming KFA Khmer acoustic model..." -ForegroundColor Yellow
try {
  & $VenvPython -c "from kfa import create_session; create_session(); print('KFA Model ready')" *> $null
  Write-Host "[OK] KFA Khmer model is cached and ready." -ForegroundColor Green
} catch {
  Write-Host "KFA model will download automatically on first caption generation." -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "[OK] Local Khmer caption timing setup finished successfully." -ForegroundColor Green
exit 0
