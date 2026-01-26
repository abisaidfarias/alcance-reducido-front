import json
import subprocess
import sys
import os

function_name = "redirect-fabricante-infinix"
function_file = "cloudfront-function-redirect.js"

# Leer el código actualizado
script_dir = os.path.dirname(os.path.abspath(__file__))
function_path = os.path.join(script_dir, function_file)

with open(function_path, 'r', encoding='utf-8') as f:
    function_code = f.read()

# Obtener ETag actual de DEVELOPMENT
print(f"Obteniendo ETag de la función {function_name}...")
describe_result = subprocess.run(
    ['aws', 'cloudfront', 'describe-function', '--name', function_name, '--stage', 'DEVELOPMENT', '--output', 'json'],
    capture_output=True,
    text=True
)

if describe_result.returncode != 0:
    print(f"Error obteniendo función: {describe_result.stderr}")
    sys.exit(1)

function_data = json.loads(describe_result.stdout)
current_etag = function_data['ETag']

print(f"ETag actual: {current_etag}")

# Crear archivo temporal con el código
code_file = "function-code.js"
with open(code_file, 'w', encoding='utf-8', newline='') as f:
    f.write(function_code)

# Obtener configuración de describe-function
function_summary = function_data.get('FunctionSummary', {})
function_config = {
    "Comment": function_summary.get('Comment', 'Redirect /fabricante/infinix to /representante/luxuryspa'),
    "Runtime": function_summary.get('Runtime', 'cloudfront-js-1.0')
}

config_file = "function-config.json"
with open(config_file, 'w', encoding='utf-8') as f:
    json.dump(function_config, f, indent=2)

# Actualizar la función
print(f"\nActualizando función...")
update_result = subprocess.run(
    [
        'aws', 'cloudfront', 'update-function',
        '--name', function_name,
        '--if-match', current_etag,
        '--function-config', f'file://{os.path.abspath(config_file)}',
        '--function-code', f'file://{os.path.abspath(code_file)}',
        '--output', 'json'
    ],
    capture_output=True,
    text=True,
    cwd=script_dir
)

if update_result.returncode != 0:
    print(f"Error actualizando función: {update_result.stderr}")
    sys.exit(1)

update_data = json.loads(update_result.stdout)
new_etag = update_data['ETag']

print("OK: Funcion actualizada exitosamente!")
print(f"   Nuevo ETag: {new_etag}")

# Publicar la función
print("\nPublicando funcion...")
publish_result = subprocess.run(
    [
        'aws', 'cloudfront', 'publish-function',
        '--name', function_name,
        '--if-match', new_etag,
        '--output', 'json'
    ],
    capture_output=True,
    text=True
)

if publish_result.returncode != 0:
    print(f"Error publicando funcion: {publish_result.stderr}")
    sys.exit(1)

publish_data = json.loads(publish_result.stdout)
published_etag = publish_data.get('ETag', 'N/A')

print("OK: Funcion publicada exitosamente!")
if published_etag != 'N/A':
    print(f"   ETag publicado: {published_etag}")

print("\nProximo paso:")
print("   Asociar la funcion a la distribucion CloudFront E2ANIEKR516BL9")

