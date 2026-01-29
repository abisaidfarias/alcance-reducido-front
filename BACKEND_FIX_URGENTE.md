# 🔴 FIX URGENTE: Error de 10MB en Backend

## Problema
El backend está rechazando archivos de más de 10MB porque:
1. ❌ Multer tiene configurado `fileSize: 10MB`
2. ❌ No hay compresión automática implementada

## Solución Rápida (2 pasos)

### Paso 1: Aumentar Límite de Multer a 20MB

Busca en tu código del backend donde está configurado Multer y cambia:

**ANTES:**
```javascript
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB ❌
  },
});
```

**DESPUÉS:**
```javascript
const upload = multer({
  storage: multer.memoryStorage(), // IMPORTANTE: usar memoryStorage
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB ✅
  },
});
```

### Paso 2: Instalar Sharp y Agregar Compresión

#### 2.1 Instalar Sharp
```bash
npm install sharp
```

#### 2.2 Crear Middleware de Compresión

Crea el archivo `middleware/imageCompression.js`:

```javascript
const sharp = require('sharp');

async function compressImage(req, res, next) {
  if (!req.file) {
    return next();
  }

  try {
    const originalSize = req.file.size;
    
    // Comprimir imagen
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(1920, 1920, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    // Actualizar el buffer comprimido
    req.file.buffer = compressedBuffer;
    req.file.size = compressedBuffer.length;
    req.file.mimetype = 'image/jpeg';

    console.log(`[COMPRESSION] ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedBuffer.length / 1024 / 1024).toFixed(2)}MB`);

    next();
  } catch (error) {
    console.error('Error comprimiendo:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al procesar la imagen' 
    });
  }
}

module.exports = compressImage;
```

#### 2.3 Usar el Middleware en tu Ruta

**ANTES:**
```javascript
router.post('/upload', upload.single('image'), async (req, res) => {
  // ... código
});
```

**DESPUÉS:**
```javascript
const compressImage = require('./middleware/imageCompression'); // Ajusta la ruta

router.post('/upload', 
  upload.single('image'),
  compressImage, // ← Agregar este middleware
  async (req, res) => {
    // ... código para subir a S3
    // req.file.buffer ya está comprimido aquí
  }
);
```

---

## Ejemplo Completo de Ruta Actualizada

```javascript
const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const compressImage = require('./middleware/imageCompression');

const router = express.Router();
const s3Client = new S3Client({ 
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// ✅ Configuración actualizada
const upload = multer({
  storage: multer.memoryStorage(), // IMPORTANTE
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'), false);
    }
  }
});

// ✅ Ruta con compresión
router.post('/upload', 
  upload.single('image'),
  compressImage, // ← Middleware de compresión
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se proporcionó ningún archivo'
        });
      }

      // req.file.buffer ya está comprimido aquí
      const fileName = `images/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer, // Buffer ya comprimido
        ContentType: 'image/jpeg',
        ACL: 'public-read',
      });

      await s3Client.send(command);

      const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`;

      res.json({
        success: true,
        message: 'Imagen subida y comprimida exitosamente',
        url,
        size: req.file.size // Tamaño comprimido
      });

    } catch (error) {
      console.error('Error en upload:', error);
      res.status(500).json({
        success: false,
        message: 'Error al subir la imagen'
      });
    }
  }
);

module.exports = router;
```

---

## Checklist de Cambios

- [ ] Cambiar `fileSize` de 10MB a 20MB en Multer
- [ ] Cambiar `storage` a `multer.memoryStorage()`
- [ ] Instalar Sharp: `npm install sharp`
- [ ] Crear archivo `middleware/imageCompression.js`
- [ ] Agregar middleware `compressImage` en la ruta `/upload`
- [ ] Reiniciar el servidor backend

---

## Verificación

Después de hacer los cambios, prueba subir una imagen de más de 10MB. Debería:
1. ✅ Aceptar el archivo (hasta 20MB)
2. ✅ Comprimirlo automáticamente
3. ✅ Subirlo a S3 con el tamaño reducido

---

## Notas Importantes

⚠️ **Si Sharp da problemas de compilación:**
- En Windows: Puede necesitar Visual Studio Build Tools
- Alternativa: Usa `jimp` (más lento pero más compatible)
  ```bash
  npm install jimp
  ```

⚠️ **Si ya tienes `storage: multer.diskStorage()`:**
- Debes cambiarlo a `multer.memoryStorage()` para que funcione la compresión
- La compresión necesita el archivo en memoria, no en disco

---

## Archivos de Referencia

- `backend-middleware-imageCompression.js` - Middleware completo
- `backend-upload-route-example.js` - Ejemplo completo de ruta
- `BACKEND_UPLOAD_CONFIG.md` - Documentación detallada

