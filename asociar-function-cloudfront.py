import json
import subprocess
import sys

distribution_id = "E2ANIEKR516BL9"
function_name = "redirect-fabricante-infinix"

# Obtener ARN de la función publicada
print(f"Obteniendo ARN de la funcion {function_name}...")
describe_result = subprocess.run(
    ['aws', 'cloudfront', 'describe-function', '--name', function_name, '--stage', 'LIVE', '--output', 'json'],
    capture_output=True,
    text=True
)

if describe_result.returncode != 0:
    print(f"Error obteniendo funcion: {describe_result.stderr}")
    sys.exit(1)

function_data = json.loads(describe_result.stdout)
function_summary = function_data.get('FunctionSummary', {})
function_metadata = function_summary.get('FunctionMetadata', {})
function_arn = function_metadata.get('FunctionARN')

if not function_arn:
    print("Error: No se pudo obtener el ARN de la funcion")
    sys.exit(1)

print(f"ARN de la funcion: {function_arn}")

# Obtener configuración actual de CloudFront
print(f"\nObteniendo configuracion de CloudFront {distribution_id}...")
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

# Asociar la función al Viewer Request
if 'FunctionAssociations' not in config['DefaultCacheBehavior']:
    config['DefaultCacheBehavior']['FunctionAssociations'] = {'Quantity': 0, 'Items': []}

function_associations = config['DefaultCacheBehavior']['FunctionAssociations']
function_associations['Quantity'] = 1
function_associations['Items'] = [
    {
        'FunctionARN': function_arn,
        'EventType': 'viewer-request'
    }
]

# Guardar configuración actualizada
config_file = "cloudfront-with-function.json"
with open(config_file, 'w', encoding='utf-8') as f:
    json.dump(config, f, indent=2)

print(f"Configuracion guardada en {config_file}")

# Actualizar CloudFront
print(f"\nActualizando CloudFront...")
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

print("OK: CloudFront actualizado exitosamente!")
print(f"   Nuevo ETag: {new_etag}")
print(f"   Status: {status}")
print("\nNota: Los cambios pueden tardar 5-15 minutos en desplegarse.")

