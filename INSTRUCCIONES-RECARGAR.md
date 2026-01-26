# Instrucciones para Ver los Cambios

## Si los cambios no se ven:

### 1. Recarga la página
- Presiona `Ctrl + F5` (recarga forzada)
- O `Ctrl + Shift + R` (limpiar caché y recargar)

### 2. Verifica que el servidor esté corriendo
- Debe estar en: `http://localhost:4200`
- Si no está, ejecuta: `npm start` en la carpeta del proyecto

### 3. Limpia el caché del navegador
- Abre las herramientas de desarrollador (F12)
- Clic derecho en el botón de recargar
- Selecciona "Vaciar caché y volver a cargar de forma forzada"

### 4. Verifica en modo mobile
- Abre las herramientas de desarrollador (F12)
- Activa el modo responsive (Ctrl + Shift + M)
- Selecciona un dispositivo móvil (iPhone, Android, etc.)

## Cambios realizados:

✅ Layout responsive:
- Sidenav se oculta en mobile
- Se abre con el botón de menú
- Modo "over" en mobile, "side" en desktop

✅ Home component:
- Grid responsive (1 col en mobile, 2 en tablet, 3 en desktop)
- Tamaños de fuente ajustados
- Padding optimizado

## Si aún no se ven los cambios:

1. Detén el servidor (Ctrl + C)
2. Ejecuta: `npm start` nuevamente
3. Espera a que compile completamente
4. Recarga la página con Ctrl + F5

