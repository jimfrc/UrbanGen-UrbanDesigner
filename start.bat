@echo off
echo Starting UrbanGen Designer...
echo.
echo Starting backend server...
start cmd /k "npm run server"
timeout /t 3 /nobreak > nul
echo.
echo "Starting frontend development server..."
start cmd /k "npm run dev"
echo.
echo Both servers are starting in separate windows.
echo Backend server: http://localhost:3002
echo Frontend server: http://localhost:3001
echo.
echo Press any key to close this window...
pause > nul
