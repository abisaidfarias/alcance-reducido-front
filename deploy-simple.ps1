# Script de despliegue simple para Windows PowerShell
# Uso: .\deploy-simple.ps1

$BUCKET_NAME = "alcance-reducido-app"
$DISTRIBUTION_ID = "E2ANIEKR516BL9"

Write-Host "🚀 Iniciando despliegue..." -ForegroundColor Cyan

# 1. Build
Write-Host "`n[1/4] Construyendo aplicacion..." -ForegroundColor Yellow
npm run build

if (-not (Test-Path "dist\alcance-reducido-front\browser")) {
    Write-Host "❌ Error: No se encontro la carpeta dist\alcance-reducido-front\browser" -ForegroundColor Red
    exit 1
}

# 2. Subir archivos JS, CSS, imágenes (con cache largo)
Write-Host "`n[2/4] Subiendo archivos estaticos..." -ForegroundColor Yellow
aws s3 sync dist\alcance-reducido-front\browser\ s3://$BUCKET_NAME/ `
    --delete `
    --cache-control "public, max-age=31536000" `
    --exclude "*.html" `
    --exclude "*.json"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al subir archivos estaticos" -ForegroundColor Red
    exit 1
}

# 3. Subir HTML y JSON (sin cache)
Write-Host "`n[3/4] Subiendo archivos HTML..." -ForegroundColor Yellow
aws s3 sync dist\alcance-reducido-front\browser\ s3://$BUCKET_NAME/ `
    --delete `
    --cache-control "no-cache, no-store, must-revalidate" `
    --exclude "*" `
    --include "*.html" `
    --include "*.json"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al subir archivos HTML" -ForegroundColor Red
    exit 1
}

# 4. Invalidar cache de CloudFront
Write-Host "`n[4/4] Invalidando cache de CloudFront..." -ForegroundColor Yellow
$INVALIDATION = aws cloudfront create-invalidation `
    --distribution-id $DISTRIBUTION_ID `
    --paths "/*" `
    --query 'Invalidation.Id' `
    --output text

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Invalidacion creada: $INVALIDATION" -ForegroundColor Green
    Write-Host "⏳ La invalidacion puede tardar 5-15 minutos" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  No se pudo crear la invalidacion" -ForegroundColor Yellow
}

Write-Host "`n✅ Despliegue completado!" -ForegroundColor Green
Write-Host "`nEspera 5-15 minutos y prueba: https://alcance-reducido.com" -ForegroundColor Cyan

