# 📊 Estado Actual del Despliegue en AWS - Opción B

**Fecha de revisión**: 25 de Enero 2025  
**Objetivo**: Reemplazar `alcance-reducido.com` completamente con la aplicación Angular

---

## ✅ Lo que YA está configurado

### 1. Amazon S3
- ✅ **Bucket creado**: `alcance-reducido-app`
- ✅ **Archivos subidos**: Los archivos están en S3 (carpeta `browser/`)
- ✅ **Políticas creadas**:
  - `bucket-policy.json` (acceso público)
  - `bucket-policy-oac.json` (acceso desde CloudFront con OAC)
- ✅ **OAC ID**: `E32MO9CLRFRSEA`
- ✅ **Política OAC aplicada**: Sí (incluye Distribution ID: `E2ANIEKR516BL9`)

### 2. CloudFront
- ✅ **Distribución creada**: ID `E2ANIEKR516BL9`
- ✅ **Estado**: `Deployed` (activa y funcionando)
- ✅ **Domain Name**: `d116qh3ntei4la.cloudfront.net`
- ✅ **Origin**: `alcance-reducido-app.s3.us-east-1.amazonaws.com`
- ✅ **DefaultRootObject**: `browser/index.html` (correcto según estructura)
- ✅ **Custom Error Responses**: Configurados (403 y 404 → `/browser/index.html`)
- ✅ **HTTPS**: Redirección HTTP a HTTPS habilitada
- ✅ **OAC configurado**: `E32MO9CLRFRSEA`

### 3. Archivos de Configuración
- ✅ `bucket-policy.json` - Política de acceso público
- ✅ `bucket-policy-oac.json` - Política con OAC para CloudFront
- ✅ `cloudfront-config.json` - Configuración de CloudFront
- ✅ `deploy.sh` - Script de despliegue automatizado

### 4. Build
- ✅ **Estructura correcta**: Los archivos están en `dist/alcance-reducido-front/browser/`
- ✅ **Archivos presentes**: index.html, chunks, assets, etc.

---

## ❌ Lo que FALTA para completar Opción B

### 1. Route 53 (DNS)
- ❌ **Hosted Zone NO creada** para `alcance-reducido.com`
- ❌ **Name Servers NO actualizados** en el registrador
- ❌ **Registro A NO creado** para dominio raíz (`@`)
- ❌ **Registro A NO creado** para `www` (opcional)

### 2. CloudFront - Dominio Personalizado
- ❌ **Aliases NO configurados**: CloudFront no tiene dominio personalizado
- ❌ **CNAME NO agregado**: `alcance-reducido.com` no está en la lista de aliases

### 3. AWS Certificate Manager (SSL)
- ❌ **Certificado SSL NO solicitado** para `alcance-reducido.com`
- ❌ **Certificado NO asociado** a CloudFront

### 4. Configuración de la Aplicación
- ⚠️ **environment.prod.ts**: Tiene `app.alcance-reducido.com` pero debería ser `alcance-reducido.com`

### 5. Registros DNS Existentes
- ⚠️ **NO se han copiado** los registros DNS actuales (MX, TXT, CNAME, etc.)
- ⚠️ **Riesgo**: Si no se copian, se perderán servicios como email

---

## 🔍 Detalles Técnicos Actuales

### CloudFront Distribution
```json
{
  "Id": "E2ANIEKR516BL9",
  "Status": "Deployed",
  "DomainName": "d116qh3ntei4la.cloudfront.net",
  "DefaultRootObject": "browser/index.html",
  "Aliases": null  // ← FALTA configurar
}
```

### S3 Bucket
```
Bucket: alcance-reducido-app
Estructura: browser/
  - index.html
  - chunks/
  - assets/
```

### OAC (Origin Access Control)
```
ID: E32MO9CLRFRSEA
Distribution: E2ANIEKR516BL9
Política aplicada: ✅
```

---

## 📋 Plan de Acción - Pasos Pendientes

### Paso 1: Copiar Registros DNS Existentes
**⚠️ CRÍTICO - Hacer PRIMERO**

1. Acceder al panel DNS actual del registrador
2. Copiar TODOS los registros:
   - MX (email)
   - TXT (SPF, DKIM, verificaciones)
   - CNAME (subdominios)
   - A (otros servicios)
3. Documentar todos los registros antes de continuar

### Paso 2: Crear Hosted Zone en Route 53
```bash
aws route53 create-hosted-zone \
  --name alcance-reducido.com \
  --caller-reference alcance-reducido-$(date +%s)
```

**Guardar los 4 Name Servers que Route 53 devuelva**

### Paso 3: Crear Registros DNS en Route 53

#### 3.1. Copiar registros existentes
- Crear todos los registros MX, TXT, CNAME que copiaste en el Paso 1

#### 3.2. Crear registro A para dominio raíz
```bash
# Obtener Hosted Zone ID primero
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones \
  --query "HostedZones[?Name=='alcance-reducido.com.'].Id" \
  --output text | cut -d'/' -f3)

# Crear registro A para dominio raíz
aws route53 change-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --change-batch file://route53-record-a.json
```

#### 3.3. Crear registro A para www (opcional)
Similar al anterior pero con nombre `www`

### Paso 4: Solicitar Certificado SSL en ACM
**⚠️ IMPORTANTE: Debe ser en región us-east-1 (requerido para CloudFront)**

1. Ir a AWS Certificate Manager (ACM)
2. Seleccionar región: **us-east-1** (N. Virginia)
3. Solicitar certificado público
4. Dominios:
   - `alcance-reducido.com`
   - `www.alcance-reducido.com`
5. Método de validación: DNS
6. Validar usando los registros DNS que Route 53 crea automáticamente

### Paso 5: Configurar Dominio Personalizado en CloudFront

1. Ir a CloudFront → Distribution `E2ANIEKR516BL9`
2. Edit → General settings
3. **Alternate domain names (CNAMEs)**:
   - Agregar: `alcance-reducido.com`
   - Agregar: `www.alcance-reducido.com`
4. **Custom SSL certificate**:
   - Seleccionar el certificado creado en Paso 4
5. Guardar cambios

### Paso 6: Actualizar Name Servers en Registrador

1. Copiar los 4 Name Servers de Route 53
2. Ir al panel del registrador
3. Cambiar Name Servers a los de Route 53
4. Guardar cambios

**⚠️ IMPORTANTE**: 
- El sitio actual dejará de funcionar cuando se propague el DNS
- La propagación puede tardar 15 minutos a 48 horas

### Paso 7: Actualizar environment.prod.ts

Cambiar:
```typescript
appUrl: 'https://app.alcance-reducido.com'
```

A:
```typescript
appUrl: 'https://alcance-reducido.com'
```

### Paso 8: Verificar y Probar

1. Esperar propagación DNS (verificar con `nslookup alcance-reducido.com`)
2. Acceder a `https://alcance-reducido.com`
3. Verificar que la aplicación carga correctamente
4. Probar login y funcionalidades
5. Verificar que el email sigue funcionando (si aplica)

---

## 🐛 Problemas Conocidos / Errores Previos

### Error en cloudfront-config.json
El archivo tiene `DefaultRootObject: "browser/index.html"` que es **CORRECTO** según la estructura actual del build de Angular.

### Estructura del Build
Angular 18 genera los archivos en `dist/alcance-reducido-front/browser/`, por lo que:
- ✅ `DefaultRootObject: "browser/index.html"` es correcto
- ✅ `CustomErrorResponses: "/browser/index.html"` es correcto

---

## 📝 Archivos Necesarios que Faltan

### route53-record-a.json
```json
{
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "alcance-reducido.com",
        "Type": "A",
        "AliasTarget": {
          "DNSName": "d116qh3ntei4la.cloudfront.net",
          "EvaluateTargetHealth": false,
          "HostedZoneId": "Z2FDTNDATAQYW2"
        }
      }
    }
  ]
}
```

**Nota**: `Z2FDTNDATAQYW2` es el Hosted Zone ID fijo de CloudFront (no cambiar)

---

## ⚠️ Advertencias Importantes

1. **Backup del sitio actual**: Asegúrate de tener backup antes de cambiar DNS
2. **Email**: Si usas email con el dominio, copia los registros MX antes de cambiar Name Servers
3. **Propagación DNS**: El sitio actual dejará de funcionar cuando se propague el DNS (15 min - 48 horas)
4. **Horario**: Hacer el cambio en horario de bajo tráfico
5. **Certificado SSL**: Debe estar en región `us-east-1` para CloudFront

---

## ✅ Checklist de Completitud

### Infraestructura AWS
- [x] Bucket S3 creado
- [x] Archivos subidos a S3
- [x] CloudFront Distribution creada
- [x] OAC configurado
- [x] Custom Error Responses configurados
- [ ] Route 53 Hosted Zone creada
- [ ] Registros DNS copiados
- [ ] Registro A para dominio raíz creado
- [ ] Certificado SSL solicitado y validado
- [ ] Dominio personalizado en CloudFront
- [ ] Name Servers actualizados en registrador

### Configuración de Aplicación
- [ ] environment.prod.ts actualizado
- [ ] CORS configurado en API para nuevo dominio

### Verificación
- [ ] DNS propagado
- [ ] Sitio accesible en `https://alcance-reducido.com`
- [ ] Email funcionando (si aplica)
- [ ] Login y funcionalidades probadas

---

## 🆘 Si algo sale mal

### Revertir cambios
1. Cambiar Name Servers de vuelta a los originales en el registrador
2. Esperar propagación DNS
3. El sitio original debería volver a funcionar

### Verificar estado
```bash
# Verificar distribución CloudFront
aws cloudfront get-distribution --id E2ANIEKR516BL9

# Verificar Hosted Zone
aws route53 list-hosted-zones

# Verificar registros DNS
aws route53 list-resource-record-sets --hosted-zone-id Z1234567890

# Verificar certificados SSL
aws acm list-certificates --region us-east-1
```

---

## 📞 Información de Contacto / Referencias

- **CloudFront Distribution ID**: `E2ANIEKR516BL9`
- **CloudFront Domain**: `d116qh3ntei4la.cloudfront.net`
- **S3 Bucket**: `alcance-reducido-app`
- **OAC ID**: `E32MO9CLRFRSEA`
- **API URL**: `https://alcancereducido-prod.eba-bynjpc2g.us-east-1.elasticbeanstalk.com/api`

---

**Última actualización**: 25 de Enero 2025

