# 启动 Python 岛
#   1. 服务器没在跑 → 后台把它拉起来（不弹黑窗）
#   2. 等它就绪 → 用默认浏览器打开
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 5173
$url  = "http://127.0.0.1:$port/"

function Test-AppUp {
    try {
        $c = New-Object Net.Sockets.TcpClient
        $ok = $c.ConnectAsync('127.0.0.1', $port).Wait(400)
        $c.Close()
        return $ok
    } catch {
        return $false
    }
}

if (-not (Test-AppUp)) {
    Start-Process -FilePath 'cmd.exe' `
        -ArgumentList '/c', 'npm run dev' `
        -WorkingDirectory $root `
        -WindowStyle Hidden

    $ready = $false
    for ($i = 0; $i -lt 90; $i++) {
        Start-Sleep -Milliseconds 1000
        if (Test-AppUp) { $ready = $true; break }
    }

    if (-not $ready) {
        Add-Type -AssemblyName System.Windows.Forms
        $msg = "Python Island failed to start.`n`nMake sure Node.js is installed, then run this in a terminal:`n  cd $root`n  npm run dev"
        [System.Windows.Forms.MessageBox]::Show($msg, 'Python Island', 'OK', 'Warning') | Out-Null
        exit 1
    }
}

Start-Process $url