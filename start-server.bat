@echo off
title Bibey's Florist - Localhost Server
echo ========================================================
echo   Bibey's Florist - Localhost Server Started!
echo ========================================================
echo.
echo   Buka di Laptop/PC kamu:
echo   - http://localhost:8080
echo.
echo   Buka dari HP (Wi-Fi yang sama):
echo   - http://192.168.100.112:8080
echo.
echo   Tekan Ctrl + C untuk mematikan server.
echo ========================================================
echo.
cd /d "%~dp0"
python -m http.server 8080 --bind 0.0.0.0
pause
