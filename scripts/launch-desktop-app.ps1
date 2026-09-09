$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

# 1. Check if backend (8787) and web (5188) are already listening
function Test-PortListening([int]$Port) {
  try {
    $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    return [bool]$conn
  } catch {
    return $false
  }
}

$webReady = (Test-PortListening 5188) -and (Test-PortListening 8787)

if (-not $webReady) {
  # Start the background service completely hidden (no taskbar icon)
  $env:KCS_OPEN_BROWSER = 'false'
  $launcher = Join-Path $Root 'scripts\launch-studio.ps1'
  Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-WindowStyle", "Hidden", "-File", "`"$launcher`"" -WorkingDirectory $Root -WindowStyle Hidden
}

# 2. Wait up to 30 seconds for http://127.0.0.1:5188/ to become ready
$url = "http://127.0.0.1:5188/"
for ($i = 0; $i -lt 60; $i++) {
  try {
    $req = [System.Net.WebRequest]::Create($url)
    $req.Timeout = 1000
    $resp = $req.GetResponse()
    $statusCode = [int]$resp.StatusCode
    $resp.Close()
    if ($statusCode -ge 200 -and $statusCode -lt 400) {
      break
    }
  } catch {
    Start-Sleep -Milliseconds 500
  }
}

# 3. Find Edge or Chrome to open in App Mode (--app=http://127.0.0.1:5188/)
$browserPath = $null
$edgeCandidates = @(
  "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
  "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
)
foreach ($p in $edgeCandidates) {
  if (Test-Path -LiteralPath $p) { $browserPath = $p; break }
}

if (-not $browserPath) {
  $chromeCandidates = @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
  )
  foreach ($p in $chromeCandidates) {
    if (Test-Path -LiteralPath $p) { $browserPath = $p; break }
  }
}

# 4. Launch in App Mode (Dedicated standalone desktop window) or default browser
if ($browserPath) {
  Start-Process -FilePath $browserPath -ArgumentList "--app=`"$url`""
} else {
  Start-Process -FilePath $url
}
