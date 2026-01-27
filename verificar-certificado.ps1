# Script para verificar estado del certificado SSL

Write-Host "🔐 Verificando estado del certificado SSL..." -ForegroundColor Cyan
Write-Host ""

$certArn = "arn:aws:acm:us-east-1:438758934896:certificate/444c9d61-0878-4d39-8067-9f27885ce8d5"
$region = "us-east-1"

# Obtener estado
$status = aws acm describe-certificate --certificate-arn $certArn --region $region --query "Certificate.Status" --output text
$domain = aws acm describe-certificate --certificate-arn $certArn --region $region --query "Certificate.DomainName" --output text
$issuedAt = aws acm describe-certificate --certificate-arn $certArn --region $region --query "Certificate.IssuedAt" --output text

Write-Host "📋 Información del Certificado:" -ForegroundColor Yellow
Write-Host "   Dominio: $domain" -ForegroundColor White
Write-Host "   Estado: $status" -ForegroundColor $(if($status -eq "ISSUED"){"Green"}elseif($status -eq "PENDING_VALIDATION"){"Yellow"}else{"Red"})

if ($issuedAt -and $issuedAt -ne "None") {
    Write-Host "   Fecha de emisión: $issuedAt" -ForegroundColor White
} else {
    Write-Host "   Fecha de emisión: Aún no emitido" -ForegroundColor Yellow
}

Write-Host ""

if ($status -eq "ISSUED") {
    Write-Host "✅ CERTIFICADO ACTIVO Y LISTO!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Puedes continuar con:" -ForegroundColor White
    Write-Host "   .\completar-cloudfront.ps1" -ForegroundColor Cyan
} elseif ($status -eq "PENDING_VALIDATION") {
    Write-Host "⏳ Certificado en proceso de validación..." -ForegroundColor Yellow
    Write-Host "   Tiempo estimado: 5-15 minutos" -ForegroundColor White
    Write-Host "   Vuelve a ejecutar este script para verificar" -ForegroundColor White
} else {
    Write-Host "❌ Estado inesperado: $status" -ForegroundColor Red
    Write-Host "   Revisa el certificado en AWS Console" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📍 Ver en AWS Console:" -ForegroundColor Cyan
Write-Host "   https://console.aws.amazon.com/acm/home?region=us-east-1" -ForegroundColor White
Write-Host "   (Buscar: alcance-reducido.com)" -ForegroundColor Gray



