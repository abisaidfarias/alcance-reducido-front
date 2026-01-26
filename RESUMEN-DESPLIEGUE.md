# 📋 Resumen del Despliegue - Opción B

**Fecha**: 25 de Enero 2025  
**Objetivo**: Reemplazar `alcance-reducido.com` completamente con la aplicación Angular

---

## ✅ Completado

### 1. Route 53 - Hosted Zone
- ✅ **Hosted Zone creada**: `Z00603941KQBVTNY6LOLY`
- ✅ **Name Servers**:
  - ns-636.awsdns-15.net
  - ns-2035.awsdns-62.co.uk
  - ns-143.awsdns-17.com
  - ns-1301.awsdns-34.org
- ✅ **Registro A para dominio raíz**: `alcance-reducido.com` → CloudFront
- ✅ **Registro A para www**: `www.alcance-reducido.com` → CloudFront
- ✅ **Registros de validación SSL**: Creados (2 registros CNAME)

### 2. AWS Certificate Manager (ACM)
- ✅ **Certificado solicitado**: `arn:aws:acm:us-east-1:438758934896:certificate/444c9d61-0878-4d39-8067-9f27885ce8d5`
- ✅ **Dominios**: `alcance-reducido.com`, `www.alcance-reducido.com`
- ⏳ **Estado**: `PENDING_VALIDATION` (validación en proceso)
- ✅ **Registros DNS de validación**: Creados en Route 53

### 3. CloudFront
- ✅ **Distribution ID**: `E2ANIEKR516BL9`
- ✅ **Estado**: Deployed
- ✅ **Domain Name**: `d116qh3ntei4la.cloudfront.net`
- ⏳ **Aliases**: Pendiente (esperando certificado validado)
- ⏳ **Certificado SSL**: Pendiente de asociar (esperando validación)

### 4. Configuración de Aplicación
- ✅ **environment.prod.ts**: Actualizado para usar `alcance-reducido.com`

### 5. Archivos Creados
- ✅ `route53-nameservers.txt` - Name Servers de Route 53
- ✅ `route53-record-a.json` - Configuración registro A dominio raíz
- ✅ `route53-record-www.json` - Configuración registro A www
- ✅ `route53-cert-validation.json` - Registros de validación SSL
- ✅ `update-cloudfront.py` - Script para actualizar CloudFront
- ✅ `completar-cloudfront.ps1` - Script para completar cuando certificado esté listo

---

## ⏳ Pendiente (Automático)

### 1. Validación del Certificado SSL
- ⏳ **Estado actual**: `PENDING_VALIDATION`
- ⏳ **Tiempo estimado**: 5-15 minutos
- ✅ **Registros DNS**: Ya creados en Route 53
- **Acción**: Esperar validación automática

### 2. Configuración Final de CloudFront
- ⏳ **Aliases**: Configurar cuando certificado esté validado
- ⏳ **Certificado SSL**: Asociar cuando esté validado
- **Acción**: Ejecutar `.\completar-cloudfront.ps1` cuando certificado esté `ISSUED`

---

## 🔴 Pendiente (Manual - Requiere Acción)

### 1. ⚠️ CRÍTICO: Copiar Registros DNS Existentes
**ANTES de cambiar los Name Servers**, debes copiar todos los registros DNS actuales:

1. Acceder al panel DNS actual del registrador
2. Copiar TODOS los registros:
   - **MX** (email) - ⚠️ CRÍTICO si usas email
   - **TXT** (SPF, DKIM, verificaciones)
   - **CNAME** (subdominios)
   - **A** (otros servicios)
3. Crear estos mismos registros en Route 53

**Si no haces esto, perderás:**
- ❌ Email (si no copias MX)
- ❌ Verificaciones (si no copias TXT)
- ❌ Subdominios (si no copias CNAME)

### 2. Actualizar Name Servers en Registrador
**DESPUÉS de copiar los registros DNS y cuando el certificado esté validado:**

1. Acceder al panel del registrador (GoDaddy, Namecheap, etc.)
2. Ir a la sección de **Name Servers** o **DNS Management**
3. Cambiar los Name Servers actuales por estos de Route 53:
   ```
   ns-636.awsdns-15.net
   ns-2035.awsdns-62.co.uk
   ns-143.awsdns-17.com
   ns-1301.awsdns-34.org
   ```
4. Guardar los cambios

**⚠️ IMPORTANTE**: 
- El sitio actual dejará de funcionar cuando se propague el DNS (15 min - 48 horas)
- Hacer esto en horario de bajo tráfico
- Los cambios de DNS pueden tardar hasta 48 horas en propagarse completamente

---

## 📝 Pasos Siguientes (En Orden)

### Paso 1: Copiar Registros DNS Existentes (AHORA)
```
1. Acceder al panel DNS del registrador
2. Copiar todos los registros (MX, TXT, CNAME, A)
3. Crear estos registros en Route 53 usando AWS Console o CLI
```

### Paso 2: Esperar Validación del Certificado (5-15 min)
```powershell
# Verificar estado
aws acm describe-certificate --certificate-arn "arn:aws:acm:us-east-1:438758934896:certificate/444c9d61-0878-4d39-8067-9f27885ce8d5" --region us-east-1 --query "Certificate.Status"

# Cuando muestre "ISSUED", continuar con Paso 3
```

### Paso 3: Completar Configuración de CloudFront
```powershell
# Ejecutar script automatizado
.\completar-cloudfront.ps1

# O manualmente:
python update-cloudfront.py
# (Usar el ETag que muestra el script)
aws cloudfront update-distribution --id E2ANIEKR516BL9 --if-match [ETAG] --distribution-config file://cloudfront-update.json
```

### Paso 4: Actualizar Name Servers en Registrador
```
1. Ir al panel del registrador
2. Cambiar Name Servers a los de Route 53 (ver route53-nameservers.txt)
3. Guardar cambios
4. Esperar propagación DNS (15 min - 48 horas)
```

### Paso 5: Verificar Despliegue
```powershell
# Verificar propagación DNS
nslookup alcance-reducido.com

# Verificar CloudFront
aws cloudfront get-distribution --id E2ANIEKR516BL9 --query "Distribution.Status"

# Acceder al sitio
# https://alcance-reducido.com
```

---

## 📊 Información de Recursos AWS

### Route 53
- **Hosted Zone ID**: `Z00603941KQBVTNY6LOLY`
- **Domain**: `alcance-reducido.com`
- **Name Servers**: Ver `route53-nameservers.txt`

### CloudFront
- **Distribution ID**: `E2ANIEKR516BL9`
- **Domain Name**: `d116qh3ntei4la.cloudfront.net`
- **Status**: Deployed

### ACM (Certificate Manager)
- **Certificate ARN**: `arn:aws:acm:us-east-1:438758934896:certificate/444c9d61-0878-4d39-8067-9f27885ce8d5`
- **Region**: `us-east-1`
- **Status**: `PENDING_VALIDATION` → `ISSUED` (cuando esté listo)

### S3
- **Bucket**: `alcance-reducido-app`
- **OAC ID**: `E32MO9CLRFRSEA`

---

## 🐛 Troubleshooting

### Certificado no se valida
- Verificar que los registros CNAME de validación estén en Route 53
- Verificar que los Name Servers de Route 53 estén correctos
- Esperar más tiempo (puede tardar hasta 30 minutos)

### CloudFront no acepta el certificado
- Verificar que el certificado esté en región `us-east-1`
- Verificar que el certificado esté en estado `ISSUED`
- Verificar que los dominios del certificado coincidan con los aliases

### DNS no resuelve después de cambiar Name Servers
- Esperar más tiempo (puede tardar hasta 48 horas)
- Verificar que los Name Servers estén correctos
- Usar `nslookup` o herramientas online para verificar propagación

---

## 📞 Comandos Útiles

```powershell
# Verificar estado del certificado
aws acm describe-certificate --certificate-arn "arn:aws:acm:us-east-1:438758934896:certificate/444c9d61-0878-4d39-8067-9f27885ce8d5" --region us-east-1

# Verificar registros DNS en Route 53
aws route53 list-resource-record-sets --hosted-zone-id Z00603941KQBVTNY6LOLY

# Verificar estado de CloudFront
aws cloudfront get-distribution --id E2ANIEKR516BL9

# Verificar propagación DNS
nslookup alcance-reducido.com
```

---

**Última actualización**: 25 de Enero 2025, 13:57 UTC

