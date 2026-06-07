[CmdletBinding()]
param(
  [string]$SiteRoot,
  [string[]]$SeedText,
  [int]$BatchSize = 40,
  [int]$MaxDownloadFailures = 3,
  [switch]$SampleOnly,
  [switch]$UseCommons,
  [switch]$Force
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $SiteRoot) {
  $SiteRoot = (Resolve-Path (Join-Path $scriptDir '..')).Path
} else {
  $SiteRoot = (Resolve-Path $SiteRoot).Path
}

$pythonBuilder = Join-Path $scriptDir 'build-seal-glyphs.py'
$pythonArgs = @($pythonBuilder, '--site-root', $SiteRoot)
if ($SampleOnly) {
  $pythonArgs += '--sample-only'
}
if ($SeedText -and $SeedText.Count -gt 0) {
  foreach ($seed in $SeedText) {
    $pythonArgs += @('--seed-text', $seed)
  }
}

python @pythonArgs
if ($LASTEXITCODE -ne 0) {
  throw "Local seal font glyph cache generation failed."
}

if (-not $UseCommons) {
  return
}

$appPath = Join-Path $SiteRoot 'app.js'
$glyphRoot = Join-Path $SiteRoot 'assets\seal-glyphs'
$generatedRoot = Join-Path $glyphRoot 'generated'
$manifestPath = Join-Path $glyphRoot 'generated-manifest.js'
$requestHeaders = @{
  'User-Agent' = 'ShizhuzhaiSealGlyphBuilder/1.0 (local build script; Wikimedia Commons API cache)'
}

New-Item -ItemType Directory -Force -Path $generatedRoot | Out-Null

function Add-UniqueItem {
  param(
    [Parameter(Mandatory = $true)] [object]$List,
    [AllowNull()] [string]$Value
  )

  if ([string]::IsNullOrWhiteSpace($Value)) { return }
  if (-not $List.Contains($Value)) { $List.Add($Value) | Out-Null }
}

function Add-TextElements {
  param(
    [Parameter(Mandatory = $true)] [object]$Set,
    [AllowNull()] [string]$Text
  )

  if ([string]::IsNullOrEmpty($Text)) { return }
  $enumerator = [System.Globalization.StringInfo]::GetTextElementEnumerator($Text)
  while ($enumerator.MoveNext()) {
    $element = [string]$enumerator.GetTextElement()
    if ($element -match '[\p{L}\p{N}]') {
      $Set.Add($element) | Out-Null
    }
  }
}

function Get-SealTitle {
  param([Parameter(Mandatory = $true)] [string]$Char)
  return "File:$Char-seal.svg"
}

function Get-CharFromSealTitle {
  param([Parameter(Mandatory = $true)] [string]$Title)
  if (-not $Title.StartsWith('File:') -or -not $Title.EndsWith('-seal.svg')) { return '' }
  return $Title.Substring(5, $Title.Length - 5 - 9)
}

function Resolve-RedirectTitle {
  param(
    [Parameter(Mandatory = $true)] [string]$Title,
    [Parameter(Mandatory = $true)] [hashtable]$Redirects
  )

  $current = $Title
  for ($i = 0; $i -lt 8; $i++) {
    if (-not $Redirects.ContainsKey($current)) { return $current }
    $current = [string]$Redirects[$current]
  }
  return $current
}

function ConvertTo-WebGlyphPath {
  param([Parameter(Mandatory = $true)] [string]$Char)
  return "assets/seal-glyphs/generated/$([uri]::EscapeDataString($Char)).svg"
}

function Invoke-WithRetry {
  param(
    [Parameter(Mandatory = $true)] [scriptblock]$Action,
    [int]$Attempts = 3
  )

  $lastError = $null
  for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
    try {
      return & $Action
    } catch {
      $lastError = $_
      if ($attempt -lt $Attempts) {
        Start-Sleep -Milliseconds (300 * $attempt)
      }
    }
  }
  throw $lastError
}

function New-TextFromCodePoints {
  param([Parameter(Mandatory = $true)] [int[]]$CodePoints)
  return -join ($CodePoints | ForEach-Object { [System.Char]::ConvertFromUtf32($_) })
}

$appText = Get-Content -LiteralPath $appPath -Raw -Encoding UTF8
$aliasMatch = [regex]::Match($appText, 'const SEAL_CHAR_ALIASES = \{(?<body>.*?)\n\s*\};', [System.Text.RegularExpressions.RegexOptions]::Singleline)
if (-not $aliasMatch.Success) {
  throw "Unable to locate SEAL_CHAR_ALIASES in $appPath."
}

$aliases = [ordered]@{}
$aliasBody = $aliasMatch.Groups['body'].Value
$aliasMatches = [regex]::Matches($aliasBody, '(?m)^\s*(?<key>[^:\s,{}]+):\s*"(?<value>[^"]*)"\s*,?')
foreach ($match in $aliasMatches) {
  $aliases[$match.Groups['key'].Value] = $match.Groups['value'].Value
}

$suffixes = @()
$suffixMatch = [regex]::Match($appText, 'const SEAL_INSCRIPTION_SUFFIXES = \[(?<body>.*?)\];', [System.Text.RegularExpressions.RegexOptions]::Singleline)
if ($suffixMatch.Success) {
  $suffixMatches = [regex]::Matches($suffixMatch.Groups['body'].Value, '"(?<value>[^"]*)"')
  foreach ($match in $suffixMatches) {
    $suffixes += $match.Groups['value'].Value
  }
}

$sampleCodePoints = @(
  @(0x5F20, 0x4E09, 0x4E4B, 0x5370),
  @(0x6E05, 0x98CE, 0x660E, 0x6708),
  @(0x56FD, 0x534E, 0x5B81, 0x4E50),
  @(0x65E0, 0x4E3A, 0x800C, 0x6CBB),
  @(0x9F8D, 0x99AC, 0x7CBE, 0x795E),
  @(0x96C5, 0x695A, 0x4E4B, 0x5370),
  @(0x674E, 0x767D, 0x5370),
  @(0x738B, 0x7FB2, 0x4E4B, 0x5370),
  @(0x5341, 0x7AF9, 0x9F4B),
  @(0x5C71, 0x4E2D, 0x5BC4, 0x53CB)
)

$defaultSeedText = @($sampleCodePoints | ForEach-Object { New-TextFromCodePoints -CodePoints $_ }) + $suffixes

if (-not $SampleOnly) {
  $defaultSeedText += @($aliases.Keys) + @($aliases.Values)
}
if ($SeedText -and $SeedText.Count -gt 0) {
  $defaultSeedText += $SeedText
}

$seedChars = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($text in $defaultSeedText) {
  Add-TextElements -Set $seedChars -Text $text
}

$candidateByChar = [ordered]@{}
$allCandidates = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($char in ($seedChars | Sort-Object)) {
  $list = New-Object 'System.Collections.Generic.List[string]'
  Add-UniqueItem -List $list -Value $char
  if ($aliases.Contains($char)) {
    Add-UniqueItem -List $list -Value ([string]$aliases[$char])
  }
  $candidateByChar[$char] = $list
  foreach ($candidate in $list) {
    $allCandidates.Add($candidate) | Out-Null
  }
}

$queryChars = @($allCandidates | Sort-Object)
$remoteByCandidate = @{}
$remoteUrlByCanonical = @{}

for ($offset = 0; $offset -lt $queryChars.Count; $offset += $BatchSize) {
  $batchChars = $queryChars[$offset..([Math]::Min($offset + $BatchSize - 1, $queryChars.Count - 1))]
  $batchTitles = @($batchChars | ForEach-Object { Get-SealTitle -Char $_ })
  $titlesParam = [uri]::EscapeDataString(($batchTitles -join '|'))
  $url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&redirects=1&prop=imageinfo&iiprop=url&titles=$titlesParam"
  $response = Invoke-WithRetry -Attempts 5 -Action { Invoke-RestMethod -Method Get -Uri $url -Headers $requestHeaders -TimeoutSec 30 }
  Start-Sleep -Milliseconds 350

  $redirects = @{}
  if ($response.query.normalized) {
    foreach ($entry in $response.query.normalized) {
      $redirects[[string]$entry.from] = [string]$entry.to
    }
  }
  if ($response.query.redirects) {
    foreach ($entry in $response.query.redirects) {
      $redirects[[string]$entry.from] = [string]$entry.to
    }
  }

  $pageByTitle = @{}
  foreach ($page in $response.query.pages) {
    $pageByTitle[[string]$page.title] = $page
  }

  foreach ($title in $batchTitles) {
    $finalTitle = Resolve-RedirectTitle -Title $title -Redirects $redirects
    if (-not $pageByTitle.ContainsKey($finalTitle)) { continue }
    $page = $pageByTitle[$finalTitle]
    if ($page.PSObject.Properties.Name -contains 'missing') { continue }
    if (-not $page.imageinfo -or -not $page.imageinfo[0].url) { continue }

    $candidateChar = Get-CharFromSealTitle -Title $title
    $canonicalChar = Get-CharFromSealTitle -Title $finalTitle
    if (-not $candidateChar -or -not $canonicalChar) { continue }

    $remoteByCandidate[$candidateChar] = [ordered]@{
      canonical = $canonicalChar
      url = [string]$page.imageinfo[0].url
    }
    if (-not $remoteUrlByCanonical.ContainsKey($canonicalChar)) {
      $remoteUrlByCanonical[$canonicalChar] = [string]$page.imageinfo[0].url
    }
  }
}

$glyphs = [ordered]@{}
$downloadFailed = New-Object 'System.Collections.Generic.List[string]'
foreach ($canonical in (@($remoteUrlByCanonical.Keys) | Sort-Object)) {
  $targetPath = Join-Path $generatedRoot ($canonical + '.svg')
  if ($downloadFailed.Count -ge $MaxDownloadFailures) {
    $downloadFailed.Add($canonical) | Out-Null
    continue
  }

  if ($Force -or -not (Test-Path -LiteralPath $targetPath)) {
    try {
      Invoke-WithRetry -Attempts 2 -Action { Invoke-WebRequest -Uri $remoteUrlByCanonical[$canonical] -Headers $requestHeaders -OutFile $targetPath -TimeoutSec 30 -UseBasicParsing | Out-Null }
      Start-Sleep -Milliseconds 120
    } catch {
      $downloadFailed.Add($canonical) | Out-Null
      if (Test-Path -LiteralPath $targetPath) {
        Remove-Item -LiteralPath $targetPath -Force
      }
      continue
    }
  }

  $glyphs[$canonical] = [ordered]@{
    url = ConvertTo-WebGlyphPath -Char $canonical
    canonical = $canonical
    source = 'generated'
  }
}

$manifestAliases = [ordered]@{}
$cacheMissing = New-Object 'System.Collections.Generic.List[string]'
foreach ($char in $candidateByChar.Keys) {
  $resolved = ''
  foreach ($candidate in $candidateByChar[$char]) {
    if ($remoteByCandidate.ContainsKey($candidate)) {
      $resolved = [string]$remoteByCandidate[$candidate].canonical
      break
    }
  }

  if ($resolved) {
    if ($resolved -ne $char) {
      $manifestAliases[$char] = $resolved
    }
  } else {
    $cacheMissing.Add($char) | Out-Null
  }
}

$manifestData = [ordered]@{
  generatedAt = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
  source = 'Wikimedia Commons Ancient Chinese characters project'
  glyphs = $glyphs
  aliases = $manifestAliases
  cacheMissing = @($cacheMissing | Sort-Object)
  downloadFailed = @($downloadFailed | Sort-Object)
}

$json = $manifestData | ConvertTo-Json -Depth 6
$manifest = "window.SHIZHUZHAI_SEAL_GLYPHS = $json;`r`n"
Set-Content -LiteralPath $manifestPath -Value $manifest -Encoding UTF8

Write-Host ("Seal glyph corpus: {0} seed chars, {1} cached SVGs, {2} manifest aliases, {3} cache misses, {4} download failures." -f $seedChars.Count, $glyphs.Count, $manifestAliases.Count, $cacheMissing.Count, $downloadFailed.Count)
if ($cacheMissing.Count -gt 0) {
  Write-Host ("Cache misses: {0}" -f (($cacheMissing | Sort-Object) -join ''))
}
if ($downloadFailed.Count -gt 0) {
  Write-Host ("Download failures: {0}" -f (($downloadFailed | Sort-Object) -join ''))
}
