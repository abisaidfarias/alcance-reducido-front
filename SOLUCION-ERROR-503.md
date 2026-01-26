# 🔧 Solución Error 503 - CloudFront Function

## Problema

Error 503: "The CloudFront function associated with the CloudFront distribution is invalid or could not run"

## Acción Tomada

✅ **Función removida temporalmente** de CloudFront para restaurar el sitio.

## Estado Actual

- **Función removida**: `redirect-fabricante-infinix` desasociada de CloudFront
- **CloudFront desplegando**: Status `Deployed`
- **Tiempo estimado**: 5-10 minutos para que el sitio vuelva a funcionar

## Próximos Pasos

Una vez que el sitio vuelva a funcionar, necesitamos:

1. **Corregir la CloudFront Function**
   - Verificar sintaxis del código
   - Asegurar que el formato sea correcto
   - Probar la función localmente si es posible

2. **Re-publicar la función**
   - Actualizar el código
   - Publicar en estado LIVE
   - Verificar que no haya errores

3. **Re-asociar a CloudFront**
   - Asociar solo cuando estemos seguros de que funciona
   - Monitorear después de asociar

## Posibles Causas del Error

1. **Sintaxis incorrecta** en el código JavaScript
2. **Formato incorrecto** del objeto de respuesta
3. **Problema con el evento** viewer-request
4. **Función no publicada correctamente**

## Alternativa Temporal

Si la función sigue dando problemas, podemos usar:

- **Lambda@Edge** (más complejo pero más robusto)
- **Modificar Angular** (agregar ruta de redirección en `app.routes.ts`)
- **Nginx/Apache** si tienes servidor propio

## Verificación

Para verificar que el sitio volvió a funcionar:

```bash
curl -I https://alcance-reducido.com
```

Debe retornar `200 OK` (no `503 ERROR`).

---

**Nota**: El sitio debería estar funcionando en 5-10 minutos sin la función. La redirección `/fabricante/infinix` no funcionará hasta que corrijamos y re-asociemos la función.

