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

# Actualizar aliases
config['Aliases'] = {
    'Quantity': 2,
    'Items': ['alcance-reducido.com', 'www.alcance-reducido.com']
}

# Actualizar certificado SSL
config['ViewerCertificate'] = {
    'ACMCertificateArn': 'arn:aws:acm:us-east-1:438758934896:certificate/444c9d61-0878-4d39-8067-9f27885ce8d5',
    'SSLSupportMethod': 'sni-only',
    'MinimumProtocolVersion': 'TLSv1.2_2021',
    'CertificateSource': 'acm'
}

# Guardar configuración actualizada (sin wrapper)
with open('cloudfront-update.json', 'w') as f:
    json.dump(config, f, indent=2)

print(f"ETag: {etag}")
print("Configuración actualizada guardada en cloudfront-update.json")
print("Ejecuta:")
print(f"aws cloudfront update-distribution --id E2ANIEKR516BL9 --if-match {etag} --distribution-config file://cloudfront-update.json")

