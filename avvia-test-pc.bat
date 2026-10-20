@echo off
REM Avvia VERIFICA in modalita' sviluppo (aggiornamento rapido + strumenti di test).
REM Poi apri http://localhost:5173 nel browser. Per fermare: chiudi la finestra o premi Ctrl+C.
cd /d "%~dp0"
if not exist node_modules ( call npm install )
start "" http://localhost:5173
call npm run dev
