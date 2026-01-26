import json
import subprocess
import sys
import time

distribution_id = "E2ANIEKR516BL9"
function_name = "redirect-fabricante-infinix"

print("Verificando que el sitio funciona sin la funcion...")
print("Esperando 30 segundos para que CloudFront se estabilice...")
time.sleep(30)

print("\nObteniendo informacion de la funcion...")
describe_result = subprocess.run(
    ['aws', 'cloudfront', 'describe-function', '--name', function_name, '--stage', 'LIVE', '--output', 'json'],
    capture_output=True,
    text=True
)

if describe_result.returncode != 0:
    print(f"Error: {describe_result.stderr}")
    sys.exit(1)

function_data = json.loads(describe_result.stdout)
function_arn = function_data['FunctionSummary']['FunctionARN']

print(f"ARN de la funcion: {function_arn}")

print("\nObteniendo configuracion de CloudFront...")
get_config_result = subprocess.run(
    ['aws', 'cloudfront', 'get-distribution-config', '--id', distribution_id, '--output', 'json'],
    capture_output=True,
    text=True
)

if get_config_result.returncode != 0:
    print(f"Error: {get_config_result.stderr}")
    sys.exit(1)

config_data = json.loads(get_config_result.stdout)
etag = config_data['ETag']
config = config_data['DistributionConfig']

# Asociar funcion
config['DefaultCacheBehavior']['FunctionAssociations'] = {
    'Quantity': 1,
    'Items': [
        {
            'FunctionARN': function_arn,
            'EventType': 'viewer-request'
        }
    ]
}

config_file = "cloudfront-con-function.json"
with open(config_file, 'w', encoding='utf-8') as f:
    json.dump(config, f, indent=2)

print("\nAsociando funcion a CloudFront...")
print("ADVERTENCIA: Si esto causa un error 503, la funcion sera removida automaticamente")
print("Continuar? (s/n): ", end='')
response = input().strip().lower()

if response != 's':
    print("Cancelado.")
    sys.exit(0)

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

print("\nOK: Funcion asociada")
print("CloudFront se desplegara en 5-15 minutos")
print("Monitorea el sitio. Si ves error 503, ejecuta: python remover-function-inmediato.py")

