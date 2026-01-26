# 🔐 Cómo Ver el Certificado SSL en AWS

## 📍 Ubicación en AWS Console

### Opción 1: AWS Certificate Manager (ACM)
1. **Acceder a AWS Console**: https://console.aws.amazon.com
2. **Buscar "Certificate Manager"** en la barra de búsqueda superior
3. **O ir directamente a**: https://console.aws.amazon.com/acm/home
4. **⚠️ IMPORTANTE**: Asegúrate de estar en la región **us-east-1 (N. Virginia)**
   - Verifica la región en la esquina superior derecha
   - Si no estás en us-east-1, cámbiala usando el selector de región

### Opción 2: Desde el Menú de Servicios
1. Click en **"Services"** (Servicios) en la parte superior
2. Buscar **"Certificate Manager"** o **"ACM"**
3. Click en **"Certificate Manager"**

---

## 🔍 Ver el Certificado Específico

### Por ARN (Recomendado)
1. En la página de Certificate Manager
2. Buscar el certificado con este ARN:
   ```
   arn:aws:acm:us-east-1:438758934896:certificate/444c9d61-0878-4d39-8067-9f27885ce8d5
   ```
3. O buscar por dominio: `alcance-reducido.com`

### Información que Verás
- **Status**: Estado del certificado
  - `PENDING_VALIDATION` = En proceso de validación
  - `ISSUED` = ✅ Validado y activo
  - `VALIDATION_TIMED_OUT` = Error en validación
  - `FAILED` = Falló la validación
- **Domain name**: `alcance-reducido.com`
- **Subject alternative names**: `www.alcance-reducido.com`
- **Validation method**: DNS
- **In-use by**: (vacío hasta que se asocie a CloudFront)

---

## ✅ Cómo Saber Cuándo Está Activo

### Estado: ISSUED = ✅ Activo
Cuando el certificado muestre **Status: ISSUED**, significa que:
- ✅ Está completamente validado
- ✅ Listo para usar
- ✅ Puedes asociarlo a CloudFront

### Verificar Estado
1. En la lista de certificados, busca el de `alcance-reducido.com`
2. Mira la columna **"Status"**
3. Si dice **"ISSUED"** (verde), está listo

---

## 🔄 Actualizar la Página
- El estado se actualiza automáticamente, pero puedes refrescar la página (F5)
- La validación normalmente tarda **5-15 minutos**

---

## 📊 Detalles del Certificado

Al hacer click en el certificado, verás:

### Pestaña "Details" (Detalles)
- **Certificate ARN**: El identificador único
- **Status**: Estado actual
- **Domain name**: Dominio principal
- **Subject alternative names**: Dominios adicionales
- **Validation method**: Método de validación (DNS)
- **Key algorithm**: Algoritmo de clave
- **Created on**: Fecha de creación
- **Issued on**: Fecha de emisión (cuando esté validado)

### Pestaña "Domain validation" (Validación de dominio)
- Muestra el estado de validación de cada dominio
- **Validation status**: 
  - `Pending validation` = Esperando validación
  - `Success` = ✅ Validado
- **Validation records**: Los registros CNAME que se crearon en Route 53

---

## 🎯 Qué Hacer Cuando Esté ISSUED

Una vez que el certificado muestre **Status: ISSUED**:

1. **Ejecutar el script automatizado**:
   ```powershell
   .\completar-cloudfront.ps1
   ```

2. **O manualmente desde AWS Console**:
   - Ir a CloudFront
   - Seleccionar la distribución `E2ANIEKR516BL9`
   - Edit → General settings
   - Agregar aliases: `alcance-reducido.com`, `www.alcance-reducido.com`
   - Seleccionar el certificado SSL
   - Guardar cambios

---

## 🔍 Verificar desde la Línea de Comandos

### Ver Estado del Certificado
```powershell
aws acm describe-certificate `
  --certificate-arn "arn:aws:acm:us-east-1:438758934896:certificate/444c9d61-0878-4d39-8067-9f27885ce8d5" `
  --region us-east-1 `
  --query "Certificate.Status" `
  --output text
```

**Resultado esperado**:
- `PENDING_VALIDATION` = Aún en validación
- `ISSUED` = ✅ Listo para usar

### Ver Todos los Detalles
```powershell
aws acm describe-certificate `
  --certificate-arn "arn:aws:acm:us-east-1:438758934896:certificate/444c9d61-0878-4d39-8067-9f27885ce8d5" `
  --region us-east-1 `
  --output json
```

### Ver Solo el Estado (Formato Simple)
```powershell
aws acm list-certificates `
  --region us-east-1 `
  --query "CertificateSummaryList[?DomainName=='alcance-reducido.com'].{Domain:DomainName,Status:Status}" `
  --output table
```

---

## ⏱️ Tiempo de Validación

- **Tiempo normal**: 5-15 minutos
- **Máximo**: Hasta 72 horas (raro)
- **Si tarda más de 30 minutos**: Verificar que los registros DNS de validación estén correctos en Route 53

---

## 🐛 Troubleshooting

### Certificado no se valida después de 30 minutos
1. Verificar que los registros CNAME de validación estén en Route 53
2. Verificar que los Name Servers de Route 53 sean correctos
3. Verificar que no haya errores en la pestaña "Domain validation"

### No encuentro el certificado
- Verificar que estés en la región **us-east-1**
- Buscar por el dominio: `alcance-reducido.com`
- O buscar por el ARN completo

### El certificado muestra "VALIDATION_TIMED_OUT"
- Los registros DNS de validación no se encontraron
- Verificar que los registros CNAME estén en Route 53
- Puede ser necesario solicitar un nuevo certificado

---

## 📝 Información del Certificado Actual

- **ARN**: `arn:aws:acm:us-east-1:438758934896:certificate/444c9d61-0878-4d39-8067-9f27885ce8d5`
- **Dominios**: 
  - `alcance-reducido.com`
  - `www.alcance-reducido.com`
- **Región**: `us-east-1` (N. Virginia)
- **Método de validación**: DNS
- **Estado actual**: `PENDING_VALIDATION`

---

## 🔗 Enlaces Directos

- **ACM Console (us-east-1)**: https://console.aws.amazon.com/acm/home?region=us-east-1
- **CloudFront Console**: https://console.aws.amazon.com/cloudfront/v3/home
- **Route 53 Console**: https://console.aws.amazon.com/route53/v2/home

---

**Última actualización**: 25 de Enero 2025

