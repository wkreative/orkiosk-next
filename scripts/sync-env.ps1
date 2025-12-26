
$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
    Write-Error ".env.local not found"
    exit 1
}

$lines = Get-Content $envFile
foreach ($line in $lines) {
    if ([string]::IsNullOrWhiteSpace($line) -or $line.StartsWith("#")) {
        continue
    }
    
    $parts = $line.Split("=", 2)
    if ($parts.Length -eq 2) {
        $key = $parts[0].Trim()
        $value = $parts[1].Trim()
        
        Write-Host "Adding $key to Vercel..."
        
        # Add to Production
        $value | npx vercel env add $key production
        
        # Add to Preview (optional but good)
        # $value | npx vercel env add $key preview
        
        # Add to Development
        # $value | npx vercel env add $key development
    }
}
