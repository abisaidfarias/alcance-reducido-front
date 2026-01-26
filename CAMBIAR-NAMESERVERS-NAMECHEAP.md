# 🔧 Cambiar Name Servers en Namecheap - Guía Paso a Paso

## 📍 Ubicación Actual
Estás en: **Advanced DNS** → Sección **"PERSONAL DNS SERVER"**

---

## 🎯 Pasos para Cambiar Name Servers

### Paso 1: Buscar la Sección de Name Servers
En la sección **"PERSONAL DNS SERVER"** que estás viendo:

1. **Busca el dropdown que dice "Standard Nameservers"**
2. **O busca un botón/link que diga "Custom DNS" o "Change Nameservers"**

### Paso 2: Cambiar a Custom DNS
- Si hay un dropdown, cámbialo a **"Custom DNS"** o **"Personal Nameservers"**
- O busca un link/opción que permita cambiar los Name Servers

### Paso 3: Ingresar los Name Servers de Route 53
Ingresa estos **4 Name Servers** (uno por línea o en campos separados):

```
ns-636.awsdns-15.net
ns-2035.awsdns-62.co.uk
ns-143.awsdns-17.com
ns-1301.awsdns-34.org
```

### Paso 4: Guardar
- Click en **"Save"** o **"Apply"** o el botón de guardar
- Confirma los cambios si te lo pide

---

## 🔍 Si No Ves la Opción Directa

### Alternativa: Buscar en Otra Sección
1. **Ve a la pestaña "Domain"** (al lado de "Advanced DNS")
2. Busca una sección de **"Nameservers"** o **"DNS"**
3. Debería haber una opción para cambiar de "Namecheap BasicDNS" a "Custom DNS"

### O Buscar "Change DNS Type"
En la sección **"HOST RECORDS"** que ves arriba, hay un link rojo que dice:
- **"Change DNS Type"** ← Click ahí
- Esto te permitirá cambiar a Custom DNS

---

## ⚠️ Importante

**Después de cambiar:**
- ⏱️ Los cambios pueden tardar 5-30 minutos en propagarse
- ⏱️ El certificado SSL se validará automáticamente después (5-15 min)
- ⚠️ El sitio actual dejará de funcionar temporalmente
- ✅ El email seguirá funcionando (ya copiamos los registros MX)

---

## 📋 Name Servers de Route 53 (Copia estos)

```
ns-636.awsdns-15.net
ns-2035.awsdns-62.co.uk
ns-143.awsdns-17.com
ns-1301.awsdns-34.org
```

---

## ✅ Verificación Después de Cambiar

Después de guardar, puedes verificar con:

```powershell
nslookup -type=NS alcance-reducido.com
```

**Debe mostrar** los 4 Name Servers de AWS (ns-636.awsdns-15.net, etc.)

---

**¿Puedes ver la opción para cambiar a "Custom DNS" o ingresar Name Servers personalizados?**

