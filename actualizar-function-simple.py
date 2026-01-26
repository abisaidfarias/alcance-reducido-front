import json
import subprocess
import sys

function_name = "redirect-fabricante-infinix"

# Codigo simplificado de la funcion
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

print("Obteniendo ETag de la funcion en DEVELOPMENT...")
describe_result = subprocess.run(
    ['aws', 'cloudfront', 'describe-function', '--name', function_name, '--stage', 'DEVELOPMENT', '--output', 'json'],
    capture_output=True,
    text=True
)

if describe_result.returncode != 0:
    print(f"Error obteniendo funcion: {describe_result.stderr}")
    sys.exit(1)

etag = json.loads(describe_result.stdout)['ETag']

print("Actualizando codigo de la funcion...")
update_result = subprocess.run(
    [
        'aws', 'cloudfront', 'update-function',
        '--name', function_name,
        '--if-match', etag,
        '--function-code', function_code,
        '--function-config', json.dumps({
            "Comment": "Redirect /fabricante/infinix to /representante/luxuryspa",
            "Runtime": "cloudfront-js-1.0"
        }),
        '--output', 'json'
    ],
    capture_output=True,
    text=True
)

if update_result.returncode != 0:
    print(f"Error actualizando funcion: {update_result.stderr}")
    sys.exit(1)

print("Funcion actualizada. Obteniendo nuevo ETag...")
describe_result = subprocess.run(
    ['aws', 'cloudfront', 'describe-function', '--name', function_name, '--stage', 'DEVELOPMENT', '--output', 'json'],
    capture_output=True,
    text=True
)

etag = json.loads(describe_result.stdout)['ETag']

print("Publicando funcion...")
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

print("\nOK: Funcion actualizada y publicada")
print("NOTA: La funcion NO esta asociada a CloudFront actualmente")
print("El sitio deberia estar funcionando sin errores 503")
print("\nPara asociar la funcion (despues de verificar que el sitio funciona):")
print("  python verificar-y-asociar-function.py")

