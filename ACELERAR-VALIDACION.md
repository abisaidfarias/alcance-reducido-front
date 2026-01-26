# ⚡ Acelerar Validación del Certificado SSL

## ⏱️ ¿Por Qué Tarda?

La validación de certificados SSL en AWS ACM es **automática** y depende de:
1. Que AWS pueda acceder a los registros DNS de validación
2. Que los registros estén correctamente configurados
3. Que los Name Servers de Route 53 sean accesibles

**Tiempo normal**: 5-15 minutos  
**Puede tardar hasta**: 72 horas (muy raro)

---

## 🔍 Verificar Estado Actual

### Ver Estado Detallado
```powershell
aws acm describe-certificate --certificate-arn arn:aws:acm:us-east-1:438758934896:certificate/444c9d61-0878-4d39-8067-9f27885ce8d5 --region us-east-1 --query "Certificate.DomainValidationOptions" --output json
```

### Ver Solo el Estado
```powershell
.\verificar-certificado.ps1
```

---

## ⚠️ Problema Común: Name Servers No Actualizados

**El problema más común** es que los Name Servers de Route 53 **aún no están activos** en el dominio.

### ¿Qué Significa Esto?

- ✅ Creé la Hosted Zone en Route 53
- ✅ Creé los registros DNS en Route 53
- ❌ **PERO**: Los Name Servers de Route 53 aún NO están activos en tu dominio
- ❌ El dominio sigue usando los Name Servers de Namecheap
- ❌ AWS no puede ver los registros porque están en Route 53, pero el dominio apunta a Namecheap

### Solución: Actualizar Name Servers PRIMERO

**Para acelerar la validación**, necesitas cambiar los Name Servers en Namecheap **AHORA**:

1. **Ir a Namecheap**: https://www.namecheap.com/myaccount/login/
2. **Ir a Domain List** → Click en `alcance-reducido.com`
3. **Ir a "Advanced DNS"** o "Nameservers"
4. **Cambiar de "Namecheap BasicDNS" a "Custom DNS"**
5. **Ingresar estos 4 Name Servers**:
   ```
   ns-636.awsdns-15.net
   ns-2035.awsdns-62.co.uk
   ns-143.awsdns-17.com
   ns-1301.awsdns-34.org
   ```
6. **Guardar cambios**

**Una vez que cambies los Name Servers:**
- Los registros DNS de Route 53 serán accesibles
- AWS podrá verificar los registros de validación
- El certificado se validará en **5-15 minutos**

---

## 🚀 Otras Formas de Acelerar

### 1. Verificar que los Registros Estén Correctos
```powershell
# Verificar registro 1
nslookup -type=CNAME _6c8ff7deb3541d919b398b823fe77116.alcance-reducido.com

# Verificar registro 2
nslookup -type=CNAME _30ad283dc4200c325065412cad01659e.www.alcance-reducido.com
```

**Deben mostrar**: Los valores de `acm-validations.aws`

### 2. Verificar Propagación DNS
- Usar: https://dnschecker.org/
- Buscar: `_6c8ff7deb3541d919b398b823fe77116.alcance-reducido.com`
- Verificar que los registros sean visibles globalmente

### 3. Re-solicitar Validación (Si es necesario)
Si los registros están correctos pero aún no valida después de 1 hora:
- Puede ser necesario eliminar y crear un nuevo certificado
- O contactar soporte de AWS

---

## ⚡ Solución Rápida: Cambiar Name Servers AHORA

**La forma más rápida de acelerar** es cambiar los Name Servers **inmediatamente**:

### Pasos en Namecheap:

1. **Login**: https://www.namecheap.com/myaccount/login/
2. **Domain List** → `alcance-reducido.com`
3. **Nameservers** → Cambiar a "Custom DNS"
4. **Ingresar**:
   ```
   ns-636.awsdns-15.net
   ns-2035.awsdns-62.co.uk
   ns-143.awsdns-17.com
   ns-1301.awsdns-34.org
   ```
5. **Guardar**

### Después de Cambiar:

- ⏱️ **Propagación DNS**: 5-30 minutos
- ⏱️ **Validación certificado**: 5-15 minutos después de propagación
- ⏱️ **Total**: 10-45 minutos

---

## 🔍 Verificar si los Name Servers Están Activos

### Ver Name Servers Actuales del Dominio
```powershell
nslookup -type=NS alcance-reducido.com
```

**Si ves los de Namecheap** (`dns1.namecheaphosting.com`):
- ❌ Name Servers NO actualizados
- ❌ AWS no puede ver los registros
- ⚠️ Necesitas cambiarlos

**Si ves los de AWS** (`ns-636.awsdns-15.net`, etc.):
- ✅ Name Servers actualizados
- ✅ AWS puede ver los registros
- ⏳ Solo esperar validación

---

## 📊 Estado Actual

### Lo que YA está hecho:
- ✅ Hosted Zone creada en Route 53
- ✅ Registros de validación creados en Route 53
- ✅ Registros MX y TXT copiados

### Lo que FALTA:
- ❌ **Name Servers NO actualizados en Namecheap**
- ❌ Por eso AWS no puede ver los registros
- ❌ Por eso el certificado no se valida

---

## 🎯 Recomendación

**Para acelerar la validación, cambia los Name Servers AHORA:**

1. Los registros ya están en Route 53
2. El email ya está copiado (no lo perderás)
3. Solo falta activar Route 53 cambiando Name Servers
4. Una vez cambiados, la validación será rápida (5-15 min)

---

## ⚠️ Importante

**Después de cambiar Name Servers:**
- El sitio actual (`alcance-reducido.com`) dejará de funcionar temporalmente
- El email seguirá funcionando (ya copiamos los registros MX)
- Una vez que CloudFront esté configurado, el nuevo sitio funcionará

**Tiempo de inactividad estimado**: 15-30 minutos (mientras se propaga DNS)

---

**¿Quieres que te guíe paso a paso para cambiar los Name Servers en Namecheap?**

