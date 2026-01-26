import json
import subprocess
import sys
import os
import base64

# Leer el código de la función
function_file = "cloudfront-function-redirect.js"
script_dir = os.path.dirname(os.path.abspath(__file__))
function_path = os.path.join(script_dir, function_file)

if not os.path.exists(function_path):
    # Buscar en el directorio actual
    for root, dirs, files in os.walk("."):
        if function_file in files:
            function_path = os.path.join(root, function_file)
            break

with open(function_path, 'r', encoding='utf-8') as f:
    function_code = f.read()

function_name = "redirect-fabricante-infinix"

# Crear archivo de configuración
function_config = {
    "Comment": "Redirect /fabricante/infinix to /representante/luxuryspa",
    "Runtime": "cloudfront-js-1.0"
}

config_file = "function-config.json"
with open(config_file, 'w', encoding='utf-8') as f:
    json.dump(function_config, f, indent=2)

# Crear archivo temporal con el código (sin BOM)
code_file = "function-code.js"
with open(code_file, 'w', encoding='utf-8', newline='') as f:
    f.write(function_code)

print(f"Creando CloudFront Function: {function_name}...")

# Crear la función
result = subprocess.run(
    [
        'aws', 'cloudfront', 'create-function',
        '--name', function_name,
        '--function-config', f'file://{os.path.abspath(config_file)}',
        '--function-code', f'file://{os.path.abspath(code_file)}',
        '--output', 'json'
    ],
    capture_output=True,
    text=True,
    cwd=os.path.dirname(os.path.abspath(__file__))
)

if result.returncode != 0:
    print(f"Error creando función: {result.stderr}")
    print(f"Stdout: {result.stdout}")
    sys.exit(1)

function_data = json.loads(result.stdout)
print(f"Respuesta completa: {json.dumps(function_data, indent=2)}")

function_etag = function_data.get('ETag', '')
function_summary = function_data.get('FunctionSummary', {})
function_arn = function_summary.get('FunctionARN', function_summary.get('Name', ''))

print(f"✅ Función creada exitosamente!")
if function_arn:
    print(f"   ARN/Name: {function_arn}")
print(f"   ETag: {function_etag}")

# Publicar la función
print(f"\nPublicando función...")
publish_result = subprocess.run(
    [
        'aws', 'cloudfront', 'publish-function',
        '--name', function_name,
        '--if-match', function_etag,
        '--output', 'json'
    ],
    capture_output=True,
    text=True
)

if publish_result.returncode != 0:
    print(f"Error publicando función: {publish_result.stderr}")
    sys.exit(1)

publish_data = json.loads(publish_result.stdout)
published_etag = publish_data['ETag']

print(f"✅ Función publicada exitosamente!")
print(f"   ETag publicado: {published_etag}")

print(f"\n📝 Próximos pasos:")
print(f"   1. Asociar la función a la distribución CloudFront E2ANIEKR516BL9")
print(f"   2. Actualizar la configuración de CloudFront")

