# Solución Alternativa para Redirección

## Problema
Las CloudFront Functions están causando errores 503 cuando se asocian a la distribución.

## Opciones de Solución

### Opción 1: Usar Lambda@Edge (Recomendado)
Lambda@Edge es más robusto que CloudFront Functions para redirecciones complejas.

**Ventajas:**
- Más confiable
- Mejor manejo de errores
- Más flexible

**Desventajas:**
- Más complejo de configurar
- Requiere crear una función Lambda
- Costo ligeramente mayor

### Opción 2: Redirección en Angular (Más Simple)
Agregar la redirección directamente en `app.routes.ts`.

**Ventajas:**
- Muy simple
- No requiere configuración en AWS
- Funciona inmediatamente

**Desventajas:**
- Requiere modificar código (aunque es mínimo)
- La redirección es 302 (temporal) en lugar de 301 (permanente)

### Opción 3: Usar S3 Website Redirect
Configurar una regla de redirección en S3 para esa ruta específica.

**Ventajas:**
- No requiere código
- Redirección 301 nativa

**Desventajas:**
- Requiere cambiar la configuración de S3
- Puede ser más complejo de mantener

## Recomendación
Dado que las CloudFront Functions están causando problemas, recomiendo **Opción 2** (redirección en Angular) como la solución más rápida y confiable.

Si necesitas una redirección 301 estricta a nivel de servidor, entonces **Opción 1** (Lambda@Edge) sería la mejor opción.

