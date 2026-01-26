# Script para monitorear la validación del certificado SSL

Write-Host "🔍 Monitoreando validación del certificado SSL..." -ForegroundColor Cyan
Write-Host "Presiona Ctrl+C para detener`n" -ForegroundColor Gray

$certArn = "arn:aws:acm:us-east-1:438758934896:certificate/444c9d61-0878-4d39-8067-9f27885ce8d5"
$region = "us-east-1"
$intentos = 0
$maxIntentos = 30  # Máximo 30 intentos (60 minutos)

while ($intentos -lt $maxIntentos) {
    $intentos++
    $timestamp = Get-Date -Format "HH:mm:ss"
    
    # Verificar estado del certificado
    $status = aws acm describe-certificate --certificate-arn $certArn --region $region --query "Certificate.Status" --output text
    $issuedAt = aws acm describe-certificate --certificate-arn $certArn --region $region --query "Certificate.IssuedAt" --output text
    
    Write-Host "[$timestamp] Intento $intentos - Estado: $status" -ForegroundColor $(if($status -eq "ISSUED"){"Green"}elseif($status -eq "PENDING_VALIDATION"){"Yellow"}else{"Red"})
    
    if ($status -eq "ISSUED") {
        Write-Host "`n✅ ¡CERTIFICADO VALIDADO!" -ForegroundColor Green
        Write-Host "Fecha de emisión: $issuedAt" -ForegroundColor White
        Write-Host "`n🎯 Próximo paso:" -ForegroundColor Cyan
        Write-Host "   Ejecutar: .\completar-cloudfront.ps1" -ForegroundColor Yellow
        break
    }
    
    if ($intentos -eq $maxIntentos) {
        Write-Host "`n⏱️  Tiempo máximo alcanzado. El certificado aún está en validación." -ForegroundColor Yellow
        Write-Host "   Puede tardar hasta 72 horas. Verifica manualmente más tarde." -ForegroundColor White
        break
    }
    
    # Esperar 2 minutos antes del siguiente intento
    Write-Host "   Esperando 2 minutos antes del siguiente chequeo..." -ForegroundColor Gray
    Start-Sleep -Seconds 120
}

Write-Host "`nMonitoreo finalizado." -ForegroundColor Cyan

