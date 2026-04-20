# Backup Script: Workspace -> Desktop Mirror (Service PC Master)
# Usage: ./backup_to_desktop.ps1

$Source = "C:\Users\PcMaster\.gemini\antigravity\scratch\service-pcmaster"
$Destination = "C:\Users\PcMaster\Desktop\service-pcmaster"

Write-Host "Starting Backup to Desktop..." -ForegroundColor Cyan

# Ensure Destination exists
if (!(Test-Path $Destination)) {
    New-Item -ItemType Directory -Path $Destination -Force
}

# Robocopy /MIR: Mirror a directory tree (Sync)
# /MT: Multi-threaded for speed
# /R:0 /W:0: Don't retry/wait on failed files
robocopy $Source $Destination /MIR /MT /R:0 /W:0 /XF backup_to_desktop.ps1 .gitattributes

Write-Host "Backup Complete!" -ForegroundColor Green
