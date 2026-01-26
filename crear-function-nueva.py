import json
import subprocess
import sys

function_name = "redirect-fabricante-infinix"
function_code = """function handler(event) {
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
}"""

function_config = {
    "Comment": "Redirect /fabricante/infinix to /representante/luxuryspa",
    "Runtime": "cloudfront-js-1.0"
}

print("Creando nueva CloudFront Function...")

# Crear función
create_result = subprocess.run(
    [
        'aws', 'cloudfront', 'create-function',
        '--name', function_name,
        '--function-config', json.dumps(function_config),
        '--function-code', function_code,
        '--output', 'json'
    ],
    capture_output=True,
    text=True
)

if create_result.returncode != 0:
    print(f"Error creando funcion: {create_result.stderr}")
    sys.exit(1)

print("Funcion creada. Publicando...")

# Obtener ETag
describe_result = subprocess.run(
    ['aws', 'cloudfront', 'describe-function', '--name', function_name, '--stage', 'DEVELOPMENT', '--output', 'json'],
    capture_output=True,
    text=True
)

if describe_result.returncode != 0:
    print(f"Error obteniendo ETag: {describe_result.stderr}")
    sys.exit(1)

etag = json.loads(describe_result.stdout)['ETag']

# Publicar
publish_result = subprocess.run(
    [
        'aws', 'cloudfront', 'publish-function',
        '--name', function_name,
        '--if-match', etag,
        '--output', 'json'
    ],
    capture_output=True,
    text=True
)

if publish_result.returncode != 0:
    print(f"Error publicando funcion: {publish_result.stderr}")
    sys.exit(1)

print("OK: Funcion creada y publicada")
print("NOTA: NO la asociaremos a CloudFront hasta verificar que funciona correctamente")

