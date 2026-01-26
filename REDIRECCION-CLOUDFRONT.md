# Redirección CloudFront Function

## Configuración Implementada

Se ha configurado una **CloudFront Function** para redirigir automáticamente:

- **Desde**: `https://alcance-reducido.com/fabricante/infinix`
- **Hacia**: `https://alcance-reducido.com/representante/luxuryspa`
- **Tipo**: Redirección 301 (Permanente)

## Detalles Técnicos

### CloudFront Function
- **Nombre**: `redirect-fabricante-infinix`
- **ARN**: `arn:aws:cloudfront::438758934896:function/redirect-fabricante-infinix`
- **Runtime**: `cloudfront-js-1.0`
- **Evento**: `viewer-request`
- **Estado**: `LIVE` (Publicada y asociada)

### Código de la Función
```javascript
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    if (uri === '/fabricante/infinix' || uri === '/fabricante/infinix/') {
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: {
                'location': { value: '/representante/luxuryspa' }
            }
        };
    }
    
    return request;
}
```

## Archivos Relacionados

- `cloudfront-function-redirect.js` - Código fuente de la función
- `actualizar-cloudfront-function.py` - Script para actualizar la función
- `asociar-function-cloudfront.py` - Script para asociar la función a CloudFront

## Cómo Actualizar

Si necesitas modificar la redirección:

1. Editar `cloudfront-function-redirect.js`
2. Ejecutar: `python actualizar-cloudfront-function.py`
3. La función se actualiza y publica automáticamente

## Verificación

Una vez que CloudFront se despliegue (5-15 minutos), verificar:

```bash
curl -I https://alcance-reducido.com/fabricante/infinix
```

Debe retornar:
- Status: `301 Moved Permanently`
- Header: `Location: /representante/luxuryspa`

## Notas

- La redirección se ejecuta **antes** de llegar a S3/Angular
- No requiere cambios en el código de la aplicación
- Es una solución escalable si se necesitan más redirecciones en el futuro
- Bajo costo: ~$0.10 por millón de requests

