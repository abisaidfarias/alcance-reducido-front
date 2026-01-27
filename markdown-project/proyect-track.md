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

### Arquitectura
- **Frontend**: S3 + CloudFront
- **Dominio**: `alcance-reducido.com`
- **API Backend**: `https://api.alcance-reducido.com/api`
- **Región**: `us-east-1`
- **Bucket S3**: `alcance-reducido-app`
- **CloudFront Distribution**: `E2ANIEKR516BL9`
- **CloudFront Domain**: `d116qh3ntei4la.cloudfront.net`
- **Route 53 Hosted Zone**: `Z00603941KQBVTNY6LOLY`

### Estado del Despliegue
**Última actualización**: 27 de Enero 2025

#### ✅ Completado
- [x] Bucket S3 creado y configurado
- [x] CloudFront Distribution creada y desplegada
- [x] OAC configurado
- [x] Custom Error Responses configurados (403, 404 → /index.html)
- [x] Route 53 Hosted Zone creada
- [x] Registros DNS configurados (A para dominio raíz y www)
- [x] Certificado SSL validado y asociado
- [x] Name Servers actualizados en Namecheap
- [x] Registros MX (email) preservados
- [x] URL API actualizada a `https://api.alcance-reducido.com/api`
- [x] Base href configurado correctamente
- [x] CloudFront Function para redirección creada (`redirect-fabricante-infinix`)
- [x] Sitio en producción: `https://alcance-reducido.com`

#### Scripts de Despliegue
- `deploy.sh` - Script principal de despliegue
- `update-cloudfront.py` - Actualización de configuración CloudFront
- `completar-cloudfront.ps1` - Script PowerShell para completar configuración

## Historial de Cambios

### 27 de Enero 2025 - Separación de Campos en Distribuidor
- [x] **Campo 'representante' actualizado**: Ahora solo acepta caracteres alfanuméricos (a-z, A-Z, 0-9), sin espacios ni caracteres especiales
- [x] **Nuevo campo 'nombreRepresentante' agregado**: Permite cualquier carácter y se usa para mostrar el nombre completo en la tabla y página pública
- [x] **Validación implementada**: El campo 'representante' tiene validación de patrón y filtro automático en el input
- [x] **URLs preservadas**: El campo 'representante' sigue siendo usado para generar las URLs (`/representante/{representante}`)
- [x] **Visualización actualizada**: La tabla y página pública muestran 'nombreRepresentante' en lugar de 'representante'
- [x] **Archivos actualizados**:
  - `distribuidor.interface.ts` - Agregado campo `nombreRepresentante`
  - `distribuidor-form.component.html` - Agregado campo nuevo con validaciones
  - `distribuidor-form.component.ts` - Validación y filtro de input
  - `distribuidor.component.html` - Muestra `nombreRepresentante`
  - `representante.component.ts` - Método `getNombreRepresentante()` agregado
  - `representante.component.html` - Usa `getNombreRepresentante()`

### 27 de Enero 2025 - Tipos de Dispositivos Expandidos
- [x] **Nuevos tipos agregados**: Reloj, Audífonos, Laptop (además de Teléfono existente)
- [x] **Union type creado**: `TipoDispositivo` con valores: 'telefono' | 'reloj' | 'audifonos' | 'laptop'
- [x] **Formulario actualizado**: Opciones agregadas al select de tipo de dispositivo
- [x] **Formateo de visualización**: Método `getTipoDisplay()` agregado para mostrar nombres capitalizados en la tabla
- [x] **Archivos actualizados**:
  - `dispositivo.interface.ts` - Union type `TipoDispositivo` creado
  - `dispositivo-form.component.html` - Opciones de tipo agregadas
  - `dispositivo.component.ts` - Método `getTipoDisplay()` agregado
  - `dispositivo.component.html` - Usa `getTipoDisplay()` para mostrar tipo

### 25-26 de Enero 2025 - Despliegue en AWS
- [x] Configuración inicial de S3 y CloudFront
- [x] Migración de dominio a Route 53
- [x] Configuración de certificado SSL
- [x] Actualización de Name Servers
- [x] Corrección de base href
- [x] Actualización de URL de API
- [x] Eliminación de `/browser/` de URL
- [x] CloudFront Function para redirección

## Notas Importantes

### Desarrollo Local
- El proyecto está listo para ejecutarse con `ng serve`
- La API debe estar corriendo en http://localhost:3000
- El Swagger está disponible en http://localhost:3000/api-docs/
- El token se almacena en localStorage con la clave 'auth_token'
- La URL base de la API incluye el prefijo `/api` automáticamente
- El endpoint de login es: `http://localhost:3000/api/auth/login`

### Producción
- **Sitio en producción**: `https://alcance-reducido.com`
- **API Backend**: `https://api.alcance-reducido.com/api`
- La página principal (`/`) es pública y muestra información sobre certificación SUBTEL
- La plataforma administrativa está en `/admin/*` y requiere autenticación de admin
- Los usuarios no-admin son redirigidos a `/representante/:nombre` después del login

### Backend - Cambios Requeridos
- **IMPORTANTE**: El backend debe actualizarse para soportar el nuevo campo `nombreRepresentante` en el modelo Distribuidor
- **IMPORTANTE**: El backend debe actualizarse para aceptar los nuevos tipos de dispositivos: 'reloj', 'audifonos', 'laptop'

### Funcionalidades
- El generador de QR usa una API externa (qrserver.com) para generar los códigos
- CloudFront Function configurada para redirección: `/fabricante/infinix` → `/representante/luxuryspa`
