# Propagación DNS Automática

## ¿Se actualizará automáticamente?

**SÍ**, el caché DNS se actualizará automáticamente cuando expire el TTL (Time To Live).

## ¿Cuánto tiempo tarda?

### TTL (Time To Live)
- Cada registro DNS tiene un TTL que indica cuánto tiempo se puede cachear
- Cuando el TTL expira, el servidor DNS debe consultar los Name Servers autoritativos nuevamente

### Tiempos típicos:
- **Route 53**: TTL por defecto suele ser 300 segundos (5 minutos) o 60 segundos
- **Router local**: Puede cachear hasta 24-48 horas dependiendo del modelo
- **ISP**: Puede cachear 1-24 horas

## ¿Qué pasa si no haces nada?

1. **Tu router** consultará los Name Servers de Route 53 cuando expire su caché
2. **Obtendrá los registros actualizados** automáticamente
3. **El sitio funcionará correctamente** sin VPN

## Tiempo estimado

- **Mínimo**: 5 minutos (si el router respeta TTL cortos)
- **Típico**: 1-6 horas
- **Máximo**: 24-48 horas (raro, solo si el router ignora TTL)

## Recomendación

Si no tienes prisa, **puedes esperar**. El problema se resolverá solo.

Si necesitas que funcione **ahora mismo**, cambia los DNS de Windows a `8.8.8.8` (Google DNS).

## Verificación

Puedes verificar si ya se actualizó:
```powershell
nslookup alcance-reducido.com 8.8.8.8
```

Si muestra una IP de CloudFront (como `3.164.255.104`), ya está actualizado.

