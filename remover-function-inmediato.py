import json
import subprocess
import sys

distribution_id = "E2ANIEKR516BL9"

print("Obteniendo configuracion de CloudFront...")
get_config_result = subprocess.run(
    ['aws', 'cloudfront', 'get-distribution-config', '--id', distribution_id, '--output', 'json'],
    capture_output=True,
    text=True
)

if get_config_result.returncode != 0:
    print(f"Error obteniendo configuracion: {get_config_result.stderr}")
    sys.exit(1)

config_data = json.loads(get_config_result.stdout)
etag = config_data['ETag']
config = config_data['DistributionConfig']

# Remover FunctionAssociations completamente
config['DefaultCacheBehavior']['FunctionAssociations'] = {
    'Quantity': 0,
    'Items': []
}

# Guardar configuración
config_file = "cloudfront-sin-function.json"
with open(config_file, 'w', encoding='utf-8') as f:
    json.dump(config, f, indent=2)

print("Removiendo funcion de CloudFront...")
update_result = subprocess.run(
    [
        'aws', 'cloudfront', 'update-distribution',
        '--id', distribution_id,
        '--if-match', etag,
        '--distribution-config', f'file://{config_file}',
        '--output', 'json'
    ],
    capture_output=True,
    text=True
)

if update_result.returncode != 0:
    print(f"Error: {update_result.stderr}")
    sys.exit(1)

print("OK: Funcion removida. El sitio deberia volver a funcionar en 5-10 minutos")

