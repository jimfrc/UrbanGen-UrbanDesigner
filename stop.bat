@echo off
echo Stopping UrbanGen Designer servers...
echo.

echo Stopping processes on port 3001 (frontend)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /F /PID %%a 2>nul

echo Stopping processes on port 3002 (backend)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do taskkill /F /PID %%a 2>nul

echo.
echo All servers have been stopped.
timeout /t 2 /nobreak > nul
