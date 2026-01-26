# Solución Completa: Problema DNS con VPN

## Diagnóstico
- ✅ Name Servers correctos (Route 53)
- ✅ IP de CloudFront resuelta: `3.164.255.104`
- ⚠️ Router local (192.168.1.254) tiene caché DNS antiguo

## Soluciones (en orden de preferencia)

### Solución 1: Cambiar DNS de Windows (RECOMENDADO)
Forzar a Windows a usar DNS públicos en lugar del router:

1. **Abrir Configuración de Red:**
   - Presiona `Win + R`
   - Escribe: `ncpa.cpl` y Enter

2. **Seleccionar tu conexión activa:**
   - Clic derecho → "Propiedades"

3. **Configurar DNS:**
   - Seleccionar "Protocolo de Internet versión 4 (TCP/IPv4)"
   - Clic en "Propiedades"
   - Seleccionar "Usar las siguientes direcciones de servidor DNS"
   - **DNS preferido:** `8.8.8.8` (Google)
   - **DNS alternativo:** `1.1.1.1` (Cloudflare)
   - Aceptar y cerrar

4. **Limpiar caché nuevamente:**
   ```powershell
   ipconfig /flushdns
   ```

### Solución 2: Reiniciar Router
Si no puedes cambiar DNS en Windows, reinicia tu router para limpiar su caché DNS.

### Solución 3: Esperar Propagación
El caché DNS del router se actualizará automáticamente en 1-24 horas.

## Verificación
Después de cambiar DNS, verifica:
```powershell
nslookup alcance-reducido.com 8.8.8.8
```

Debe mostrar: `3.164.255.104` o similar (IP de CloudFront).

## Por qué funciona con VPN
- VPN usa sus propios servidores DNS (ya actualizados)
- Sin VPN, Windows usa el DNS del router (caché antiguo)

