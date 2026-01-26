# Solución: Problema de Caché DNS

## Problema
La aplicación funciona con VPN pero no sin VPN. Esto indica que hay un problema de caché DNS.

## Causa
- **Con VPN**: Usas servidores DNS del proveedor VPN que ya tienen los registros actualizados de Route 53
- **Sin VPN**: Usas servidores DNS locales (ISP o Windows) que aún tienen los registros antiguos en caché

## Soluciones

### Solución 1: Limpiar caché DNS de Windows (Rápido)
```powershell
# Ejecutar como Administrador
ipconfig /flushdns
```

### Solución 2: Cambiar DNS de Windows a Google DNS
1. Abrir "Configuración de red" → "Cambiar opciones del adaptador"
2. Clic derecho en tu conexión activa → "Propiedades"
3. Seleccionar "Protocolo de Internet versión 4 (TCP/IPv4)" → "Propiedades"
4. Seleccionar "Usar las siguientes direcciones de servidor DNS":
   - DNS preferido: `8.8.8.8` (Google)
   - DNS alternativo: `8.8.4.4` (Google)
5. Aplicar y reiniciar la conexión

### Solución 3: Verificar Name Servers en el registrador
Asegúrate de que los Name Servers en Namecheap apunten a Route 53:
- Deben ser los que Route 53 proporcionó (ns-xxx.awsdns-xx.com)

### Solución 4: Esperar propagación completa
La propagación DNS puede tardar hasta 48 horas en algunos casos, aunque normalmente es más rápida.

## Verificación
Después de limpiar el caché, verifica:
```powershell
nslookup alcance-reducido.com 8.8.8.8
```

Debe mostrar una IP de CloudFront (empieza con algo como `13.x.x.x` o `54.x.x.x`).

