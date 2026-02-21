@echo off
echo Starting Blood Bridge Backend...
start "Blood Bridge - Backend" cmd /k "cd /d "%~dp0backend" && node index.js"

echo Starting Blood Bridge Frontend...
start "Blood Bridge - Frontend" cmd /k "cd /d "%~dp0blood-donor-finderfrontend-main" && npm run dev"

echo.
echo Both servers are starting!
echo   Backend  -^>  http://localhost:5000
echo   Frontend -^>  http://localhost:8080
echo.
timeout /t 3 >nul
start http://localhost:8080
