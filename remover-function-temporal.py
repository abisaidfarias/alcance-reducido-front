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

# Remover FunctionAssociations
if 'FunctionAssociations' in config['DefaultCacheBehavior']:
    config['DefaultCacheBehavior']['FunctionAssociations'] = {
        'Quantity': 0,
        'Items': []
    }

# Guardar configuración actualizada
config_file = "cloudfront-sin-function.json"
with open(config_file, 'w', encoding='utf-8') as f:
    json.dump(config, f, indent=2)

print(f"Configuracion guardada en {config_file}")

# Actualizar CloudFront
print("\nRemoviendo funcion de CloudFront...")
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
    print(f"Error actualizando CloudFront: {update_result.stderr}")
    sys.exit(1)

update_data = json.loads(update_result.stdout)
new_etag = update_data['ETag']
status = update_data['Distribution']['Status']

print("OK: Funcion removida de CloudFront")
print(f"   Nuevo ETag: {new_etag}")
print(f"   Status: {status}")
print("\nEl sitio deberia volver a funcionar en 5-10 minutos")
print("Luego podemos corregir la funcion y volver a asociarla")

