# Guía de Despliegue en AWS - Alcance Reducido Front

## Arquitectura Recomendada: S3 + CloudFront

### Componentes
- **Amazon S3**: Almacenamiento de archivos estáticos
- **CloudFront**: CDN global con HTTPS
- **Route 53** (opcional): Gestión de DNS si tienes dominio propio

---

## Pre-requisitos

1. **Cuenta AWS** con permisos para:
   - S3
   - CloudFront
   - Route 53 (si usas dominio propio)
   - IAM (para crear políticas)

2. **AWS CLI instalado y configurado**
   ```bash
   aws --version
   aws configure
   ```

3. **Dominio `alcance-reducido.com`**
   - Acceso al panel de DNS de tu proveedor
   - O usar Route 53 de AWS

---

## Paso 1: Configurar Variables de Entorno

Las variables ya están configuradas en:
- `src/environments/environment.prod.ts` - Producción
- `src/environments/environment.ts` - Desarrollo

**IMPORTANTE**: Verifica que la URL de la API en producción sea correcta:
```typescript
apiUrl: 'https://alcancereducido-prod.eba-bynjpc2g.us-east-1.elasticbeanstalk.com/api'
```

Si la API usa HTTPS, actualiza la URL.

---

## Paso 2: Build de Producción

```bash
cd alcance-reducido-front
npm run build
```

Esto generará los archivos en `dist/alcance-reducido-front/`

---

## Paso 3: Crear Bucket S3

```bash
# Crear bucket (debe ser único globalmente)
aws s3 mb s3://alcance-reducido-front --region us-east-1

# Habilitar hosting estático
aws s3 website s3://alcance-reducido-front \
  --index-document index.html \
  --error-document index.html
```

**Nota**: El nombre del bucket debe ser único globalmente. Si `alcance-reducido-front` ya existe, usa otro nombre.

---

## Paso 4: Configurar Política del Bucket

Crea un archivo `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::alcance-reducido-front/*"
    }
  ]
}
```

Aplicar la política:
```bash
aws s3api put-bucket-policy \
  --bucket alcance-reducido-front \
  --policy file://bucket-policy.json
```

---

## Paso 5: Subir Archivos a S3

```bash
# Desde la raíz del proyecto
cd alcance-reducido-front
npm run build

# Subir archivos
aws s3 sync dist/alcance-reducido-front/ s3://alcance-reducido-front/ \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html" \
  --exclude "*.json"

# Subir HTML sin cache (para que siempre se actualice)
aws s3 sync dist/alcance-reducido-front/ s3://alcance-reducido-front/ \
  --delete \
  --cache-control "no-cache, no-store, must-revalidate" \
  --exclude "*" \
  --include "*.html" \
  --include "*.json"
```

---

## Paso 6: Crear Distribución CloudFront

### Opción A: Usando AWS Console

1. Ve a **CloudFront** en la consola de AWS
2. Click en **Create Distribution**
3. **Origin Domain**: Selecciona tu bucket S3 (`alcance-reducido-front.s3.us-east-1.amazonaws.com`)
4. **Origin Access**: Selecciona "Origin access control settings (recommended)"
5. **Viewer Protocol Policy**: Redirect HTTP to HTTPS
6. **Allowed HTTP Methods**: GET, HEAD, OPTIONS
7. **Default Root Object**: `index.html`
8. **Custom Error Response**:
   - HTTP Error Code: `403`
   - Response Page Path: `/index.html`
   - HTTP Response Code: `200`
   - Repetir para `404`
9. Click **Create Distribution**

### Opción B: Usando AWS CLI

```bash
# Crear OAC (Origin Access Control)
aws cloudfront create-origin-access-control \
  --origin-access-control-config '{
    "Name": "alcance-reducido-oac",
    "OriginAccessControlOriginType": "s3",
    "SigningBehavior": "always",
    "SigningProtocol": "sigv4"
  }'

# Nota: Guarda el ID del OAC que se genera

# Crear distribución (reemplaza OAC_ID con el ID generado)
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

---

## Paso 7: Configurar DNS

### Si usas Route 53:

1. Ve a **Route 53** → **Hosted Zones**
2. Selecciona `alcance-reducido.com`
3. Click **Create Record**
4. Tipo: **A** o **CNAME**
5. Nombre: `@` (para dominio raíz) o `app` (para subdominio)
6. Alias: **Sí**
7. Route traffic to: **CloudFront distribution**
8. Selecciona tu distribución
9. Click **Create**

### Si usas otro proveedor de DNS:

1. Obtén la URL de CloudFront (ej: `d1234abcd5678.cloudfront.net`)
2. Ve al panel de DNS de tu proveedor
3. Crea un registro:
   - Tipo: **CNAME**
   - Nombre: `@` o `app`
   - Valor: `d1234abcd5678.cloudfront.net`
   - TTL: `300`

**IMPORTANTE**: Si quieres usar el dominio raíz (`alcance-reducido.com`), necesitas usar Route 53 o configurar un ALIAS/A record, no CNAME.

---

## Paso 8: Script de Despliegue Automatizado

Crea `deploy.sh`:

```bash
#!/bin/bash

set -e

echo "🚀 Iniciando despliegue a AWS..."

# Build
echo "📦 Construyendo aplicación..."
npm run build

# Subir a S3
echo "☁️ Subiendo archivos a S3..."
aws s3 sync dist/alcance-reducido-front/ s3://alcance-reducido-front/ \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html" \
  --exclude "*.json"

aws s3 sync dist/alcance-reducido-front/ s3://alcance-reducido-front/ \
  --delete \
  --cache-control "no-cache, no-store, must-revalidate" \
  --exclude "*" \
  --include "*.html" \
  --include "*.json"

# Invalidar cache de CloudFront
echo "🔄 Invalidando cache de CloudFront..."
DISTRIBUTION_ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Comment=='alcance-reducido-front'].Id" \
  --output text)

if [ ! -z "$DISTRIBUTION_ID" ]; then
  aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*"
  echo "✅ Cache invalidado"
else
  echo "⚠️ No se encontró distribución de CloudFront"
fi

echo "✅ Despliegue completado!"
```

Hacer ejecutable:
```bash
chmod +x deploy.sh
```

---

## Opciones para el Dominio

### Opción 1: Reemplazar el sitio actual
- Cambia el DNS de `alcance-reducido.com` para apuntar a CloudFront
- El sitio actual dejará de estar accesible

### Opción 2: Usar subdominio (RECOMENDADO)
- Usa `app.alcance-reducido.com` para la aplicación Angular
- Mantén `alcance-reducido.com` en el servidor actual
- Solo necesitas crear un registro CNAME para `app`

### Opción 3: Mantener ambos
- Deja el sitio actual como está
- Usa otro dominio para la app Angular

---

## Costos Estimados (mensual)

- **S3**: ~$0.023 por GB almacenado + $0.005 por 1,000 requests
- **CloudFront**: Primeros 10TB: $0.085 por GB transferido
- **Route 53**: $0.50 por hosted zone + $0.40 por millón de queries

**Total estimado**: $5-15/mes para tráfico bajo-medio

---

## Troubleshooting

### Error 403 Forbidden
- Verifica la política del bucket S3
- Verifica que los archivos se subieron correctamente

### Error 404 en rutas de Angular
- Configura error pages en CloudFront (403 y 404 → index.html)

### CORS errors
- La API debe tener CORS configurado para aceptar requests de `https://alcance-reducido.com`

### Imágenes no cargan
- Verifica que las rutas de assets sean relativas
- Verifica permisos del bucket S3

---

## Próximos Pasos

1. **Confirmar URL de API en producción** (¿tiene HTTPS?)
2. **Decidir sobre el dominio** (subdominio o reemplazar)
3. **Ejecutar build y deploy**
4. **Configurar DNS**
5. **Probar la aplicación**

---

## Comandos Rápidos

```bash
# Build
npm run build

# Deploy
./deploy.sh

# Ver logs de CloudFront
aws cloudfront list-distributions

# Invalidar cache manualmente
aws cloudfront create-invalidation --distribution-id DIST_ID --paths "/*"
```


