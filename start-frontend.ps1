# Presenton 前端启动脚本
# 保存为: start-frontend.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Presenton 前端启动脚本" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 验证 Node.js 版本
Write-Host "📦 检查 Node.js 环境..." -ForegroundColor Yellow
$nodeVersion = node --version
$npmVersion = npm --version
Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
Write-Host "✅ npm 版本: $npmVersion" -ForegroundColor Green
Write-Host ""

# 进入 Next.js 目录
Write-Host "📁 进入前端目录..." -ForegroundColor Yellow
Set-Location "d:\project\presenton\presenton\servers\nextjs"
Write-Host ""

# 启动 Next.js
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🌐 启动 Next.js 前端服务器..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "访问地址: http://localhost:3000" -ForegroundColor Cyan
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host ""

npm run dev
