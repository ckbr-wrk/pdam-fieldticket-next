# generate-icons.ps1
Add-Type -AssemblyName System.Drawing

$projectRoot = $PSScriptRoot
$logoMasterPath = Join-Path $projectRoot "frontend\assets\logo-pdam.png"
if (!(Test-Path $logoMasterPath)) {
    throw "Logo master not found at $logoMasterPath"
}

$logoMaster = [System.Drawing.Bitmap]::FromFile($logoMasterPath)
$resDir = Join-Path $projectRoot "android\app\src\main\res"

function Resize-And-Save($src, $w, $h, $destPath, $bgWhite = $false, $innerScale = 1.0) {
    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    if ($bgWhite) {
        $g.Clear([System.Drawing.Color]::White)
    } else {
        $g.Clear([System.Drawing.Color]::Transparent)
    }

    $targetW = [int]($w * $innerScale)
    $targetH = [int]($h * $innerScale)
    $offsetX = [int](($w - $targetW) / 2)
    $offsetY = [int](($h - $targetH) / 2)

    $g.DrawImage($src, $offsetX, $offsetY, $targetW, $targetH)
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose()
    $bmp.Dispose()
}

# 1. Mipmap launcher icons
$densities = @(
    @{ name = "mipmap-mdpi";    icon = 48;  fg = 108 },
    @{ name = "mipmap-hdpi";    icon = 72;  fg = 162 },
    @{ name = "mipmap-xhdpi";   icon = 96;  fg = 216 },
    @{ name = "mipmap-xxhdpi";  icon = 144; fg = 324 },
    @{ name = "mipmap-xxxhdpi"; icon = 192; fg = 432 }
)

foreach ($d in $densities) {
    $dir = Join-Path $resDir $d.name
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

    # Standard & Round icons (full circle on transparent)
    Resize-And-Save $logoMaster $d.icon $d.icon (Join-Path $dir "ic_launcher.png") $false 0.94
    Resize-And-Save $logoMaster $d.icon $d.icon (Join-Path $dir "ic_launcher_round.png") $false 0.94

    # Foreground adaptive icon (centered in 72% safe-zone)
    Resize-And-Save $logoMaster $d.fg $d.fg (Join-Path $dir "ic_launcher_foreground.png") $false 0.72

    Write-Host "Updated $($d.name)"
}

# 2. Splash screens
$splashes = @(
    @{ dir = "drawable";                w = 480;  h = 320 },
    @{ dir = "drawable-land-mdpi";       w = 480;  h = 320 },
    @{ dir = "drawable-land-hdpi";       w = 800;  h = 480 },
    @{ dir = "drawable-land-xhdpi";      w = 1280; h = 720 },
    @{ dir = "drawable-land-xxhdpi";     w = 1600; h = 960 },
    @{ dir = "drawable-land-xxxhdpi";    w = 1920; h = 1280 },
    @{ dir = "drawable-port-mdpi";       w = 320;  h = 480 },
    @{ dir = "drawable-port-hdpi";       w = 480;  h = 800 },
    @{ dir = "drawable-port-xhdpi";      w = 720;  h = 1280 },
    @{ dir = "drawable-port-xxhdpi";     w = 960;  h = 1600 },
    @{ dir = "drawable-port-xxxhdpi";    w = 1280; h = 1920 }
)

foreach ($s in $splashes) {
    $dir = Join-Path $resDir $s.dir
    if (Test-Path $dir) {
        $minDim = [Math]::Min($s.w, $s.h)
        $logoSize = [int]($minDim * 0.42)
        if ($logoSize -lt 96) { $logoSize = 96 }

        $bmp = New-Object System.Drawing.Bitmap($s.w, $s.h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.Clear([System.Drawing.Color]::White)

        $x = [int](($s.w - $logoSize) / 2)
        $y = [int](($s.h - $logoSize) / 2)
        $g.DrawImage($logoMaster, $x, $y, $logoSize, $logoSize)

        $dest = Join-Path $dir "splash.png"
        $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
        $g.Dispose()
        $bmp.Dispose()
        Write-Host "Updated $dest"
    }
}

$logoMaster.Dispose()
Write-Host "All Android icons and splash screens generated successfully!"
