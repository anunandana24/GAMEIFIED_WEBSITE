@echo off
title PyCampus Quest - Gamified Python Learning Platform
echo =====================================================================
echo   🎓 PYCAMPUS QUEST: COLLEGE GAMIFIED PYTHON LEARNING PLATFORM
echo =====================================================================
echo.

:: Check for Python 3.11 or Python on PATH
if exist "C:\Users\anuna\AppData\Local\Programs\Python\Python311\python.exe" (
    set "PY_CMD=C:\Users\anuna\AppData\Local\Programs\Python\Python311\python.exe"
) else (
    set "PY_CMD=python"
)

echo Starting PyCampus Web Server using %PY_CMD%...
echo Navigate to: http://127.0.0.1:5000 in your web browser.
echo Press Ctrl+C in this terminal window to stop the server.
echo.

%PY_CMD% app.py
pause
