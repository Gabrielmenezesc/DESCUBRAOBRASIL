@echo off
echo ============================================
echo  DESCUBRA O BRASIL - Build e Deploy
echo ============================================
echo.

echo [1/4] Entrando na pasta do projeto...
cd /d "c:\Users\ENGEFIELD\.gemini\antigravity\playground\warped-spicule\descubra-site"

echo [2/4] Fazendo build do Next.js...
call npm run build
if %errorlevel% neq 0 (
    echo ERRO: Build falhou!
    pause
    exit /b 1
)

echo [3/4] Preparando deploy para GitHub...
cd out
if exist ".git" (
    rmdir /s /q .git
)
git init
git remote add origin https://github.com/Gabrielmenezesc/DESCUBRAOBRASIL.git
git config user.email "gabrielmenezesc@gmail.com"
git config user.name "Gabriel Menezes"

echo [4/4] Enviando para GitHub...
git add -A
git commit -m "Pivô para site 100% turismo - Remoção de serviços B2B"
git branch -M main
git push -f origin main

echo.
echo ============================================
echo  DEPLOY CONCLUIDO COM SUCESSO!
echo  Site: https://gabrielmenezesc.github.io/DESCUBRAOBRASIL/
echo ============================================
pause
