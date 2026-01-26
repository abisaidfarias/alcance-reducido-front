# ⚠️ Verificar Name Servers en Namecheap

## 🔍 Problema Detectado

El DNS aún muestra los Name Servers de Namecheap en lugar de los de Route 53. Esto significa que:

1. **Los Name Servers NO se guardaron correctamente en Namecheap**, O
2. **La propagación DNS aún no se completó** (puede tardar hasta 48 horas)

---

## ✅ Verificar en Namecheap

### Paso 1: Ir a Namecheap
1. Login: https://www.namecheap.com/myaccount/login/
2. **Domain List** → Click en `alcance-reducido.com`
3. Ir a la pestaña **"Nameservers"** o **"Advanced DNS"**

### Paso 2: Verificar Name Servers Actuales

**Debes ver estos 4 Name Servers de AWS:**
```
ns-636.awsdns-15.net
ns-2035.awsdns-62.co.uk
ns-143.awsdns-17.com
ns-1301.awsdns-34.org
```

**Si ves los de Namecheap** (`dns1.namecheaphosting.com`, `dns2.namecheaphosting.com`):
- ❌ Los Name Servers NO se guardaron
- ⚠️ Necesitas cambiarlos de nuevo

---

## 🔧 Si los Name Servers NO Están Correctos

### Opción 1: Desde "Nameservers"
1. En la pestaña **"Nameservers"**
2. Cambiar de **"Namecheap BasicDNS"** a **"Custom DNS"**
3. Ingresar los 4 Name Servers de AWS
4. **Guardar** y confirmar

### Opción 2: Desde "Advanced DNS"
1. En **"Advanced DNS"**
2. Buscar sección **"PERSONAL DNS SERVER"**
3. O buscar link **"Change DNS Type"** en **"HOST RECORDS"**
4. Cambiar a **"Custom DNS"**
5. Ingresar los 4 Name Servers
6. **Guardar**

---

## 📋 Name Servers de Route 53 (Copia estos)

```
ns-636.awsdns-15.net
ns-2035.awsdns-62.co.uk
ns-143.awsdns-17.com
ns-1301.awsdns-34.org
```

---

## ⏱️ Después de Cambiar

1. **Esperar 5-30 minutos** para propagación
2. **Verificar**:
   ```powershell
   nslookup -type=NS alcance-reducido.com
   ```
3. **Debe mostrar** los 4 Name Servers de AWS

---

## 🎯 Solución Temporal

**Mientras se propaga el DNS:**

Accede directamente a CloudFront:
- **URL**: `https://d116qh3ntei4la.cloudfront.net`
- Esto muestra el sitio nuevo inmediatamente
- No depende de la propagación DNS

---

## 🔍 Verificar Propagación

### Desde tu computadora:
```powershell
# Limpiar cache DNS
ipconfig /flushdns

# Verificar Name Servers
nslookup -type=NS alcance-reducido.com

# Verificar resolución
nslookup alcance-reducido.com
```

### Desde herramientas online:
- https://dnschecker.org/#NS/alcance-reducido.com
- Verifica si los Name Servers de AWS ya se ven en otras ubicaciones

---

## ⚠️ Importante

**Si los Name Servers están correctos en Namecheap pero aún no se propagan:**

- ⏳ Es normal, puede tardar **hasta 48 horas**
- 🌍 La propagación es gradual por ubicación geográfica
- 💾 Puede haber cache DNS en diferentes niveles

**Mientras tanto, usa**: `https://d116qh3ntei4la.cloudfront.net`

---

**Verifica primero en Namecheap si los Name Servers están guardados correctamente.**

