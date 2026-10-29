# PyCampus Quest PowerShell Launcher
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "  🎓 PYCAMPUS QUEST: COLLEGE GAMIFIED PYTHON LEARNING PLATFORM" -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

$pyPath = "C:\Users\anuna\AppData\Local\Programs\Python\Python311\python.exe"
if (-not (Test-Path $pyPath)) {
    $pyPath = "python"
}

Write-Host "Starting web server with: $pyPath" -ForegroundColor Green
Write-Host "Open in your browser: http://127.0.0.1:5000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Gray
Write-Host ""

& $pyPath app.py
