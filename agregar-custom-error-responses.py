# -*- coding: utf-8 -*-
import json
import subprocess
import sys
import os

# Configurar encoding para Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

DISTRIBUTION_ID = "E2ANIEKR516BL9"

print("Agregando CustomErrorResponses para SPA routing...")
print("=" * 60)

# Obtener configuración actual
print("\n[1] Obteniendo configuracion de CloudFront...")
result = subprocess.run(
    ['aws', 'cloudfront', 'get-distribution-config', '--id', DISTRIBUTION_ID, '--output', 'json'],
    capture_output=True,
    text=True
)

if result.returncode != 0:
    print(f"[ERROR] Error obteniendo configuracion: {result.stderr}")
    sys.exit(1)

data = json.loads(result.stdout)
etag = data['ETag']
config = data['DistributionConfig']

print(f"[OK] ETag obtenido: {etag}")

# Agregar CustomErrorResponses para 403 y 404
print("\n[2] Agregando CustomErrorResponses...")
config['CustomErrorResponses'] = {
    'Quantity': 2,
    'Items': [
        {
            'ErrorCode': 403,
            'ResponsePagePath': '/index.html',
            'ResponseCode': '200',
            'ErrorCachingMinTTL': 300
        },
        {
            'ErrorCode': 404,
            'ResponsePagePath': '/index.html',
            'ResponseCode': '200',
            'ErrorCachingMinTTL': 300
        }
    ]
}

print("[OK] CustomErrorResponses configuradas:")
print("  - 403 -> /index.html (200)")
print("  - 404 -> /index.html (200)")

# Guardar configuración
config_file = 'cloudfront-with-error-responses.json'
with open(config_file, 'w', encoding='utf-8') as f:
    json.dump(config, f, indent=2)

print(f"\n[OK] Configuracion guardada en {config_file}")

# Aplicar cambios
print("\n[3] Aplicando cambios a CloudFront...")
print("   Esto puede tardar 5-15 minutos...")

update_result = subprocess.run(
    [
        'aws', 'cloudfront', 'update-distribution',
        '--id', DISTRIBUTION_ID,
        '--if-match', etag,
        '--distribution-config', f'file://{config_file}',
        '--output', 'json'
    ],
    capture_output=True,
    text=True
)

if update_result.returncode == 0:
    print("\n" + "=" * 60)
    print("[OK] CloudFront actualizado correctamente!")
    print("\nCustomErrorResponses agregadas:")
    print("  - Cuando CloudFront reciba 403 o 404, servira index.html")
    print("  - Angular manejara el routing desde ahi")
    print("\nEspera 5-15 minutos para que los cambios se desplieguen.")
    print("Luego prueba: https://alcance-reducido.com/representante/luxuryspa")
else:
    print(f"[ERROR] Error al actualizar CloudFront:")
    print(update_result.stderr)
    sys.exit(1)

