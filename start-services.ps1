# Start Tingwu backend services
$root = "g:\tingwu-project"
$actualRoot = "g:\听说"
$logDir = "$actualRoot\logs"

# Load .env file
$envFile = "$actualRoot\.env"
foreach ($line in [System.IO.File]::ReadAllLines($envFile, [System.Text.Encoding]::UTF8)) {
    if ($line -match '^\s*([^#][^=]*?)\s*=\s*(.*)\s*$') {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
    }
}

$services = @(
    @{ name = "auth-service";        port = 3001; script = "packages\auth-service\dist\index.js" },
    @{ name = "user-service";        port = 3002; script = "packages\user-service\dist\index.js" },
    @{ name = "practice-service";    port = 3003; script = "packages\practice-service\dist\index.js" },
    @{ name = "evaluation-service";  port = 3004; script = "packages\evaluation-service\dist\index.js" },
    @{ name = "scheduling-service";  port = 3005; script = "packages\scheduling-service\dist\index.js" },
    @{ name = "analytics-service";   port = 3006; script = "packages\analytics-service\dist\index.js" }
)

foreach ($svc in $services) {
    $logFile = "$logDir\$($svc.name).log"
    $scriptPath = "$actualRoot\$($svc.script)"

    $listening = netstat -ano | Select-String ":$($svc.port) " | Where-Object { $_ -match 'LISTENING' }
    if ($listening) {
        Write-Host "[$($svc.name)] already running on port $($svc.port), skip" -ForegroundColor Yellow
        continue
    }

    Write-Host "Starting $($svc.name) (port $($svc.port))..." -ForegroundColor Cyan
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "node"
    $psi.Arguments = $scriptPath
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.CreateNoWindow = $true
    $psi.WorkingDirectory = $actualRoot

    foreach ($key in [System.Environment]::GetEnvironmentVariables("Process").Keys) {
        $val = [System.Environment]::GetEnvironmentVariable($key, "Process")
        if ($null -ne $val) {
            $psi.EnvironmentVariables[$key] = $val
        }
    }

    $proc = [System.Diagnostics.Process]::Start($psi)

    $outWriter = [System.IO.StreamWriter]::new($logFile, $false, [System.Text.Encoding]::UTF8)
    $outWriter.AutoFlush = $true
    $proc.OutputDataReceived.Add([System.Diagnostics.DataReceivedEventHandler]{
        param($s, $e)
        if ($null -ne $e.Data) { $outWriter.WriteLine($e.Data) }
    }) | Out-Null
    $proc.ErrorDataReceived.Add([System.Diagnostics.DataReceivedEventHandler]{
        param($s, $e)
        if ($null -ne $e.Data) { $outWriter.WriteLine("[ERR] " + $e.Data) }
    }) | Out-Null
    $proc.BeginOutputReadLine()
    $proc.BeginErrorReadLine()

    Write-Host "  PID: $($proc.Id)" -ForegroundColor Green
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "Waiting for services to initialize..." -ForegroundColor White
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "=== Port Status ===" -ForegroundColor White
foreach ($svc in $services) {
    $listening = netstat -ano | Select-String ":$($svc.port) " | Where-Object { $_ -match 'LISTENING' }
    if ($listening) {
        Write-Host "  $($svc.name) :$($svc.port)  [OK]" -ForegroundColor Green
    } else {
        Write-Host "  $($svc.name) :$($svc.port)  [NOT STARTED]" -ForegroundColor Red
    }
}
