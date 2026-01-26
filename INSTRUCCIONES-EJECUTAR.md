# Cómo Ejecutar la Aplicación Manualmente

## Desde PowerShell o Terminal

### Opción 1: Usando npm
```powershell
cd alcance-reducido-front
npm start
```

### Opción 2: Usando Angular CLI directamente
```powershell
cd alcance-reducido-front
ng serve
```

### Opción 3: Con puerto específico
```powershell
cd alcance-reducido-front
ng serve --port 4200
```

## Pasos Detallados

1. **Abre PowerShell o Terminal**
   - Presiona `Win + X` y selecciona "Windows PowerShell" o "Terminal"
   - O busca "PowerShell" en el menú de inicio

2. **Navega al directorio del proyecto**
   ```powershell
   cd "C:\Users\thena\OneDrive\Documentos\alcance_reducido_front\alcance-reducido-front"
   ```
   O desde el directorio actual:
   ```powershell
   cd alcance-reducido-front
   ```

3. **Inicia el servidor**
   ```powershell
   npm start
   ```

4. **Espera a que compile**
   - Verás mensajes de compilación
   - Cuando veas "Application bundle generation complete", está listo
   - Normalmente toma 30-60 segundos

5. **Abre en el navegador**
   - URL: `http://localhost:4200`
   - Se abrirá automáticamente o puedes abrirlo manualmente

## Detener el Servidor

- Presiona `Ctrl + C` en la terminal donde está corriendo

## Solución de Problemas

### Si npm start no funciona:
```powershell
npm install
npm start
```

### Si hay errores de puerto ocupado:
```powershell
ng serve --port 4201
```

### Verificar que Node.js está instalado:
```powershell
node --version
npm --version
```

## Comandos Útiles

- **Ver versión de Angular CLI**: `ng version`
- **Limpiar caché**: `npm cache clean --force`
- **Reinstalar dependencias**: `rm -rf node_modules && npm install` (en Git Bash) o eliminar `node_modules` manualmente y ejecutar `npm install`

