import json
import subprocess
import sys

# Obtener configuración actual
result = subprocess.run(
    ['aws', 'cloudfront', 'get-distribution-config', '--id', 'E2ANIEKR516BL9', '--output', 'json'],
    capture_output=True,
    text=True
)

if result.returncode != 0:
    print(f"Error obteniendo configuración: {result.stderr}")
    sys.exit(1)

data = json.loads(result.stdout)
etag = data['ETag']
config = data['DistributionConfig']

# Actualizar DefaultRootObject a index.html (sin browser/)
config['DefaultRootObject'] = 'index.html'

# Actualizar Custom Error Responses para usar index.html
if 'CustomErrorResponses' in config:
    for error_response in config['CustomErrorResponses']['Items']:
        if error_response['ErrorCode'] in [403, 404]:
            error_response['ResponsePagePath'] = '/index.html'
            error_response['ResponseCode'] = '200'

# Guardar configuración actualizada
with open('cloudfront-raiz-update.json', 'w') as f:
    json.dump(config, f, indent=2)

print(f"ETag: {etag}")
print("Configuración actualizada guardada en cloudfront-raiz-update.json")
print("\nEjecuta:")
print(f"aws cloudfront update-distribution --id E2ANIEKR516BL9 --if-match {etag} --distribution-config file://cloudfront-raiz-update.json")

