# 🚀 Guía de Despliegue - Alcance Reducido Front

## Arquitectura: S3 + CloudFront

- **Subdominio**: `app.alcance-reducido.com`
- **Dominio principal**: `alcance-reducido.com` (se mantiene en servidor actual)
- **API**: `https://alcancereducido-prod.eba-bynjpc2g.us-east-1.elasticbeanstalk.com/api`

---

## 📋 Pre-requisitos

1. **AWS CLI instalado y configurado**
   ```bash
   aws --version
   aws configure
   ```

2. **Permisos AWS necesarios**:
   - S3 (crear bucket, subir archivos)
   - CloudFront (crear distribución)
   - IAM (para políticas)

3. **Acceso al DNS** de `alcance-reducido.com` para crear registro CNAME

---

## 🔧 Paso 1: Crear Bucket S3

```bash
# Crear bucket (ajusta el nombre si es necesario)
aws s3 mb s3://alcance-reducido-app --region us-east-1
```

**Nota**: Si el bucket ya existe o el nombre no está disponible, usa otro nombre único.

---

## 🔒 Paso 2: Configurar Política del Bucket

Crea el archivo `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::alcance-reducido-app/*"
    }
  ]
}
```

Aplicar la política:
```bash
aws s3api put-bucket-policy \
  --bucket alcance-reducido-app \
  --policy file://bucket-policy.json
```

**Deshabilitar bloqueo de acceso público** (si está habilitado):
```bash
aws s3api put-public-access-block \
  --bucket alcance-reducido-app \
  --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,IgnorePublicPolicy=false,RestrictPublicBuckets=false"
```

---

## 📦 Paso 3: Build y Despliegue

### Opción A: Usar el script automatizado (Recomendado)

```bash
# Hacer ejecutable (solo la primera vez)
chmod +x deploy.sh

# Ejecutar despliegue
./deploy.sh
```

### Opción B: Manual

```bash
# 1. Build de producción
npm run build

# 2. Subir archivos estáticos (con cache largo)
aws s3 sync dist/alcance-reducido-front/ s3://alcance-reducido-app/ \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html" \
  --exclude "*.json"

# 3. Subir HTML y JSON (sin cache)
aws s3 sync dist/alcance-reducido-front/ s3://alcance-reducido-app/ \
  --delete \
  --cache-control "no-cache, no-store, must-revalidate" \
  --exclude "*" \
  --include "*.html" \
  --include "*.json"
```

---

## ☁️ Paso 4: Crear Distribución CloudFront

### Usando AWS Console (Recomendado para primera vez)

1. Ve a **CloudFront** en la consola de AWS
2. Click en **Create Distribution**
3. **Origin Domain**: 
   - Selecciona `alcance-reducido-app.s3.us-east-1.amazonaws.com`
   - O ingresa manualmente el nombre del bucket
4. **Origin Access**: 
   - Selecciona "Origin access control settings (recommended)"
   - Click "Create control setting"
   - Name: `alcance-reducido-oac`
   - Signing behavior: `Always`
   - Origin type: `S3`
   - Click "Create"
5. **Viewer Protocol Policy**: `Redirect HTTP to HTTPS`
6. **Allowed HTTP Methods**: `GET, HEAD, OPTIONS`
7. **Default Root Object**: `index.html`
8. **Comment**: `alcance-reducido-app`
9. **Custom Error Response** (IMPORTANTE para Angular):
   - Click "Add custom error response"
   - HTTP Error Code: `403`
   - Customize Error Response: `Yes`
   - Response Page Path: `/index.html`
   - HTTP Response Code: `200`
   - Click "Add"
   - Repetir para `404` (mismo proceso)
10. Click **Create Distribution**
11. **Espera 5-15 minutos** a que la distribución se cree (status: Deployed)

### Obtener el Domain Name de CloudFront

Una vez creada, copia el **Domain Name** (ej: `d1234abcd5678.cloudfront.net`)

---

## 🌐 Paso 5: Configurar DNS (CNAME)

### Si usas Route 53:

1. Ve a **Route 53** → **Hosted Zones**
2. Selecciona `alcance-reducido.com`
3. Click **Create Record**
4. Configuración:
   - **Record name**: `app`
   - **Record type**: `CNAME`
   - **Value**: `d1234abcd5678.cloudfront.net` (tu Domain Name de CloudFront)
   - **TTL**: `300`
5. Click **Create**

### Si usas otro proveedor de DNS (cPanel, GoDaddy, etc.):

1. Accede al panel de DNS de tu proveedor
2. Busca la sección de **DNS Records** o **Zone Editor**
3. Crea un nuevo registro:
   - **Tipo**: `CNAME`
   - **Nombre/Host**: `app`
   - **Valor/Target**: `d1234abcd5678.cloudfront.net` (tu Domain Name de CloudFront)
   - **TTL**: `300` o `Automatic`
4. Guarda los cambios

**Nota**: Los cambios de DNS pueden tardar 5 minutos a 48 horas en propagarse (normalmente 15-30 minutos).

---

## ✅ Paso 6: Verificar Despliegue

1. Espera a que CloudFront esté **Deployed** (status verde)
2. Espera a que el DNS se propague (puedes verificar con `nslookup app.alcance-reducido.com`)
3. Accede a `https://app.alcance-reducido.com`
4. Verifica que la aplicación cargue correctamente
5. Prueba el login y las funcionalidades

---

## 🔄 Actualizaciones Futuras

Para actualizar la aplicación:

```bash
./deploy.sh
```

O manualmente:

```bash
npm run build
aws s3 sync dist/alcance-reducido-front/ s3://alcance-reducido-app/ --delete
aws cloudfront create-invalidation --distribution-id TU_DIST_ID --paths "/*"
```

---

## 🐛 Troubleshooting

### Error 403 Forbidden
- Verifica la política del bucket S3
- Verifica que los archivos se subieron correctamente: `aws s3 ls s3://alcance-reducido-app/`

### Error 404 en rutas de Angular
- Verifica que configuraste los Custom Error Responses en CloudFront (403 y 404 → index.html)
- Espera a que CloudFront termine de desplegar

### CORS errors con la API
- La API debe tener CORS configurado para aceptar requests de `https://app.alcance-reducido.com`
- Verifica en el backend que el header `Access-Control-Allow-Origin` incluya tu dominio

### Imágenes no cargan
- Verifica que las rutas de assets sean relativas
- Verifica permisos del bucket S3

### DNS no resuelve
- Verifica que el registro CNAME esté correcto
- Usa `nslookup app.alcance-reducido.com` o `dig app.alcance-reducido.com` para verificar
- Espera más tiempo (puede tardar hasta 48 horas)

---

## 📊 Costos Estimados (mensual)

- **S3**: ~$0.50-2 (depende del tamaño y requests)
- **CloudFront**: ~$1-5 (primeros 10TB: $0.085/GB)
- **Route 53**: $0.50 (hosted zone) + $0.40 por millón de queries

**Total estimado**: $2-8/mes para tráfico bajo-medio

---

## 🔐 Seguridad

- ✅ HTTPS automático con CloudFront
- ✅ Certificado SSL gratuito (proporcionado por AWS)
- ✅ Política de bucket solo lectura pública
- ✅ CloudFront protege el bucket S3

---

## 📝 Checklist de Despliegue

- [ ] AWS CLI instalado y configurado
- [ ] Bucket S3 creado
- [ ] Política del bucket configurada
- [ ] Build de producción ejecutado (`npm run build`)
- [ ] Archivos subidos a S3
- [ ] Distribución CloudFront creada
- [ ] Custom Error Responses configurados (403, 404 → index.html)
- [ ] Registro CNAME creado en DNS (`app` → CloudFront domain)
- [ ] Esperado a que CloudFront esté Deployed
- [ ] Esperado a que DNS se propague
- [ ] Verificado acceso a `https://app.alcance-reducido.com`
- [ ] Probado login y funcionalidades

---

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs de CloudFront en AWS Console
2. Verifica los permisos del bucket S3
3. Verifica la configuración de CORS en la API
4. Revisa la consola del navegador para errores

---

## 📞 Información de Contacto

- **API URL**: `https://alcancereducido-prod.eba-bynjpc2g.us-east-1.elasticbeanstalk.com/api`
- **App URL**: `https://app.alcance-reducido.com`
- **Dominio principal**: `https://alcance-reducido.com` (se mantiene en servidor actual)


