# 💰 Costos Estimados - Despliegue AWS

## Servicios Utilizados

### 1. **Amazon S3** (Almacenamiento)
- **Bucket**: `alcance-reducido-app`
- **Región**: `us-east-1` (N. Virginia)

#### Costos:
- **Almacenamiento**: $0.023 por GB/mes (primeros 50 TB)
- **Requests GET**: $0.0004 por 1,000 requests
- **Requests PUT**: $0.005 por 1,000 requests
- **Transferencia de datos saliente**: $0.09 por GB (primeros 10 TB/mes)

#### Estimación mensual (sitio pequeño-mediano):
- **Almacenamiento** (~100 MB): **$0.002** ≈ **$0.00**
- **Requests** (100,000 GET/mes): **$0.04**
- **Transferencia** (5 GB/mes): **$0.45**
- **Total S3**: **~$0.50/mes**

---

### 2. **Amazon CloudFront** (CDN)
- **Distribución**: `E2ANIEKR516BL9`
- **Región**: Global

#### Costos:
- **Transferencia de datos saliente**:
  - Primeros 10 TB/mes: $0.085 por GB
  - Siguientes 40 TB/mes: $0.080 por GB
- **Requests HTTP/HTTPS**: $0.0075 por 10,000 requests
- **Invalidaciones**: Primeras 1,000/mes **GRATIS**, luego $0.005 por invalidación

#### Estimación mensual (sitio pequeño-mediano):
- **Transferencia** (50 GB/mes): **$4.25**
- **Requests** (500,000 requests/mes): **$0.38**
- **Invalidaciones** (10/mes): **$0.00** (dentro del free tier)
- **Total CloudFront**: **~$4.63/mes**

---

### 3. **AWS Certificate Manager (ACM)**
- **Certificado SSL**: `arn:aws:acm:us-east-1:438758934896:certificate/...`

#### Costos:
- **Certificados SSL**: **GRATIS** ✅
- **Renovación automática**: **GRATIS** ✅

#### Total ACM: **$0.00/mes**

---

### 4. **Amazon Route 53** (DNS)
- **Hosted Zone**: `Z00603941KQBVTNY6LOLY`
- **Registros DNS**: A, MX, TXT

#### Costos:
- **Hosted Zone**: $0.50 por zona/mes
- **Queries DNS**:
  - Primeros 1,000 millones: $0.40 por millón
  - Siguientes: $0.20 por millón

#### Estimación mensual (sitio pequeño-mediano):
- **Hosted Zone**: **$0.50**
- **Queries** (1 millón/mes): **$0.40**
- **Total Route 53**: **~$0.90/mes**

---

### 5. **CloudFront Functions**
- **Función**: `redirect-fabricante-infinix`

#### Costos:
- **Invocaciones**: $0.10 por millón de invocaciones
- **Sin cargo por almacenamiento**

#### Estimación mensual (sitio pequeño-mediano):
- **Invocaciones** (500,000/mes): **$0.05**
- **Total CloudFront Functions**: **~$0.05/mes**

---

## 💵 **COSTO TOTAL ESTIMADO MENSUAL**

### Escenario: Sitio Pequeño-Mediano
- **Tráfico**: ~50 GB/mes
- **Requests**: ~500,000/mes
- **Queries DNS**: ~1 millón/mes

| Servicio | Costo Mensual |
|----------|---------------|
| S3 | $0.50 |
| CloudFront | $4.63 |
| Route 53 | $0.90 |
| CloudFront Functions | $0.05 |
| ACM | $0.00 |
| **TOTAL** | **~$6.08/mes** |

---

### Escenario: Sitio con Tráfico Medio
- **Tráfico**: ~200 GB/mes
- **Requests**: ~2 millones/mes
- **Queries DNS**: ~5 millones/mes

| Servicio | Costo Mensual |
|----------|---------------|
| S3 | $1.50 |
| CloudFront | $17.00 |
| Route 53 | $2.50 |
| CloudFront Functions | $0.20 |
| ACM | $0.00 |
| **TOTAL** | **~$21.20/mes** |

---

### Escenario: Sitio con Alto Tráfico
- **Tráfico**: ~1 TB/mes
- **Requests**: ~10 millones/mes
- **Queries DNS**: ~20 millones/mes

| Servicio | Costo Mensual |
|----------|---------------|
| S3 | $5.00 |
| CloudFront | $85.00 |
| Route 53 | $8.50 |
| CloudFront Functions | $1.00 |
| ACM | $0.00 |
| **TOTAL** | **~$99.50/mes** |

---

## 📊 **Desglose de Costos por Componente**

### Costo Principal: CloudFront (Transferencia de Datos)
- Representa **~75-85%** del costo total
- Depende directamente del tráfico del sitio
- Más económico que servir directamente desde S3

### Costo Fijo: Route 53
- **$0.50/mes** por Hosted Zone (fijo)
- Queries DNS son muy económicas

### Costo Mínimo: S3
- Muy económico para almacenamiento estático
- El costo principal es la transferencia (pero CloudFront lo maneja)

---

## 💡 **Optimizaciones para Reducir Costos**

1. **Comprimir archivos**: Ya configurado en CloudFront (`Compress: true`)
2. **Cache agresivo**: CloudFront cachea contenido estático
3. **Invalidaciones mínimas**: Solo invalidar cuando sea necesario
4. **Usar CloudFront Functions**: Muy económico para redirecciones

---

## 🆓 **Free Tier (Primeros 12 meses)**

Si tu cuenta AWS es nueva (< 12 meses):

- **S3**: 5 GB almacenamiento, 20,000 GET requests
- **CloudFront**: 1 TB transferencia de datos, 10,000,000 requests HTTP/HTTPS
- **Route 53**: 1 Hosted Zone gratis

**Con Free Tier, el costo puede ser $0-2/mes los primeros 12 meses.**

---

## 📈 **Calculadora de AWS**

Para cálculos más precisos según tu tráfico real:
- **AWS Pricing Calculator**: https://calculator.aws/

---

## ⚠️ **Notas Importantes**

1. **Los precios pueden variar** según la región y cambios de AWS
2. **Verificar facturación mensual** en AWS Billing Dashboard
3. **Configurar alertas de facturación** para evitar sorpresas
4. **Los precios mostrados son aproximados** y pueden variar

---

## 📝 **Resumen**

**Para un sitio pequeño-mediano: ~$6-10/mes**
**Para un sitio con tráfico medio: ~$20-25/mes**
**Para un sitio con alto tráfico: ~$100/mes**

**El costo principal es CloudFront (transferencia de datos), que es inevitable para servir contenido globalmente con baja latencia.**

