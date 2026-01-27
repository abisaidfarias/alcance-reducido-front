# Alcance Reducido Front

Aplicación Angular para gestión de alcance reducido.

## 🚀 Deployment

### Deployment Rápido
```powershell
.\deploy-simple.ps1
```

### Comandos Manuales
```powershell
# 1. Build
npm run build

# 2. Subir archivos estáticos (JS, CSS, imágenes)
aws s3 sync dist\alcance-reducido-front\browser\ s3://alcance-reducido-app/ `
    --delete `
    --cache-control "public, max-age=31536000" `
    --exclude "*.html" `
    --exclude "*.json"

# 3. Subir HTML y JSON (sin cache)
aws s3 sync dist\alcance-reducido-front\browser\ s3://alcance-reducido-app/ `
    --delete `
    --cache-control "no-cache, no-store, must-revalidate" `
    --exclude "*" `
    --include "*.html" `
    --include "*.json"

# 4. Invalidar caché
aws cloudfront create-invalidation --distribution-id E2ANIEKR516BL9 --paths "/*"
```

### Configuración AWS

- **Bucket S3:** `alcance-reducido-app`
- **CloudFront ID:** `E2ANIEKR516BL9`
- **OAC ID:** `E32MO9CLRFRSEA`
- **DefaultRootObject:** `index.html`
- **CustomErrorResponses:** 403/404 → `/index.html` (200)

### Configuración Angular

- **baseHref:** `/` (NUNCA cambiar a `/browser/`)
- **Archivos:** Se suben desde `dist/alcance-reducido-front/browser/` a la **raíz** del bucket
- **Optimización:** Activada en producción

## 🔍 Problemas Encontrados y Soluciones

### Problema 1: Access Denied (403)
**Síntoma:** Error XML "Access Denied" al acceder al sitio  
**Causa:** Bucket tenía política pública en lugar de OAC  
**Solución:** Aplicar política OAC (`bucket-policy-oac.json`) y activar bloqueo de acceso público

### Problema 2: MIME type errors (JS como HTML)
**Síntoma:** Página en blanco, errores "Expected JavaScript but got text/html"  
**Causa:** CustomErrorResponses redirigían TODAS las peticiones (incluidos archivos JS) a `index.html`  
**Solución:** Eliminar CustomErrorResponses problemáticas, luego agregarlas correctamente (solo para rutas, no archivos estáticos)

### Problema 3: Archivos no encontrados en `/browser/`
**Síntoma:** Errores 403 para archivos en `/browser/chunk-*.js`  
**Causa:** `index.html` tenía `<base href="/browser/">` y archivos estaban en raíz  
**Solución:** Cambiar `baseHref` a `"/"` y subir archivos desde `browser/` a la raíz del bucket

### Problema 4: Rutas Angular no funcionan (403 en URLs directas)
**Síntoma:** Acceder a `/representante/luxuryspa` devuelve 403  
**Causa:** CloudFront no encuentra el archivo y no hay redirección a `index.html`  
**Solución:** Agregar CustomErrorResponses: 403/404 → `/index.html` (200)

## 🛠️ Desarrollo

```bash
# Servidor de desarrollo
ng serve

# Build
ng build

# Tests
ng test
```

## ⚙️ Notas Importantes

- **NUNCA** cambiar `baseHref` a `/browser/`
- **SIEMPRE** subir archivos desde `browser/` a la raíz del bucket
- **CustomErrorResponses** son necesarias para rutas de Angular (403/404 → `/index.html`)
- **NO usar CloudFront Functions** - se resuelve con CustomErrorResponses
- Esperar 5-15 minutos después del deployment para propagación

## 🔧 Scripts Útiles

- `deploy-simple.ps1` - Deployment principal
- `agregar-custom-error-responses.py` - Agregar CustomErrorResponses si se pierden
- `verificar-configuracion.py` - Verificar configuración de AWS
