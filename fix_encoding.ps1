$file = "c:\Users\sailo\Desktop\mandi-frontend\src\App.jsx"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# Fix malformed emoji encodings
$content = $content -replace [regex]::Escape("ðŸ—'ï¸"), "🗑️"
$content = $content -replace [regex]::Escape("âŒ"), "❌"
$content = $content -replace [regex]::Escape("ðŸ"'"), "🔒"
$content = $content -replace [regex]::Escape("â›""), "🚫"
$content = $content -replace [regex]::Escape("âš ï¸"), "⚠️"
$content = $content -replace [regex]::Escape("ðŸ"‹"), "📋"
$content = $content -replace [regex]::Escape("ðŸ›¡ï¸"), "🛡️"
$content = $content -replace [regex]::Escape("ðŸš›"), "🚛"
$content = $content -replace [regex]::Escape("ðŸ"„"), "📄"
$content = $content -replace [regex]::Escape("dY`'" + [char]0x2019 + " SECURITY CHECK"), "🔐 SECURITY CHECK"
$content = $content -replace [regex]::Escape("dY-"), "🗑️"
$content = $content -replace [regex]::Escape("dY`'"), "🔐"

[System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done - encoding fixed"
