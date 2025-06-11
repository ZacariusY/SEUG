@echo off
echo 🚀 Iniciando SEUG Project...
echo.

echo ⚡ Iniciando Backend...
start "Backend - SEUG" cmd /k "cd /d %~dp0 && npm start"

echo ⚡ Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo 🌐 Iniciando Frontend...
start "Frontend - SEUG" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ✅ Serviços iniciados!
echo 📋 Backend: http://localhost:3001
echo 🌐 Frontend: http://localhost:3000
echo.
echo Pressione qualquer tecla para fechar este console...
pause >nul 