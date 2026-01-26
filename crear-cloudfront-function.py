import json
import subprocess
import sys
import os

# Leer el código de la función
function_file = "cloudfront-function-redirect.js"
if not os.path.exists(function_file):
    # Buscar en el directorio actual
    for root, dirs, files in os.walk("."):
        if function_file in files:
            function_file = os.path.join(root, function_file)
            break

with open(function_file, 'r', encoding='utf-8') as f:
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

# Crear archivo temporal con el código
code_file = "function-code.js"
with open(code_file, 'w', encoding='utf-8') as f:
    f.write(function_code)

# Crear la función
print(f"Creando CloudFront Function: {function_name}...")
result = subprocess.run(
    [
        'aws', 'cloudfront', 'create-function',
        '--name', function_name,
        '--function-config', f'file://{config_file}',
        '--function-code', f'file://{code_file}',
        '--output', 'json'
    ],
    capture_output=True,
    text=True
)

if result.returncode != 0:
    print(f"Error creando función: {result.stderr}")
    sys.exit(1)

function_data = json.loads(result.stdout)
function_etag = function_data['ETag']
function_arn = function_data['FunctionSummary']['FunctionARN']

print(f"✅ Función creada exitosamente!")
print(f"   ARN: {function_arn}")
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
print(f"   1. Asociar la función a la distribución CloudFront")
print(f"   2. Actualizar la configuración de CloudFront")

