@echo off
REM Doraemon 3D World Deployment Script for Windows
REM This script helps deploy the game to various platforms

echo 🤖 Doraemon 3D World Deployment Script
echo =======================================

if "%1"=="--serve" goto start_server
if "%1"=="--validate" goto validate_files
if "%1"=="--optimize" goto optimize
if "%1"=="--check" goto check_browser
if "%1"=="--help" goto show_help
goto show_usage

:start_server
echo Starting local development server...

REM Check for Python 3
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python HTTP server
    python -m http.server 8000
    goto end
)

REM Check for Node.js
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Node.js HTTP server
    npx http-server -p 8000
    goto end
)

REM Check for PHP
php --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using PHP built-in server
    php -S localhost:8000
    goto end
)

echo ❌ No suitable web server found!
echo Please install Python, Node.js, or PHP to run a local server
goto end

:validate_files
echo Validating project files...

if exist "index.html" (echo ✅ index.html) else (echo ❌ index.html ^(missing^) & goto error)
if exist "js\main.js" (echo ✅ js\main.js) else (echo ❌ js\main.js ^(missing^) & goto error)
if exist "js\game.js" (echo ✅ js\game.js) else (echo ❌ js\game.js ^(missing^) & goto error)
if exist "js\character.js" (echo ✅ js\character.js) else (echo ❌ js\character.js ^(missing^) & goto error)
if exist "js\environment.js" (echo ✅ js\environment.js) else (echo ❌ js\environment.js ^(missing^) & goto error)
if exist "js\controls.js" (echo ✅ js\controls.js) else (echo ❌ js\controls.js ^(missing^) & goto error)
if exist "js\audio.js" (echo ✅ js\audio.js) else (echo ❌ js\audio.js ^(missing^) & goto error)
if exist "css\styles.css" (echo ✅ css\styles.css) else (echo ❌ css\styles.css ^(missing^) & goto error)
if exist "README.md" (echo ✅ README.md) else (echo ❌ README.md ^(missing^) & goto error)
if exist "package.json" (echo ✅ package.json) else (echo ❌ package.json ^(missing^) & goto error)

echo All required files are present!
goto end

:optimize
echo Optimizing for production...

if not exist "dist" mkdir dist

echo Copying files to dist directory...
xcopy * dist\ /E /I /Q /Y >nul 2>&1
del dist\deploy.bat >nul 2>&1
rmdir /S /Q dist\dist >nul 2>&1

echo Production files created in 'dist' directory
goto end

:check_browser
echo Browser compatibility check...
echo ✅ Chrome 60+
echo ✅ Firefox 55+
echo ✅ Safari 12+
echo ✅ Edge 79+
echo.
echo Required features:
echo ✅ WebGL 1.0
echo ✅ Web Audio API
echo ✅ Pointer Lock API
echo ✅ ES6 JavaScript
goto end

:show_help
echo.
echo 🚀 Deployment Instructions
echo =========================
echo.
echo Local Development:
echo   deploy.bat --serve
echo.
echo Static Web Hosting ^(GitHub Pages, Netlify, Vercel^):
echo   1. Upload all files to your hosting service
echo   2. Set index.html as the entry point
echo   3. Ensure HTTPS is enabled for Pointer Lock API
echo.
echo Traditional Web Server ^(Apache, Nginx^):
echo   1. Copy files to web root directory
echo   2. Ensure MIME types are configured for .js files
echo   3. Enable gzip compression for better performance
echo.
echo CDN Deployment:
echo   1. Upload files to CDN
echo   2. Update any absolute paths to relative paths
echo   3. Configure caching headers appropriately
goto end

:show_usage
echo Usage: deploy.bat [--serve^|--validate^|--optimize^|--check^|--help]
echo.
echo Options:
echo   --serve     Start local development server
echo   --validate  Check if all required files are present
echo   --optimize  Create optimized production build
echo   --check     Show browser compatibility information
echo   --help      Show detailed deployment instructions
echo.
echo Quick start: deploy.bat --serve
goto end

:error
echo.
echo ❌ Validation failed! Please ensure all required files are present.
exit /b 1

:end
pause
