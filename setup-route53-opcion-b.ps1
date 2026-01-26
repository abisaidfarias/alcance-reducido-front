# Script de configuración Route 53 para Opción B
# Reemplazar dominio raíz alcance-reducido.com con aplicación Angular

Write-Host "🌐 Configuración Route 53 - Opción B" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Variables
$DOMAIN = "alcance-reducido.com"
$CLOUDFRONT_DOMAIN = "d116qh3ntei4la.cloudfront.net"
$CLOUDFRONT_HOSTED_ZONE_ID = "Z2FDTNDATAQYW2" # Hosted Zone ID fijo de CloudFront

Write-Host "⚠️  IMPORTANTE: Antes de continuar, asegúrate de haber copiado TODOS los registros DNS existentes" -ForegroundColor Yellow
Write-Host "   (MX, TXT, CNAME, etc.) para no perder servicios como email." -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "¿Has copiado los registros DNS existentes? (s/n)"

if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Host "❌ Por favor, copia primero los registros DNS existentes antes de continuar." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Paso 1: Crear Hosted Zone en Route 53" -ForegroundColor Green
Write-Host "-------------------------------------------" -ForegroundColor Green

$callerReference = "alcance-reducido-$(Get-Date -Format 'yyyyMMddHHmmss')"
Write-Host "Creando Hosted Zone para $DOMAIN..."
Write-Host "Caller Reference: $callerReference"

try {
    $hostedZone = aws route53 create-hosted-zone `
        --name $DOMAIN `
        --caller-reference $callerReference `
        --output json | ConvertFrom-Json
    
    $hostedZoneId = $hostedZone.HostedZone.Id -replace '/hostedzone/', ''
    Write-Host "✅ Hosted Zone creada: $hostedZoneId" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Name Servers de Route 53 (GUARDALOS - los necesitarás en el paso final):" -ForegroundColor Yellow
    $hostedZone.DelegationSet.NameServers | ForEach-Object {
        Write-Host "   - $_" -ForegroundColor Cyan
    }
    Write-Host ""
    
    # Guardar Name Servers en archivo
    $hostedZone.DelegationSet.NameServers | Out-File -FilePath "route53-nameservers.txt" -Encoding utf8
    Write-Host "✅ Name Servers guardados en: route53-nameservers.txt" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error al crear Hosted Zone: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Paso 2: Crear Registro A para dominio raíz" -ForegroundColor Green
Write-Host "-----------------------------------------------" -ForegroundColor Green

# Actualizar el archivo JSON con el Hosted Zone ID correcto
$recordA = Get-Content "route53-record-a.json" | ConvertFrom-Json
$recordA.Changes[0].ResourceRecordSet.AliasTarget.DNSName = $CLOUDFRONT_DOMAIN

# Crear registro A
Write-Host "Creando registro A para $DOMAIN → $CLOUDFRONT_DOMAIN..."

try {
    $recordA | ConvertTo-Json -Depth 10 | aws route53 change-resource-record-sets `
        --hosted-zone-id $hostedZoneId `
        --change-batch file:///dev/stdin `
        --output json | ConvertFrom-Json
    
    Write-Host "✅ Registro A creado para dominio raíz" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al crear registro A: $_" -ForegroundColor Red
    Write-Host "   Puedes crearlo manualmente desde la consola de AWS" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Paso 3: Crear Registro A para www (opcional)" -ForegroundColor Green
Write-Host "------------------------------------------------" -ForegroundColor Green

$createWWW = Read-Host "¿Quieres crear también el registro para www.alcance-reducido.com? (s/n)"

if ($createWWW -eq "s" -or $createWWW -eq "S") {
    $recordWWW = Get-Content "route53-record-www.json" | ConvertFrom-Json
    $recordWWW.Changes[0].ResourceRecordSet.AliasTarget.DNSName = $CLOUDFRONT_DOMAIN
    
    try {
        $recordWWW | ConvertTo-Json -Depth 10 | aws route53 change-resource-record-sets `
            --hosted-zone-id $hostedZoneId `
            --change-batch file:///dev/stdin `
            --output json | ConvertFrom-Json
        
        Write-Host "✅ Registro A creado para www" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error al crear registro www: $_" -ForegroundColor Red
        Write-Host "   Puedes crearlo manualmente desde la consola de AWS" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Configuración de Route 53 completada" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Solicitar certificado SSL en ACM (región us-east-1) para:" -ForegroundColor White
Write-Host "   - $DOMAIN" -ForegroundColor Cyan
Write-Host "   - www.$DOMAIN" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Configurar dominio personalizado en CloudFront:" -ForegroundColor White
Write-Host "   - Distribution ID: E2ANIEKR516BL9" -ForegroundColor Cyan
Write-Host "   - Agregar CNAMEs: $DOMAIN, www.$DOMAIN" -ForegroundColor Cyan
Write-Host "   - Asociar certificado SSL" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Actualizar Name Servers en tu registrador:" -ForegroundColor White
Write-Host "   Los Name Servers están en: route53-nameservers.txt" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  RECUERDA: El sitio actual dejará de funcionar cuando se propague el DNS" -ForegroundColor Red
Write-Host ""

