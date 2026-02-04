Write-Host "Starting UrbanGen Designer..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting backend server..." -ForegroundColor Yellow
$backend = Start-Process -FilePath "npm" -ArgumentList "run", "server" -PassThru -NoNewWindow

Start-Sleep -Seconds 3

Write-Host "Starting frontend development server..." -ForegroundColor Yellow
$frontend = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -NoNewWindow

Write-Host ""
Write-Host "Backend server: http://localhost:3002" -ForegroundColor Cyan
Write-Host "Frontend server: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Gray

try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host ""
    Write-Host "Stopping servers..." -ForegroundColor Red
    Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $frontend.Id -Force -ErrorAction SilentlyContinue
    Write-Host "Servers stopped." -ForegroundColor Green
}
