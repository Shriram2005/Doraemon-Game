@echo off
REM Doraemon 3D World Launcher for Windows
REM Quick start script for the game

echo 🤖 Starting Doraemon 3D World...
echo ================================

REM Check if we're in the right directory
if not exist "index.html" (
    echo ❌ Error: index.html not found!
    echo Please run this script from the game directory.
    pause
    exit /b 1
)

echo Starting web server...

REM Try different server options
python --version >nul 2>&1
if %errorlevel% == 0 (    echo ✅ Starting Python server on port 8000
    echo 🌐 Opening browser...
    start http://localhost:8000
    echo.
    echo 🎮 Game Controls:
    echo   W/A/S/D or Arrow Keys - Move around
    echo   Space - Jump
    echo   Shift - Run
    echo   Mouse - Look around
    echo   V - Toggle camera view
    echo   N - Day/Night mode
    echo   Esc - Pause menu
    echo.
    echo Press Ctrl+C to stop the server
    python -m http.server 8000
    goto end
)

node --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Starting Node.js server on port 8000
    echo 🌐 Opening browser...
    start http://localhost:8000
    echo.
    echo 🎮 Game Controls:
    echo   W/A/S/D - Move around
    echo   Space - Jump
    echo   Shift - Run
    echo   Mouse - Look around
    echo   V - Toggle camera view
    echo   N - Day/Night mode
    echo   Esc - Pause menu
    echo.
    echo Press Ctrl+C to stop the server
    npx http-server -p 8000
    goto end
)

php --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Starting PHP server on port 8000
    echo 🌐 Opening browser...
    start http://localhost:8000
    echo.
    echo 🎮 Game Controls:
    echo   W/A/S/D - Move around
    echo   Space - Jump
    echo   Shift - Run
    echo   Mouse - Look around
    echo   V - Toggle camera view
    echo   N - Day/Night mode
    echo   Esc - Pause menu
    echo.
    echo Press Ctrl+C to stop the server
    php -S localhost:8000
    goto end
)

echo ❌ No suitable web server found!
echo Please install Python, Node.js, or PHP to run the game
echo.
echo Alternative: Double-click on index.html to open directly in browser
echo (Note: Some features may not work without a web server)

:end
pause
