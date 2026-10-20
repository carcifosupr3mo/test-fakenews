@echo off
REM Costruisce e avvia la versione FINALE (senza strumenti di debug) su http://localhost:4173
cd /d "%~dp0"
if not exist node_modules ( call npm install )
start "" http://localhost:4173
call npm run play
