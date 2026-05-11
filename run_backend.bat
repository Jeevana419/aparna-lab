@echo off
echo ========================================
echo   Aparna Laboratory - Backend
echo ========================================

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Python is NOT installed or not in PATH.
    echo.
    echo Please download and install Python from:
    echo   https://www.python.org/downloads/
    echo.
    echo IMPORTANT: During install, check the box:
    echo   "Add Python to PATH"
    echo.
    pause
    exit /b 1
)

echo [OK] Python found:
python --version
echo.

:: Go to app root
cd /d "%~dp0"

:: Create venv if it doesn't exist
if not exist "venv\Scripts\activate.bat" (
    echo [1/4] Creating virtual environment...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
) else (
    echo [1/4] Virtual environment already exists, skipping...
)

echo [2/4] Activating virtual environment...
call venv\Scripts\activate

echo [3/4] Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] pip install failed.
    pause
    exit /b 1
)

echo.
echo [4/4] Starting backend server...
echo.
echo ========================================
echo   Backend running at:
echo   http://localhost:8000
echo   API docs at: http://localhost:8000/docs
echo ========================================
echo.
cd backend
uvicorn main:app --reload --port 8000

pause
