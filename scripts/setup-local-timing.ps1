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

# Check if existing .venv is executable on this computer
if (Test-Path -LiteralPath $VenvPython) {
  $canRun = $false
  try {
    $prevEap = $ErrorActionPreference
    $ErrorActionPreference = 'SilentlyContinue'
    $r = & $VenvPython -c "import sys; print(sys.version_info[0])" 2>$null
    $ErrorActionPreference = $prevEap
    if ($r -match '3') { $canRun = $true }
  } catch {
    $canRun = $false
  }

  if (-not $canRun) {
    Write-Host "[!] Existing .venv was created for another path or computer. Recreating..." -ForegroundColor Yellow
    Remove-Item -LiteralPath $VenvDir -Recurse -Force -ErrorAction SilentlyContinue
  } else {
    # If completely working (packages + model), exit immediately
    $quickCheck = $false
    try {
      $prevEap = $ErrorActionPreference
      $ErrorActionPreference = 'SilentlyContinue'
      $checkCmd = "import os, appdirs, onnxruntime, faster_whisper; from importlib.metadata import version; assert version('kfa') == '0.2.0'; m = os.path.join(appdirs.user_cache_dir(), 'kfa', 'wav2vec2-km-base-1500.onnx'); assert os.path.isfile(m) and os.path.getsize(m) > 100000000; print('OK')"
      $checkOutput = & $VenvPython -c $checkCmd 2>$null
      $ErrorActionPreference = $prevEap
      if ($checkOutput -match 'OK') {
        $quickCheck = $true
      }
    } catch {}

    if ($quickCheck) {
      Write-Host "[OK] Local timing environment (.venv) is already complete and verified." -ForegroundColor Green
      exit 0
    }
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

# Verify local timing packages and ensure KFA acoustic model is ready
Write-Host "Verifying local timing packages and ensuring KFA Khmer acoustic model..." -ForegroundColor Yellow
Write-Host "(*) First-time setup downloads the Khmer acoustic model (~378 MB) from Hugging Face." -ForegroundColor Cyan
Write-Host "    If not yet downloaded, please wait a couple of minutes for download to complete..." -ForegroundColor DarkGray

$prevEap = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
& $VenvPython -u -c "import onnxruntime; import kfa; print('Timing stack OK')"
$verifyExit = $LASTEXITCODE
$ErrorActionPreference = $prevEap

if ($verifyExit -ne 0) {
  throw "Local timing verification failed with exit code $verifyExit."
}
Write-Host "[OK] Local timing packages and KFA Khmer model are ready." -ForegroundColor Green

Write-Host ""
Write-Host "[OK] Local Khmer caption timing setup finished successfully." -ForegroundColor Green
exit 0
