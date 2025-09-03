@echo off
echo Starting local web server for Only Models Agency website...
echo.
echo Please choose a server option:
echo 1. Python HTTP Server (requires Python installed)
echo 2. Node.js HTTP Server (requires Node.js installed)
echo 3. Open with default browser (no server)
echo.

set /p choice=Enter your choice (1-3): 

if "%choice%"=="1" (
    echo Starting Python HTTP Server...
    echo Open http://localhost:8000 in your browser
    python -m http.server
) else if "%choice%"=="2" (
    echo Starting Node.js HTTP Server...
    echo If not installed, run: npm install -g http-server
    echo Open http://localhost:8080 in your browser
    npx http-server
) else if "%choice%"=="3" (
    echo Opening website in default browser...
    start index.html
) else (
    echo Invalid choice. Please run the script again.
    pause
    exit
)

pause