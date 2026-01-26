# 🌐 Guía: Migrar Dominio a AWS Route 53

## 📋 Opciones para Migrar el Dominio

Hay **dos formas** de mover el dominio a AWS:

### Opción 1: Usar Route 53 solo para DNS (RECOMENDADO)
- **Mantienes** el dominio registrado en tu proveedor actual (GoDaddy, Namecheap, etc.)
- **Usas Route 53** solo para gestionar los registros DNS
- ✅ Más fácil y rápido
- ✅ No requiere transferir el dominio
- ✅ Puedes revertir fácilmente

### Opción 2: Transferir el dominio completo a Route 53
- **Transfieres** el dominio a AWS Route 53 como registrador
- ✅ Todo centralizado en AWS
- ⚠️ Requiere desbloquear el dominio y obtener código de autorización
- ⚠️ Puede tardar varios días
- ⚠️ Costo adicional de registro/renovación

---

## 🎯 Recomendación: Opción 1 (Solo DNS)

Para este proyecto, recomendamos **Opción 1** porque:
- Es más rápido de implementar
- No interrumpe el servicio actual
- Permite mantener el dominio donde está
- Es más fácil de revertir si hay problemas

---

## ⚠️ IMPORTANTE: ¿Qué sitio reemplazarás?

Al usar Route 53 para DNS, tienes **3 opciones** sobre qué hacer con el sitio actual:

### Opción A: Mantener sitio actual + Agregar subdominio (ACTUAL)
- **Dominio raíz** (`alcance-reducido.com`) → **Mantiene** el sitio actual
- **Subdominio** (`app.alcance-reducido.com`) → **Nueva aplicación Angular**
- ✅ **No interrumpe** el sitio actual
- ✅ Puedes migrar gradualmente
- ✅ Permite mantener ambos sitios funcionando

**Configuración DNS:**
- Solo crear registro CNAME para `app` → CloudFront
- **NO tocar** el registro A del dominio raíz

### Opción B: Reemplazar sitio actual completamente
- **Dominio raíz** (`alcance-reducido.com`) → **Nueva aplicación Angular** (reemplaza el sitio actual)
- ❌ **El sitio actual dejará de estar accesible**
- ✅ URL más limpia (sin subdominio)
- ✅ Mejor para SEO

**Configuración DNS:**
- Crear registro A para dominio raíz (`@`) → CloudFront
- El sitio actual dejará de funcionar cuando cambies los Name Servers

### Opción C: Redirección del dominio raíz
- **Dominio raíz** (`alcance-reducido.com`) → Redirige a `app.alcance-reducido.com`
- **Subdominio** (`app.alcance-reducido.com`) → Nueva aplicación Angular
- ✅ Mantiene el sitio actual accesible temporalmente
- ✅ Los usuarios del dominio raíz van automáticamente a la app

**Configuración DNS:**
- Registro A para dominio raíz → Redirige a CloudFront o mantiene sitio actual
- Registro CNAME para `app` → CloudFront

---

## 🎯 ¿Cuál opción elegir?

**Recomendación basada en tu configuración actual:**

Según tu `DEPLOY.md`, actualmente tienes configurado:
- `app.alcance-reducido.com` → Nueva aplicación Angular
- `alcance-reducido.com` → Se mantiene en servidor actual

**Si quieres mantener esta configuración (Opción A):**
- ✅ Solo necesitas crear el registro CNAME para `app` en Route 53
- ✅ No necesitas tocar el registro A del dominio raíz
- ✅ El sitio actual seguirá funcionando

**Si quieres reemplazar el sitio actual (Opción B):**
- ⚠️ Necesitas crear el registro A para el dominio raíz en Route 53
- ⚠️ El sitio actual dejará de funcionar
- ⚠️ Necesitas actualizar `environment.prod.ts` para usar el dominio raíz

---

## 📝 Paso a Paso: Migrar DNS a Route 53

### Paso 1: Crear Hosted Zone en Route 53

1. Ve a **AWS Console** → **Route 53** → **Hosted zones**
2. Click en **Create hosted zone**
3. Configuración:
   - **Domain name**: `alcance-reducido.com`
   - **Type**: `Public hosted zone` (si quieres que sea accesible públicamente)
   - Click **Create hosted zone**

4. **IMPORTANTE**: Route 53 te dará **4 servidores de nombres (Name Servers)**:
   ```
   ns-123.awsdns-12.com
   ns-456.awsdns-45.net
   ns-789.awsdns-78.org
   ns-012.awsdns-01.co.uk
   ```
   **Guarda estos 4 nombres** - los necesitarás en el paso 3.

---

### Paso 2: Configurar Registros DNS en Route 53

Una vez creada la Hosted Zone, necesitas crear los registros DNS según la opción que elegiste:

---

#### 📌 Si elegiste Opción A: Mantener sitio actual + Subdominio (RECOMENDADO)

**Solo necesitas crear el registro para el subdominio:**

##### 2.1. Registro CNAME para app.alcance-reducido.com

1. En la Hosted Zone, click **Create record**
2. Configuración:
   - **Record name**: `app`
   - **Record type**: `CNAME - Routes traffic to another domain name and some AWS resources`
   - **Value**: `d1234abcd5678.cloudfront.net` (tu Domain Name de CloudFront)
   - **TTL**: `300`
   - Click **Create records**

**✅ Listo**: El sitio actual seguirá funcionando en `alcance-reducido.com` y tu nueva app estará en `app.alcance-reducido.com`

---

#### 📌 Si elegiste Opción B: Reemplazar sitio actual completamente

**Necesitas crear el registro para el dominio raíz:**

##### 2.1. Registro A para el dominio raíz (alcance-reducido.com)

1. En la Hosted Zone, click **Create record**
2. Configuración:
   - **Record name**: Dejar vacío (para dominio raíz) o `@`
   - **Record type**: `A - Routes traffic to an IPv4 address`
   - **Alias**: `Yes`
   - **Route traffic to**: `Alias to CloudFront distribution`
   - **Choose distribution**: Selecciona tu distribución de CloudFront
   - **Routing policy**: `Simple routing`
   - Click **Create records**

**⚠️ IMPORTANTE**: Cuando cambies los Name Servers, el sitio actual dejará de funcionar.

##### 2.2. Registro A para www (opcional)

Si quieres que `www.alcance-reducido.com` también funcione:

1. Click **Create record**
2. Configuración:
   - **Record name**: `www`
   - **Record type**: `A`
   - **Alias**: `Yes`
   - **Route traffic to**: `Alias to CloudFront distribution`
   - Selecciona la misma distribución
   - Click **Create records**

---

#### 2.3. Otros registros necesarios (para cualquier opción)

Si tienes otros servicios, créalos también:
- **MX records** (para email) - **IMPORTANTE**: Si usas email con el dominio, copia estos registros desde tu DNS actual
- **CNAME records** (para otros subdominios)
- **TXT records** (para verificación, SPF, DKIM, etc.) - **IMPORTANTE**: Copia estos desde tu DNS actual
- **NS records** (normalmente no necesitas crearlos manualmente)

---

### Paso 2.5: Copiar Registros Existentes (IMPORTANTE)

**⚠️ ANTES de cambiar los Name Servers**, debes copiar todos los registros DNS existentes a Route 53:

1. **Accede al panel DNS actual** de tu registrador
2. **Copia TODOS los registros** que tengas configurados:
   - **MX records** (si usas email: `@`, `mail`, etc.)
   - **TXT records** (verificación, SPF, DKIM, etc.)
   - **CNAME records** (cualquier subdominio que uses)
   - **A records** (si tienes otros servicios apuntando a IPs)
   - **SRV records** (si los usas)

3. **Crea estos mismos registros en Route 53** antes de cambiar los Name Servers

**¿Por qué es importante?**
- Si usas email con el dominio y no copias los registros MX, **perderás el email**
- Si tienes servicios externos (API, otros subdominios), dejarán de funcionar
- Si no copias los registros TXT, puedes perder verificaciones (Google, etc.)

**💡 Tip**: Toma una captura de pantalla de todos los registros DNS actuales antes de continuar.

---

### Paso 3: Actualizar Name Servers en tu Registrador

**Este es el paso crítico** - aquí es donde "mueves" el control DNS a AWS:

1. **Accede al panel de tu registrador** (GoDaddy, Namecheap, etc.)
2. Busca la sección de **DNS Management** o **Name Servers**
3. **Cambia los Name Servers** de los actuales a los 4 que Route 53 te dio:
   ```
   ns-123.awsdns-12.com
   ns-456.awsdns-45.net
   ns-789.awsdns-78.org
   ns-012.awsdns-01.co.uk
   ```
4. **Guarda los cambios**

**⚠️ IMPORTANTE**: 
- Los cambios pueden tardar **15 minutos a 48 horas** en propagarse
- Durante este tiempo, el sitio puede estar inaccesible
- Es mejor hacer esto en horario de bajo tráfico
- **Si elegiste Opción B** (reemplazar sitio), el sitio actual dejará de funcionar cuando se propague el DNS

---

### Paso 4: Verificar la Propagación DNS

Puedes verificar que los cambios se han propagado usando:

```bash
# Windows PowerShell
nslookup alcance-reducido.com

# O usar herramientas online:
# - https://dnschecker.org
# - https://www.whatsmydns.net
```

Busca que los Name Servers muestren los de AWS (ns-xxx.awsdns-xx.com).

---

### Paso 5: Configurar CloudFront con el Dominio Personalizado

1. Ve a **CloudFront** → Tu distribución
2. Click en **Edit** → **General**
3. En **Alternate domain names (CNAMEs)**, agrega:
   - `alcance-reducido.com`
   - `www.alcance-reducido.com` (si lo configuraste)
4. Click **Save changes**

5. **Request SSL certificate** (si no lo tienes):
   - Ve a **AWS Certificate Manager (ACM)**
   - Click **Request certificate**
   - **Domain names**: `alcance-reducido.com`, `www.alcance-reducido.com`
   - **Validation method**: `DNS validation` (recomendado)
   - Route 53 puede crear automáticamente los registros de validación
   - Espera a que el certificado se valide (puede tardar unos minutos)

6. **Asociar certificado a CloudFront**:
   - Vuelve a CloudFront → Tu distribución → **Edit** → **General**
   - En **Custom SSL certificate**, selecciona el certificado que acabas de crear
   - Click **Save changes**

---

## 🔄 Alternativa: Transferir Dominio Completo a Route 53

Si prefieres transferir el dominio completo a AWS:

### Pre-requisitos

1. **Desbloquear el dominio** en tu registrador actual
2. **Obtener código de autorización (Auth Code)** del registrador
3. **Verificar que el dominio tiene más de 60 días** desde su registro/última transferencia
4. **Verificar que el dominio no esté en período de renovación** (próximos 15 días)

### Proceso

1. Ve a **Route 53** → **Registered domains** → **Transfer domain**
2. Ingresa `alcance-reducido.com`
3. Ingresa el **código de autorización**
4. Completa el proceso de transferencia
5. **Costo**: Route 53 cobra por el registro/renovación del dominio

**Tiempo**: La transferencia puede tardar **5-7 días**.

---

## 📊 Comparación de Opciones

| Aspecto | Solo DNS (Opción 1) | Transferir Dominio (Opción 2) |
|---------|---------------------|-------------------------------|
| **Tiempo** | 15 min - 48 horas | 5-7 días |
| **Complejidad** | Baja | Media |
| **Costo** | $0.50/mes (hosted zone) | $0.50/mes + costo de dominio |
| **Reversibilidad** | Fácil | Difícil |
| **Control** | DNS en AWS, registro en otro | Todo en AWS |

---

## ✅ Checklist de Migración

### Para Opción 1 (Solo DNS) - Opción A (Mantener sitio actual + Subdominio):
- [ ] Decidir qué opción usar (A, B o C)
- [ ] Crear Hosted Zone en Route 53
- [ ] **Copiar TODOS los registros DNS existentes** (MX, TXT, CNAME, etc.) a Route 53
- [ ] Crear registro CNAME para `app` apuntando a CloudFront
- [ ] Copiar los 4 Name Servers de Route 53
- [ ] Actualizar Name Servers en el registrador
- [ ] Esperar propagación DNS (verificar con nslookup)
- [ ] Configurar CNAME `app.alcance-reducido.com` en CloudFront
- [ ] Solicitar certificado SSL en ACM para `app.alcance-reducido.com`
- [ ] Asociar certificado a CloudFront
- [ ] Verificar acceso a `https://app.alcance-reducido.com`
- [ ] Verificar que el sitio actual sigue funcionando en `https://alcance-reducido.com`

### Para Opción 1 (Solo DNS) - Opción B (Reemplazar sitio actual):
- [ ] Decidir qué opción usar (A, B o C)
- [ ] **Backup completo del sitio actual** (por si necesitas revertir)
- [ ] Crear Hosted Zone en Route 53
- [ ] **Copiar TODOS los registros DNS existentes** (MX, TXT, CNAME, etc.) a Route 53
- [ ] Crear registro A para dominio raíz (`@`) apuntando a CloudFront
- [ ] Crear registro A para www (opcional)
- [ ] Copiar los 4 Name Servers de Route 53
- [ ] Actualizar Name Servers en el registrador
- [ ] Esperar propagación DNS (verificar con nslookup)
- [ ] Configurar dominio personalizado `alcance-reducido.com` en CloudFront
- [ ] Solicitar certificado SSL en ACM para `alcance-reducido.com` y `www.alcance-reducido.com`
- [ ] Asociar certificado a CloudFront
- [ ] Actualizar `environment.prod.ts` para usar dominio raíz
- [ ] Verificar acceso a `https://alcance-reducido.com`

### Para Opción 2 (Transferir Dominio):
- [ ] Desbloquear dominio en registrador actual
- [ ] Obtener código de autorización
- [ ] Iniciar transferencia en Route 53
- [ ] Aprobar transferencia desde email
- [ ] Esperar 5-7 días
- [ ] Configurar registros DNS en Route 53
- [ ] Configurar CloudFront con dominio personalizado

---

## 🐛 Troubleshooting

### El dominio no resuelve después de cambiar Name Servers
- **Espera más tiempo** (puede tardar hasta 48 horas)
- Verifica que los Name Servers estén correctos
- Usa `nslookup` o herramientas online para verificar propagación

### Error "Certificate not found" en CloudFront
- Verifica que el certificado esté en la región **us-east-1** (requerido para CloudFront)
- Verifica que el certificado esté validado
- Espera unos minutos después de la validación

### El sitio carga pero muestra errores de CORS
- Verifica que la API tenga CORS configurado para `https://alcance-reducido.com`
- Actualiza la configuración de CORS en el backend

### CloudFront muestra error 403
- Verifica que el dominio esté en la lista de CNAMEs de CloudFront
- Verifica que el certificado SSL esté asociado correctamente

---

## 💰 Costos

### Opción 1 (Solo DNS):
- **Hosted Zone**: $0.50/mes
- **Queries DNS**: $0.40 por millón de queries
- **Total estimado**: $0.50-2/mes

### Opción 2 (Transferir Dominio):
- **Hosted Zone**: $0.50/mes
- **Registro de dominio**: Varía según TLD (ej: .com ~$12/año)
- **Queries DNS**: $0.40 por millón de queries
- **Total estimado**: $1-2/mes + costo de dominio

---

## 📞 Comandos Útiles

```bash
# Verificar Name Servers actuales
nslookup -type=NS alcance-reducido.com

# Verificar propagación DNS
nslookup alcance-reducido.com

# Listar Hosted Zones en Route 53
aws route53 list-hosted-zones

# Obtener Name Servers de una Hosted Zone
aws route53 get-hosted-zone --id /hostedzone/Z1234567890

# Listar registros de una Hosted Zone
aws route53 list-resource-record-sets --hosted-zone-id Z1234567890
```

---

## 🎯 Próximos Pasos Después de la Migración

1. **Actualizar environment.prod.ts** para usar el dominio raíz:
   ```typescript
   appUrl: 'https://alcance-reducido.com'
   ```

2. **Actualizar configuración de CORS** en la API para aceptar el nuevo dominio

3. **Actualizar cualquier referencia** a `app.alcance-reducido.com` si existía

4. **Probar todas las funcionalidades** con el nuevo dominio

---

## 📝 Notas Importantes

- ⚠️ **Backup**: Antes de cambiar los Name Servers, **toma nota de todos los registros DNS actuales** por si necesitas revertir
- ⚠️ **Email**: Si usas email con el dominio, asegúrate de migrar también los registros MX
- ⚠️ **Subdominios**: Si tienes otros subdominios (api, mail, etc.), créalos también en Route 53
- ⚠️ **Tiempo de propagación**: Los cambios DNS pueden tardar hasta 48 horas, pero normalmente es 15-30 minutos

---

## 🆘 ¿Necesitas Ayuda?

Si encuentras problemas durante la migración:
1. Verifica que todos los pasos se hayan completado
2. Revisa los logs de Route 53 en AWS Console
3. Verifica la propagación DNS con herramientas online
4. Revisa la configuración de CloudFront
5. Verifica los certificados SSL en ACM

