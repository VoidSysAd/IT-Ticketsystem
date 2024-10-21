@echo off

REM Bestimmt den aktuellen Pfad des Skripts (Ordner, in dem das Skript liegt)
set SCRIPT_DIR=%~dp0

REM Setzt den Pfad zur virtuellen Umgebung (venv) relativ zum Verzeichnis des Skripts
set VENV_DIR=%SCRIPT_DIR%venv

REM Prüft, ob die virtuelle Umgebung existiert
if exist "%VENV_DIR%\Scripts\activate" (
    echo Activating virtual environment...
    call "%VENV_DIR%\Scripts\activate"
    echo Virtual environment activated.
    
    REM Installiert die Pakete aus requirements.txt
    if exist "%SCRIPT_DIR%requirements.txt" (
        echo Installing packages from requirements.txt...
        pip install -r "%SCRIPT_DIR%requirements.txt"
        echo Package installation complete.
    ) else (
        echo requirements.txt not found. Please ensure the file exists in the script directory.
    )
) else (
    echo Virtual environment not found. Please create it first.
)

pause
