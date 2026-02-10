@echo off
echo ==========================================
echo       SpaceMatch Frontend Build Tool
echo ==========================================
echo.
echo 1. Installing dependencies (this may take a while)...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] npm install failed!
    pause
    exit /b %errorlevel%
)

echo.
echo 2. Cleaning cache and building...
chcp 65001
if exist "node_modules\.vite" rd /s /q "node_modules\.vite"
if exist "dist" rd /s /q "dist"

echo running npm run build...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo 3. Copying backend API files to dist...
xcopy /E /I /Y "public\api" "dist\api"
if %errorlevel% neq 0 (
    echo.
    echo [WARNING] API file copy had issues, but build succeeded.
)

echo.
echo 4. Copying other public assets to dist...
if exist "public\uploads" xcopy /E /I /Y "public\uploads" "dist\uploads"

echo.
echo 5. Cleaning up unnecessary files from dist...
if exist "dist\debug_users.php" del /q "dist\debug_users.php"
if exist "dist\diagnose.php" del /q "dist\diagnose.php"
if exist "dist\fix_applications.php" del /q "dist\fix_applications.php"
if exist "dist\fix_db.php" del /q "dist\fix_db.php"
if exist "dist\migrate_applications.php" del /q "dist\migrate_applications.php"
if exist "dist\migrate_user_enhancements.php" del /q "dist\migrate_user_enhancements.php"
if exist "dist\migrate_venues.php" del /q "dist\migrate_venues.php"
if exist "dist\setup.php" del /q "dist\setup.php"
echo    Removed debug/migration PHP files from dist.

echo.
echo ==========================================
echo [SUCCESS] Build completed successfully!
echo The files are in the 'dist' folder.
echo Backend API files have been copied automatically.
echo You can now upload the 'dist' folder to your server.
echo ==========================================
echo.
echo Press any key to open the dist folder...
pause >nul
start "" "%~dp0dist"
