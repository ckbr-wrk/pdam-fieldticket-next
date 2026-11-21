# ============================================================
#  build-apk.ps1
#  PDAM FieldTicket Cikembar - Build Android Native APK
# ============================================================

$ErrorActionPreference = 'Stop'
$rootDir = $PSScriptRoot

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Build APK: PDAM FieldTicket Cikembar (Next.js Edition)  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Set Java & Android SDK Environment
Write-Host "Step 1: Menyiapkan environment build Android..." -ForegroundColor Yellow
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path

# Step 2: Sync Capacitor
Write-Host "Step 2: Menyelaraskan aset web ke Android..." -ForegroundColor Yellow
Set-Location $rootDir
npx cap sync android

# Step 3: Jalankan Gradle assembleDebug
Write-Host "Step 3: Mengompilasi native Android APK via Gradle..." -ForegroundColor Yellow
Set-Location "$rootDir\android"
.\gradlew.bat assembleDebug

# Step 4: Salin APK ke folder releases
Write-Host "Step 4: Menyalin file APK ke folder releases..." -ForegroundColor Yellow
$releasesDir = "$rootDir\releases"
if (!(Test-Path $releasesDir)) { New-Item -ItemType Directory -Path $releasesDir | Out-Null }

$srcApk = "$rootDir\android\app\build\outputs\apk\debug\app-debug.apk"
$destApk = "$releasesDir\FieldTicket-Cikembar-v3.0.apk"

Copy-Item $srcApk $destApk -Force

$fileInfo = Get-Item $destApk
$sizeMb = [Math]::Round($fileInfo.Length / 1MB, 2)

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  BUILD SUKSES!" -ForegroundColor Green
Write-Host "  File APK : $destApk ($sizeMb MB)" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
