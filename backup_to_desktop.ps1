# Backup Script: Workspace -> Desktop Mirror
# Usage: ./backup_to_desktop.ps1

$Source = "C:\Users\PcMaster\.gemini\antigravity\scratch\DecorArte"
$Destination = "C:\Users\PcMaster\Desktop\DecorArte"

Write-Host "Starting Backup to Desktop..." -ForegroundColor Cyan

# Robocopy /MIR: Mirror a directory tree (Sync)
# /MT: Multi-threaded for speed
# /R:0 /W:0: Don't retry/wait on failed files (usually system files)
robocopy $Source $Destination /MIR /MT /R:0 /W:0 /XF backup_to_desktop.ps1 .gitattributes

Write-Host "Backup Complete!" -ForegroundColor Green
