@echo off

REM Bestimmt den aktuellen Pfad des Skripts (Ordner, in dem das Skript liegt)
set SCRIPT_DIR=%~dp0

REM Aktiviert die virtuelle Umgebung im Ordner "IT-Ticketsystem\venv"
set VENV_DIR=%SCRIPT_DIR%venv

if exist "%VENV_DIR%\Scripts\activate" (
    echo Activating virtual environment...
    call "%VENV_DIR%\Scripts\activate"
    echo Virtual environment activated.
) else (
    echo Virtual environment not found. Please create it first.
)

REM Optional: Projekt starten (z.B. Flask Server)
REM python <Pfad-zu-deiner-App>.py

pause
