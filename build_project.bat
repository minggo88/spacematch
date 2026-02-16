@echo off
chcp 65001 >nul
echo ==========================================
echo       SpaceMatch Frontend Build Tool
echo       (Smart Delta Upload Edition)
echo ==========================================
echo.

echo 1. Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed!
    pause
    exit /b %errorlevel%
)

echo.
echo 2. Syncing MediaFile assets to public...
if exist "MediaFile" (
    xcopy /E /I /Y "MediaFile" "public" >nul 2>&1
    echo    MediaFile assets synced.
)

echo.
echo 3. Cleaning cache and building...
if exist "node_modules\.vite" rd /s /q "node_modules\.vite"
if exist "dist" rd /s /q "dist"
if exist ".build_snapshot.json" del /f ".build_snapshot.json"

call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo 4. Cleaning unnecessary files from dist...
if exist "dist\api\migrations" rd /s /q "dist\api\migrations"
echo    Removed migrations folder from dist.

REM --- Ensure .user.ini is present ---
if exist "public\.user.ini" copy /Y "public\.user.ini" "dist\.user.ini" >nul 2>&1
if exist "public\api\.user.ini" copy /Y "public\api\.user.ini" "dist\api\.user.ini" >nul 2>&1

echo.
echo 5. Detecting changed files (Delta Upload)...
echo.

REM --- Run the delta detection script ---
node build_delta.cjs

echo.
echo ==========================================
echo [SUCCESS] Build completed!
echo.
echo   - dist\          : Full build output
echo   - upload\        : Changed files only (FTP upload target)
echo   - upload_log.txt : List of changed files
echo.
echo Upload the 'upload' folder to your FTP server.
echo ==========================================
echo.
pause >nul
start "" "%~dp0upload"
