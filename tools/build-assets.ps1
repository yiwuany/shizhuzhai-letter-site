[CmdletBinding()]
param(
  [string]$SourceRoot,
  [string]$SiteRoot
)

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $SiteRoot) {
  $SiteRoot = (Resolve-Path (Join-Path $scriptDir '..')).Path
} else {
  $SiteRoot = (Resolve-Path $SiteRoot).Path
}

if (-not $SourceRoot) {
  $SourceRoot = (Resolve-Path (Join-Path $SiteRoot '..\shizhuzhai-png')).Path
} else {
  $SourceRoot = (Resolve-Path $SourceRoot).Path
}

$thumbRoot = Join-Path $SiteRoot 'assets\thumbs'
$previewRoot = Join-Path $SiteRoot 'assets\previews'
$manifestPath = Join-Path $SiteRoot 'assets-manifest.js'
$inlinePreviewPath = Join-Path $SiteRoot 'assets-inline-previews.js'

New-Item -ItemType Directory -Force -Path $thumbRoot, $previewRoot | Out-Null

Add-Type -AssemblyName System.Drawing

function Get-JpegCodec {
  return [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' } |
    Select-Object -First 1
}

function Save-ScaledJpeg {
  param(
    [Parameter(Mandatory = $true)] [System.Drawing.Image]$Image,
    [Parameter(Mandatory = $true)] [string]$TargetPath,
    [Parameter(Mandatory = $true)] [int]$MaxSide,
    [Parameter(Mandatory = $true)] [int64]$Quality
  )

  $longSide = [Math]::Max($Image.Width, $Image.Height)
  $scale = [Math]::Min(1.0, $MaxSide / [double]$longSide)
  $width = [Math]::Max(1, [int][Math]::Round($Image.Width * $scale))
  $height = [Math]::Max(1, [int][Math]::Round($Image.Height * $scale))

  $bitmap = New-Object System.Drawing.Bitmap $width, $height, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $encoderParams = $null

  try {
    $graphics.Clear([System.Drawing.Color]::FromArgb(250, 246, 235))
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.DrawImage($Image, 0, 0, $width, $height)

    $codec = Get-JpegCodec
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), $Quality
    $bitmap.Save($TargetPath, $codec, $encoderParams)
  } finally {
    if ($encoderParams) { $encoderParams.Dispose() }
    $graphics.Dispose()
    $bitmap.Dispose()
  }
}

function Get-RelativeWebPath {
  param(
    [Parameter(Mandatory = $true)] [string]$FromDir,
    [Parameter(Mandatory = $true)] [string]$ToPath
  )

  $fromFull = (Resolve-Path $FromDir).Path.TrimEnd('\') + '\'
  $toFull = (Resolve-Path $ToPath).Path
  $fromUri = New-Object System.Uri $fromFull
  $toUri = New-Object System.Uri $toFull
  return [System.Uri]::UnescapeDataString($fromUri.MakeRelativeUri($toUri).ToString())
}

$assets = New-Object System.Collections.Generic.List[object]
$index = 1
$imageExtensions = @('.png', '.jpg', '.jpeg', '.webp')

$categoryDirs = Get-ChildItem -LiteralPath $SourceRoot -Directory | Sort-Object Name
foreach ($categoryDir in $categoryDirs) {
  $category = $categoryDir.Name
  $thumbCategoryDir = Join-Path $thumbRoot $category
  $previewCategoryDir = Join-Path $previewRoot $category
  New-Item -ItemType Directory -Force -Path $thumbCategoryDir, $previewCategoryDir | Out-Null

  $files = Get-ChildItem -LiteralPath $categoryDir.FullName -File |
    Where-Object { $imageExtensions -contains $_.Extension.ToLowerInvariant() } |
    Sort-Object Name

  foreach ($file in $files) {
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    $thumbPath = Join-Path $thumbCategoryDir ($baseName + '.jpg')
    $previewPath = Join-Path $previewCategoryDir ($baseName + '.jpg')

    $image = [System.Drawing.Image]::FromFile($file.FullName)
    try {
      Save-ScaledJpeg -Image $image -TargetPath $thumbPath -MaxSide 280 -Quality 82
      Save-ScaledJpeg -Image $image -TargetPath $previewPath -MaxSide 1600 -Quality 88

      $assets.Add([ordered]@{
        id = ('asset-{0:D3}' -f $index)
        category = $category
        filename = $file.Name
        title = $baseName
        sourcePath = Get-RelativeWebPath -FromDir $SiteRoot -ToPath $file.FullName
        previewPath = Get-RelativeWebPath -FromDir $SiteRoot -ToPath $previewPath
        thumbPath = Get-RelativeWebPath -FromDir $SiteRoot -ToPath $thumbPath
        width = $image.Width
        height = $image.Height
      }) | Out-Null
      $index++
    } finally {
      $image.Dispose()
    }
  }
}

$json = $assets | ConvertTo-Json -Depth 5
$manifest = "window.SHIZHUZHAI_ASSETS = $json;`r`n"
Set-Content -LiteralPath $manifestPath -Value $manifest -Encoding UTF8

$inlinePreviews = [ordered]@{}
foreach ($asset in $assets) {
  $previewFullPath = Join-Path $SiteRoot ($asset.previewPath -replace '/', '\')
  $bytes = [System.IO.File]::ReadAllBytes($previewFullPath)
  $inlinePreviews[$asset.id] = 'data:image/jpeg;base64,' + [Convert]::ToBase64String($bytes)
}

$inlineJson = $inlinePreviews | ConvertTo-Json -Compress -Depth 3
$inlinePreviewManifest = "window.SHIZHUZHAI_INLINE_PREVIEWS = $inlineJson;`r`n"
Set-Content -LiteralPath $inlinePreviewPath -Value $inlinePreviewManifest -Encoding UTF8

Write-Host ("Generated {0} assets into {1}" -f $assets.Count, $SiteRoot)
Write-Host ("Generated inline previews into {0}" -f $inlinePreviewPath)
