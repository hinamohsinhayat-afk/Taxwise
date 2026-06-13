$body = Get-Content -Raw 'test-payload.json'
$r = Invoke-WebRequest -Uri 'http://localhost:3000/api/assistant' -Method POST -ContentType 'application/json' -Body $body
Write-Output $r.Content
