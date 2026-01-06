# Presenton 后端启动脚本
# 保存为: start-backend.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Presenton 后端启动脚本" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 设置 UTF-8 编码（解决中文乱码问题）
Write-Host "🔧 设置 UTF-8 编码..." -ForegroundColor Yellow
$env:PYTHONUTF8 = "1"
$env:PYTHONIOENCODING = "utf-8"
Write-Host "✅ UTF-8 编码已设置" -ForegroundColor Green
Write-Host ""

# 激活 Conda 环境
Write-Host "📦 激活 Conda 环境..." -ForegroundColor Yellow
conda activate presenton_dev

# 验证 Python 版本
$pythonVersion = python --version
Write-Host "✅ Python 版本: $pythonVersion" -ForegroundColor Green
Write-Host ""

# 进入 FastAPI 目录
Write-Host "📁 进入后端目录..." -ForegroundColor Yellow
Set-Location "d:\project\presenton\presenton\servers\fastapi"
Write-Host ""

# 启动 FastAPI
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 启动 FastAPI 后端服务器..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "访问地址: http://localhost:8000" -ForegroundColor Cyan
Write-Host "API 文档: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host ""

uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
