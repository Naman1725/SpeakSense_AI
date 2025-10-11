Write-Host "Killing all Node processes on port 3000..."
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object {
    $processId = $_.OwningProcess
    Write-Host "Killing process $processId"
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 2

Write-Host "Starting frontend with updated code..."
Set-Location "c:\Users\Naman Sharma\Desktop\NegGes_AI\frontend"
npm start
