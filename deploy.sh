#!/bin/bash

set -e

echo "🚀 Iniciando despliegue a AWS..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables (ajusta según tu configuración)
BUCKET_NAME="alcance-reducido-app"
DISTRIBUTION_ID="" # Se detectará automáticamente si está vacío

# Build
echo -e "${YELLOW}📦 Construyendo aplicación...${NC}"
npm run build

if [ ! -d "dist/alcance-reducido-front" ]; then
  echo "❌ Error: No se encontró la carpeta dist/alcance-reducido-front"
  exit 1
fi

# Subir a S3
echo -e "${YELLOW}☁️ Subiendo archivos a S3...${NC}"

# Subir archivos estáticos con cache largo
aws s3 sync dist/alcance-reducido-front/ s3://$BUCKET_NAME/ \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html" \
  --exclude "*.json" \
  --exclude "service-worker.js" \
  || { echo "❌ Error al subir archivos estáticos"; exit 1; }

# Subir HTML y JSON sin cache
aws s3 sync dist/alcance-reducido-front/ s3://$BUCKET_NAME/ \
  --delete \
  --cache-control "no-cache, no-store, must-revalidate" \
  --exclude "*" \
  --include "*.html" \
  --include "*.json" \
  --include "service-worker.js" \
  || { echo "❌ Error al subir archivos HTML"; exit 1; }

echo -e "${GREEN}✅ Archivos subidos a S3${NC}"

# Invalidar cache de CloudFront
if [ -z "$DISTRIBUTION_ID" ]; then
  echo -e "${YELLOW}🔍 Buscando distribución de CloudFront...${NC}"
  DISTRIBUTION_ID=$(aws cloudfront list-distributions \
    --query "DistributionList.Items[?contains(Origins.Items[0].DomainName, '$BUCKET_NAME')].Id" \
    --output text | head -n 1)
fi

if [ ! -z "$DISTRIBUTION_ID" ] && [ "$DISTRIBUTION_ID" != "None" ]; then
  echo -e "${YELLOW}🔄 Invalidando cache de CloudFront (ID: $DISTRIBUTION_ID)...${NC}"
  INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)
  
  echo -e "${GREEN}✅ Invalidación creada: $INVALIDATION_ID${NC}"
  echo "⏳ La invalidación puede tardar 5-15 minutos en completarse"
else
  echo -e "${YELLOW}⚠️ No se encontró distribución de CloudFront. Saltando invalidación.${NC}"
fi

echo -e "${GREEN}✅ Despliegue completado!${NC}"

