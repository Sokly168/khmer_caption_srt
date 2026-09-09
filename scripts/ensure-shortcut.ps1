$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$Desktop = [Environment]::GetFolderPath('Desktop')
if (-not $Desktop) { exit 0 }

$Shell = New-Object -ComObject WScript.Shell
$Target = Join-Path $Root 'Khmer-Captions-App.vbs'
$ShortcutPath = Join-Path $Desktop 'Khmer Captions SRT.lnk'
$Icon = Join-Path $Root 'khmer-captions.ico'

$Shortcut = $Shell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $Target
$Shortcut.WorkingDirectory = $Root
$Shortcut.Arguments = ''
$Shortcut.Description = 'Launch Khmer Captions SRT'
if (Test-Path -LiteralPath $Icon) { $Shortcut.IconLocation = "$Icon,0" }
$Shortcut.Save()
