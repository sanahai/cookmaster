# Generates public/logo.png  -- COOKmaster wordmark (warm orange theme)
Add-Type -AssemblyName System.Drawing

$dark = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(63, 58, 54))
$orange = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(234, 88, 12))
$font = New-Object System.Drawing.Font("Arial", [single]130, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fmt = [System.Drawing.StringFormat]::GenericTypographic

$t1 = "COOK"
$t2 = "master"

# measure on a scratch bitmap
$tmp = New-Object System.Drawing.Bitmap(10, 10)
$mg = [System.Drawing.Graphics]::FromImage($tmp)
$s1 = $mg.MeasureString($t1, $font, [int]4000, $fmt)
$s2 = $mg.MeasureString($t2, $font, [int]4000, $fmt)
$mg.Dispose(); $tmp.Dispose()

$padX = 60
$padY = 50
$textW = $s1.Width + $s2.Width
$textH = [Math]::Max($s1.Height, $s2.Height)
$W = [int]($textW + 2 * $padX)
$H = [int]($textH + 2 * $padY)

$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::Transparent)

$x = [single]$padX
$y = [single]$padY
$g.DrawString($t1, $font, $dark, $x, $y, $fmt)
$g.DrawString($t2, $font, $orange, [single]($x + $s1.Width), $y, $fmt)

$g.Dispose()
$out = Join-Path $PSScriptRoot "..\public\logo.png"
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "Saved $out ($W x $H)"
