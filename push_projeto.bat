@echo off
echo ============================================
echo   DESCUBRA O BRASIL - Upload do Projeto
echo ============================================
echo.
echo Iniciando o envio do codigo fonte para o GitHub...
echo.

:: 1. Garantir que estamos na pasta correta
cd /d "%~dp0"

:: 2. Configurar Git se necessario
if not exist ".git" (
    echo [1/4] Inicializando Repositorio Git...
    git init
    git remote add origin https://github.com/Gabrielmenezesc/DESCUBRAOBRASIL.git
)

:: 3. Configurar Identidade (Caso nao esteja)
git config user.email "gabrielmenezesc@gmail.com"
git config user.name "Gabriel Menezes"

:: 4. Adicionar Arquivos
echo [2/4] Adicionando arquivos (incluindo automatizacao)...
git add .

:: 5. Commit
echo [3/4] Criando o commit...
git commit -m "Configuracao de Deploy Automatico + Pivot Turismo"

:: 6. Push (Forcando para substituir a versao antiga e ativar a nova)
echo [4/4] Enviando para o GitHub (pode demorar alguns segundos)...
git branch -M main
git push -f origin main

echo.
echo ============================================
echo   PRONTO! CODIGO ENVIADO COM SUCESSO.
echo.
echo   Agora va ate a aba 'Actions' no seu GitHub
echo   e veja a magica acontecer!
echo ============================================
pause
