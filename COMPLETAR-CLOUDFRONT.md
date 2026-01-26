# ✅ Completar Configuración de CloudFront

## Estado Actual

El certificado SSL está en proceso de validación. Una vez que esté validado (puede tardar 5-15 minutos), ejecuta el siguiente comando para completar la configuración de CloudFront.

## Comando para Ejecutar

```powershell
# 1. Verificar que el certificado esté validado
aws acm describe-certificate --certificate-arn "arn:aws:acm:us-east-1:438758934896:certificate/444c9d61-0878-4d39-8067-9f27885ce8d5" --region us-east-1 --query "Certificate.Status" --output text

# Debe mostrar: ISSUED

# 2. Obtener nuevo ETag (puede haber cambiado)
python update-cloudfront.py

# 3. Actualizar CloudFront con el nuevo ETag
aws cloudfront update-distribution --id E2ANIEKR516BL9 --if-match [NUEVO_ETAG] --distribution-config file://cloudfront-update.json
```

## O Ejecutar el Script Automatizado

```powershell
.\completar-cloudfront.ps1
```

## Información Importante

- **Distribution ID**: E2ANIEKR516BL9
- **Certificado ARN**: arn:aws:acm:us-east-1:438758934896:certificate/444c9d61-0878-4d39-8067-9f27885ce8d5
- **Aliases configurados**: alcance-reducido.com, www.alcance-reducido.com
- **Región del certificado**: us-east-1 (requerido para CloudFront)

## Verificación de Registros DNS de Validación

Los registros CNAME de validación ya están creados en Route 53:
- `_6c8ff7deb3541d919b398b823fe77116.alcance-reducido.com`
- `_30ad283dc4200c325065412cad01659e.www.alcance-reducido.com`

Si el certificado tarda más de 15 minutos en validarse, verifica que estos registros estén correctos en Route 53.

