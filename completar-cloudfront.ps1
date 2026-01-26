# Script para completar configuración de CloudFront cuando el certificado esté validado

Write-Host "🔐 Verificando estado del certificado SSL..." -ForegroundColor Cyan

$certArn = "arn:aws:acm:us-east-1:438758934896:certificate/444c9d61-0878-4d39-8067-9f27885ce8d5"
$status = aws acm describe-certificate --certificate-arn $certArn --region us-east-1 --query "Certificate.Status" --output text

Write-Host "Estado del certificado: $status" -ForegroundColor Yellow

if ($status -eq "ISSUED") {
    Write-Host "✅ Certificado validado! Continuando con la configuración de CloudFront..." -ForegroundColor Green
    
    # Ejecutar script Python para actualizar configuración
    python update-cloudfront.py
    
    # Leer el ETag del output
    $output = python update-cloudfront.py 2>&1
    $etagLine = $output | Select-String "ETag:"
    if ($etagLine) {
        $etag = ($etagLine -split ": ")[1].Trim()
        Write-Host "ETag obtenido: $etag" -ForegroundColor Cyan
        
        # Actualizar CloudFront
        Write-Host "🔄 Actualizando CloudFront..." -ForegroundColor Yellow
        $filePath = Join-Path $PWD "alcance-reducido-front\cloudfront-update.json"
        
        if (Test-Path $filePath) {
            aws cloudfront update-distribution --id E2ANIEKR516BL9 --if-match $etag --distribution-config "file://$filePath" --output json
            Write-Host "✅ CloudFront actualizado correctamente!" -ForegroundColor Green
            Write-Host ""
            Write-Host "⏳ La actualización puede tardar 5-15 minutos en desplegarse" -ForegroundColor Yellow
            Write-Host "   Puedes verificar el estado con:" -ForegroundColor White
            Write-Host "   aws cloudfront get-distribution --id E2ANIEKR516BL9 --query 'Distribution.Status'" -ForegroundColor Cyan
        } else {
            Write-Host "❌ No se encontró el archivo cloudfront-update.json" -ForegroundColor Red
            Write-Host "   Ejecuta primero: python update-cloudfront.py" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ No se pudo obtener el ETag" -ForegroundColor Red
    }
} else {
    Write-Host "⏳ El certificado aún está en validación. Estado: $status" -ForegroundColor Yellow
    Write-Host "   Espera unos minutos y vuelve a ejecutar este script." -ForegroundColor White
    Write-Host ""
    Write-Host "   Puedes verificar el estado manualmente con:" -ForegroundColor Cyan
    Write-Host "   aws acm describe-certificate --certificate-arn $certArn --region us-east-1 --query 'Certificate.Status'" -ForegroundColor White
}

