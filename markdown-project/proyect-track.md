# Proyecto: Alcance Reducido Front

## Fecha de Inicio: 22 de Enero 2025

### Descripción del Proyecto
Proyecto Angular con diseño estándar bonito que incluye:
- Login tradicional
- Home con menú lateral izquierdo
- Integración con API en http://localhost:3000
- Swagger disponible en http://localhost:3000/api-docs/

## Estructura del Proyecto

### Tecnologías Utilizadas
- Angular 18.2.0
- Angular Material 18.2.14
- TypeScript 5.5.2
- SCSS para estilos

### Componentes Creados
1. **LoginComponent** (`src/app/components/login/`)
   - Formulario de login con validación
   - Integración con servicio de autenticación
   - Diseño con Angular Material

2. **LayoutComponent** (`src/app/components/layout/`)
   - Menú lateral izquierdo (sidenav)
   - Toolbar superior
   - Navegación entre secciones
   - Botón de logout

3. **HomeComponent** (`src/app/components/home/`)
   - Página principal después del login
   - Tarjetas informativas
   - Diseño responsive

4. **DistribuidorComponent** (`src/app/components/distribuidor/`)
   - Gestión de distribuidores
   - Tabla con datos de distribuidores
   - Acciones CRUD

5. **MarcaComponent** (`src/app/components/marca/`)
   - Gestión de marcas
   - Tabla con datos de marcas
   - Acciones CRUD

6. **DispositivoComponent** (`src/app/components/dispositivo/`)
   - Gestión de dispositivos
   - Tabla con información de dispositivos
   - Estados (Activo/Inactivo)

7. **QrComponent** (`src/app/components/qr/`)
   - Generador de códigos QR
   - Formulario para ingresar URL
   - Descarga de código QR generado

8. **UsuarioComponent** (`src/app/components/usuario/`)
   - Gestión de usuarios
   - Tabla con información de usuarios
   - Roles y estados

9. **RepresentanteComponent** (`src/app/components/representante/`)
   - Página pública para representantes/distribuidores
   - Muestra marcas y dispositivos asociados
   - Vista de detalle de dispositivos
   - Accesible sin autenticación en `/representante/:nombre`

10. **CertificacionComponent** (`src/app/components/certificacion/`)
    - Página principal pública (landing page)
    - Información sobre certificación SUBTEL
    - Diseño moderno con gradientes y animaciones
    - Accesible sin autenticación en `/` (raíz)

### Servicios Creados
1. **AuthService** (`src/app/services/auth.service.ts`)
   - Manejo de autenticación
   - Gestión de tokens
   - Login y logout

2. **ApiService** (`src/app/services/api.service.ts`)
   - Cliente HTTP para comunicación con API
   - URL base: http://localhost:3000/api
   - Métodos: GET, POST, PUT, DELETE

### Guards y Interceptors
1. **AuthGuard** (`src/app/guards/auth.guard.ts`)
   - Protección de rutas
   - Redirección a login si no está autenticado

2. **AuthInterceptor** (`src/app/interceptors/auth.interceptor.ts`)
   - Agrega token Bearer automáticamente a las peticiones HTTP

### Configuración de Rutas
- **Rutas Públicas:**
  - `/` - Página principal pública (CertificacionComponent) - Landing page
  - `/login` - Página de login
  - `/representante/:nombre` - Página pública del representante

- **Rutas Administrativas (protegidas con authGuard):**
  - `/admin` - Layout principal con menú lateral
  - Rutas hijas dentro de `/admin`:
    - `/admin/distribuidor` - Gestión de distribuidores (ruta por defecto)
    - `/admin/marca` - Gestión de marcas
    - `/admin/dispositivo` - Gestión de dispositivos
    - `/admin/qr` - Generador de códigos QR
    - `/admin/usuario` - Gestión de usuarios
    - `/admin/home` - Página principal administrativa

## Estado del Proyecto

### ✅ Completado
- [x] Creación del proyecto Angular 18
- [x] Instalación de Angular Material
- [x] Componente de login tradicional
- [x] Layout con menú lateral izquierdo
- [x] Componente home
- [x] Servicios de autenticación y API
- [x] Guards de autenticación
- [x] Interceptor HTTP para tokens
- [x] Configuración de rutas
- [x] Diseño responsive y bonito
- [x] Menú lateral actualizado con nuevas opciones
- [x] Componente Distribuidor con tabla CRUD
- [x] Componente Marca con tabla CRUD
- [x] Componente Dispositivo con tabla y estados
- [x] Componente QR con generador de códigos
- [x] Componente Usuario con tabla y roles
- [x] Corrección de URL base de API a `/api`
- [x] Componente Representante (página pública)
- [x] Componente Certificación (landing page pública)
- [x] Reorganización de rutas: `/` para landing, `/admin` para plataforma
- [x] Actualización de redirecciones y menú para usar rutas `/admin/*`

### 🔄 Pendiente
- Integración específica con endpoints del Swagger
- Manejo de errores más robusto
- Tests unitarios
- Mejoras de UX según feedback

## Despliegue en AWS

### Arquitectura Confirmada
- **Frontend**: S3 + CloudFront
- **Subdominio**: `app.alcance-reducido.com` (configuración inicial)
- **Dominio raíz**: `alcance-reducido.com` (opción para migrar a Route 53)
- **API Backend**: `https://api.alcance-reducido.com/api`
- **Región**: `us-east-1`

### Documentación de Despliegue
- `DEPLOY.md` - Guía de despliegue con subdominio
- `deploy-aws.md` - Guía detallada de arquitectura S3 + CloudFront
- `migrar-dominio-aws.md` - Guía para migrar dominio completo a Route 53
- `ESTADO-ACTUAL-AWS.md` - **Estado actual del despliegue y pasos pendientes (Opción B)**

### Estado Actual del Despliegue AWS (Opción B)
**Última revisión**: 25 de Enero 2025

#### ✅ Completado
- [x] Bucket S3 creado: `alcance-reducido-app`
- [x] Archivos subidos a S3
- [x] CloudFront Distribution creada: `E2ANIEKR516BL9` (Status: Deployed)
- [x] CloudFront Domain: `d116qh3ntei4la.cloudfront.net`
- [x] OAC configurado: `E32MO9CLRFRSEA`
- [x] Custom Error Responses configurados (403, 404 → /browser/index.html)
- [x] Script de despliegue creado (`deploy.sh`)
- [x] Políticas de bucket creadas
- [x] `environment.prod.ts` actualizado para dominio raíz

#### ✅ Completado (25 de Enero 2025)
- [x] **Hosted Zone creada en Route 53**: `Z00603941KQBVTNY6LOLY`
- [x] **Registro A para dominio raíz**: `alcance-reducido.com` → CloudFront
- [x] **Registro A para www**: `www.alcance-reducido.com` → CloudFront
- [x] **Certificado SSL solicitado en ACM**: `arn:aws:acm:us-east-1:438758934896:certificate/444c9d61-0878-4d39-8067-9f27885ce8d5`
- [x] **Registros de validación DNS creados** en Route 53
- [x] **Scripts de automatización creados**: `update-cloudfront.py`, `completar-cloudfront.ps1`
- [x] **Documentación completa**: `RESUMEN-DESPLIEGUE.md`, `COMPLETAR-CLOUDFRONT.md`

#### ✅ COMPLETADO - Despliegue Finalizado (25 de Enero 2025, 22:02 UTC)
- [x] **Certificado SSL validado**: Estado `ISSUED`
- [x] **CloudFront configurado**: Aliases y certificado SSL asociados
- [x] **Registros DNS existentes copiados**: MX (email) y TXT (SPF) copiados a Route 53
- [x] **Name Servers actualizados**: Cambiados en Namecheap a Route 53
- [x] **CloudFront desplegado**: Status `Deployed`
- [x] **Sitio accesible**: `https://alcance-reducido.com` (Status 200)
- [x] **Aliases configurados**: `alcance-reducido.com`, `www.alcance-reducido.com`

#### 🎉 Despliegue Completado
- ✅ **Sitio en producción**: `https://alcance-reducido.com`
- ✅ **Email preservado**: Registros MX copiados correctamente
- ✅ **HTTPS funcionando**: Certificado SSL válido
- ✅ **CloudFront activo**: Distribución desplegada y funcionando

#### ✅ Corrección de Base Href (25 de Enero 2025, tarde)
- [x] **Problema identificado**: Angular app no cargaba correctamente debido a `base href` incorrecto
- [x] **Solución aplicada**: Configurado `baseHref: "/browser/"` en `angular.json` para producción
- [x] **Aplicación reconstruida**: Build con configuración correcta
- [x] **Archivos re-subidos a S3**: Archivos actualizados sincronizados
- [x] **CloudFront invalidado**: Cache limpiado para `/browser/*`
- [x] **Verificación**: CloudFront sirve correctamente en `https://d116qh3ntei4la.cloudfront.net/browser/`

#### ⏳ Estado Actual - Propagación DNS (25 de Enero 2025, noche)
- ✅ **Todo configurado correctamente**: CloudFront, S3, Route 53, Name Servers
- ⏳ **Propagación DNS en proceso**: Name Servers correctos en Namecheap, pero DNS aún no propagado globalmente
- ✅ **Sitio funciona en CloudFront directo**: `https://d116qh3ntei4la.cloudfront.net/browser/`
- ⏳ **Esperando propagación**: Normalmente 15-30 minutos, puede tardar hasta 48 horas
- 📝 **Documentación creada**: `ESTADO-ACTUAL-FINAL.md`, `PROPAGACION-DNS.md`

#### ✅ Actualización URL API (25 de Enero 2025, noche)
- [x] **URL API actualizada**: Cambiada de Elastic Beanstalk a `https://api.alcance-reducido.com/api`
- [x] **Motivo**: Evitar problemas de CORS (dominio cruzado) usando mismo dominio
- [x] **Archivo actualizado**: `src/environments/environment.prod.ts`
- [x] **Aplicación reconstruida**: Build con nueva URL de API
- [x] **Archivos subidos a S3**: Archivos actualizados sincronizados
- [x] **CloudFront invalidado**: Cache limpiado para `/browser/*`

#### ✅ Eliminación de /browser/ de URL (25 de Enero 2025, noche)
- [x] **baseHref actualizado**: Cambiado de `/browser/` a `/` en `angular.json`
- [x] **Archivos movidos**: De `browser/` a raíz en S3
- [x] **CloudFront actualizado**: `DefaultRootObject` cambiado a `index.html`
- [x] **Custom Error Responses**: Actualizados para usar `/index.html`
- [x] **URL final**: `https://alcance-reducido.com` (sin `/browser/`)

#### ✅ Redirección CloudFront Function (26 de Enero 2025)
- [x] **CloudFront Function creada**: `redirect-fabricante-infinix`
- [x] **Redirección configurada**: `/fabricante/infinix` → `/representante/luxuryspa`
- [x] **Función publicada**: Estado `LIVE`
- [x] **Asociada a CloudFront**: Evento `viewer-request` en distribución `E2ANIEKR516BL9`
- [x] **Tipo**: Redirección 301 permanente
- [x] **Motivo**: Error del cliente, solución sin modificar código Angular

**Ver detalles completos en**: `DESPLIEGUE-COMPLETADO.md`, `ESTADO-ACTUAL-FINAL.md`, `PROPAGACION-DNS.md`

### Opciones de Migración de Dominio
1. **Opción 1 (Recomendada)**: Usar Route 53 solo para DNS
   - Mantener dominio en registrador actual
   - Usar Route 53 para gestionar registros DNS
   - Más rápido y fácil de revertir

2. **Opción 2**: Transferir dominio completo a Route 53
   - Transferir registro del dominio a AWS
   - Todo centralizado en AWS
   - Requiere más tiempo y proceso

### Decisiones Importantes sobre el Dominio
**⚠️ Pregunta clave**: ¿Reemplazar el sitio actual o mantener ambos?

**Opción A (Actual)**: Mantener sitio actual + Subdominio
- `alcance-reducido.com` → Mantiene sitio actual
- `app.alcance-reducido.com` → Nueva aplicación Angular
- ✅ No interrumpe el sitio actual
- ✅ Permite migración gradual

**Opción B**: Reemplazar sitio actual completamente
- `alcance-reducido.com` → Nueva aplicación Angular
- ❌ El sitio actual dejará de funcionar
- ✅ URL más limpia (sin subdominio)

**IMPORTANTE**: Si se usa Route 53, se deben copiar TODOS los registros DNS existentes (MX, TXT, CNAME, etc.) antes de cambiar los Name Servers para evitar perder servicios como email.

## Notas
- El proyecto está listo para ejecutarse con `ng serve`
- La API debe estar corriendo en http://localhost:3000
- El Swagger está disponible en http://localhost:3000/api-docs/
- El token se almacena en localStorage con la clave 'auth_token'
- La URL base de la API incluye el prefijo `/api` automáticamente
- El endpoint de login es: `http://localhost:3000/api/auth/login`
- El generador de QR usa una API externa (qrserver.com) para generar los códigos
- La página principal (`/`) es pública y muestra información sobre certificación SUBTEL
- La plataforma administrativa está en `/admin/*` y requiere autenticación de admin
- Los usuarios no-admin son redirigidos a `/representante/:nombre` después del login

