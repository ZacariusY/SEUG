@echo off
echo 🛑 Parando SEUG Project...
echo.

echo ⚡ Finalizando processos Node.js...
taskkill /f /im node.exe >nul 2>&1

echo ✅ Todos os serviços foram parados!
echo.
echo Pressione qualquer tecla para fechar...
pause >nul 