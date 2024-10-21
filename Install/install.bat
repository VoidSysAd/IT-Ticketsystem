@echo off

REM Installiere CouchDB und Node.js, falls Installer vorhanden sind
set INSTALLER_DIR=%~dp0

REM CouchDB installieren oder prüfen, ob CouchDB installiert ist
if exist "%INSTALLER_DIR%\apache-couchdb-3.4.1.msi" (
    echo Installing CouchDB...
    start /wait msiexec /i "%INSTALLER_DIR%\apache-couchdb-3.4.1.msi" /quiet
    if %errorlevel%==0 (
        echo CouchDB installation complete.
    ) else (
        echo CouchDB installation failed.
    )
) else (
    where couchdb >nul 2>nul
    if %errorlevel%==0 (
        echo CouchDB is already installed.
    ) else (
        echo CouchDB installer not found. Please ensure the installer is available.
    )
)

REM Node.js installieren oder prüfen, ob Node.js installiert ist
if exist "%INSTALLER_DIR%\node-v20.18.0-x64.msi" (
    echo Installing Node.js...
    start /wait msiexec /i "%INSTALLER_DIR%\node-v20.18.0-x64.msi" /quiet
    if %errorlevel%==0 (
        echo Node.js installation complete.
    ) else (
        echo Node.js installation failed.
    )
) else (
    where node >nul 2>nul
    if %errorlevel%==0 (
        echo Node.js is already installed.
    ) else (
        echo Node.js installer not found. Please ensure the installer is available.
    )
)

REM CouchDB Windows-Dienst starten, falls er nicht gestartet ist
sc query "Apache CouchDB" | find "RUNNING"
if %errorlevel% neq 0 (
    echo Starting CouchDB service...
    sc start "Apache CouchDB"
    if %errorlevel%==0 (
        echo CouchDB service started successfully.
    ) else (
        echo Failed to start CouchDB service.
    )
) else (
    echo CouchDB service is already running.
)

REM Installation process complete
echo.
echo Installation process complete. Press any key to exit.
pause
