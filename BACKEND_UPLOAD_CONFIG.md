# Configuración de Upload de Imágenes - Backend

## Implementación: Opción 2 - Permitir Archivos Grandes y Comprimir Siempre

Esta configuración permite subir imágenes de hasta **20MB** y las comprime automáticamente antes de subirlas a S3.

### Ventajas
✅ Permite subir imágenes grandes sin restricciones estrictas
✅ Comprime todas las imágenes automáticamente
✅ Reduce costos de almacenamiento
✅ Mejora tiempos de carga
✅ Mejor experiencia de usuario

---

## 1. Instalación de Dependencias

```bash
npm install sharp
```

**Nota:** Si Sharp da problemas de compilación, puedes usar Jimp (más lento pero más compatible):
```bash
npm install jimp
```

---

## 2. Configuración de Multer

```javascript
const multer = require('multer');

// Configurar multer para almacenar en memoria (necesario para comprimir)
const upload = multer({
  storage: multer.memoryStorage(), // Almacenar en memoria, no en disco
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Validar tipos de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se permiten: JPEG, JPG, PNG, GIF, WEBP'), false);
    }
  }
});
```

---

## 3. Middleware de Compresión con Sharp

Crea un archivo `middleware/imageCompression.js`:

```javascript
const sharp = require('sharp');

/**
 * Comprime imágenes automáticamente antes de subirlas a S3
 * Configuración:
 * - Resolución máxima: 1920x1920px
 * - Calidad JPEG: 85%
 * - Mantiene proporción de aspecto
 */
async function compressImage(req, res, next) {
  // Si no hay archivo, continuar
  if (!req.file) {
    return next();
  }

  try {
    // Obtener metadatos de la imagen original
    const metadata = await sharp(req.file.buffer).metadata();
    const originalSize = req.file.size;
    
    console.log(`Imagen original: ${metadata.width}x${metadata.height}, ${(originalSize / 1024 / 1024).toFixed(2)}MB`);

    // Comprimir la imagen
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(1920, 1920, {
        fit: 'inside', // Mantener proporción, ajustar dentro del tamaño máximo
        withoutEnlargement: true // No agrandar imágenes pequeñas
      })
      .jpeg({ 
        quality: 85, // Calidad 85% (ajustable: 70-95)
        mozjpeg: true // Usar mozjpeg para mejor compresión
      })
      .toBuffer();

    const compressedSize = compressedBuffer.length;
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    
    console.log(`Imagen comprimida: ${(compressedSize / 1024 / 1024).toFixed(2)}MB (${compressionRatio}% reducción)`);

    // Actualizar el buffer y tamaño del archivo
    req.file.buffer = compressedBuffer;
    req.file.size = compressedSize;
    req.file.mimetype = 'image/jpeg'; // Siempre convertir a JPEG para consistencia

    // Guardar metadatos en req para logging o respuesta
    req.imageMetadata = {
      originalSize,
      compressedSize,
      compressionRatio: `${compressionRatio}%`,
      originalDimensions: `${metadata.width}x${metadata.height}`,
      compressedDimensions: metadata.width > metadata.height 
        ? `1920x${Math.round(1920 * metadata.height / metadata.width)}`
        : `${Math.round(1920 * metadata.width / metadata.height)}x1920`
    };

    next();
  } catch (error) {
    console.error('Error comprimiendo imagen:', error);
    // Si falla la compresión, continuar con el archivo original
    // O puedes retornar un error:
    return res.status(500).json({ 
      success: false, 
      message: 'Error al procesar la imagen. Por favor, intenta con otra imagen.' 
    });
  }
}

module.exports = compressImage;
```

---

## 4. Implementación Completa del Endpoint

Ejemplo completo en `routes/upload.js`:

```javascript
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const compressImage = require('../middleware/imageCompression');

const router = express.Router();

// Configurar cliente S3
const s3Client = new S3Client({ 
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Configurar multer
const upload = multer({
  storage: multer.memoryStorage(),
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

// Endpoint de upload simple
router.post('/upload', 
  upload.single('image'), // Middleware de multer
  compressImage, // Middleware de compresión
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se proporcionó ningún archivo'
        });
      }

      // Generar nombre único para el archivo
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `images/${timestamp}-${randomString}.jpg`;

      // Subir a S3
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read', // O usa políticas de bucket si prefieres
      });

      await s3Client.send(command);

      // Construir URL pública
      const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`;

      // Respuesta exitosa
      res.json({
        success: true,
        message: 'Imagen subida y comprimida exitosamente',
        url,
        size: req.file.size,
        metadata: req.imageMetadata || null
      });

    } catch (error) {
      console.error('Error en upload:', error);
      
      // Manejar errores específicos
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'El archivo es demasiado grande. Máximo 20MB'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al subir la imagen'
      });
    }
  }
);

// Endpoint de upload múltiple (opcional)
router.post('/upload/multiple',
  upload.array('images', 10), // Máximo 10 imágenes
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No se proporcionaron archivos'
        });
      }

      const uploadPromises = req.files.map(async (file, index) => {
        // Comprimir cada imagen
        const compressedBuffer = await sharp(file.buffer)
          .resize(1920, 1920, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 85, mozjpeg: true })
          .toBuffer();

        const fileName = `images/${Date.now()}-${index}-${Math.random().toString(36).substring(2, 15)}.jpg`;

        const command = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileName,
          Body: compressedBuffer,
          ContentType: 'image/jpeg',
          ACL: 'public-read',
        });

        await s3Client.send(command);

        return {
          url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`,
          key: fileName,
          size: compressedBuffer.length,
          mimetype: 'image/jpeg',
          originalName: file.originalname
        };
      });

      const results = await Promise.all(uploadPromises);

      res.json({
        success: true,
        message: `${results.length} imagen(es) subida(s) exitosamente`,
        images: results
      });

    } catch (error) {
      console.error('Error en upload múltiple:', error);
      res.status(500).json({
        success: false,
        message: 'Error al subir las imágenes'
      });
    }
  }
);

module.exports = router;
```

---

## 5. Variables de Entorno Necesarias

Agrega estas variables a tu archivo `.env`:

```env
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
S3_BUCKET_NAME=tu-bucket-name
```

---

## 6. Configuración Avanzada (Opcional)

### Ajustar Calidad y Resolución

Puedes modificar los valores en `middleware/imageCompression.js`:

```javascript
// Para imágenes de alta calidad (fotografías profesionales)
.resize(2560, 2560, { fit: 'inside', withoutEnlargement: true })
.jpeg({ quality: 90, mozjpeg: true })

// Para imágenes web estándar (recomendado)
.resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
.jpeg({ quality: 85, mozjpeg: true })

// Para imágenes optimizadas (máxima compresión)
.resize(1280, 1280, { fit: 'inside', withoutEnlargement: true })
.jpeg({ quality: 75, mozjpeg: true })
```

### Comprimir Solo Si Es Necesario

Si quieres comprimir solo imágenes grandes (>5MB):

```javascript
async function compressImage(req, res, next) {
  if (!req.file) {
    return next();
  }

  // Si la imagen es menor a 5MB, no comprimir
  if (req.file.size < 5 * 1024 * 1024) {
    return next();
  }

  // ... resto del código de compresión
}
```

### Mantener Formato Original

Si quieres mantener PNG para imágenes con transparencia:

```javascript
const metadata = await sharp(req.file.buffer).metadata();
const hasAlpha = metadata.hasAlpha; // true si tiene transparencia

if (hasAlpha) {
  // Mantener PNG con compresión
  compressedBuffer = await sharp(req.file.buffer)
    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer();
  req.file.mimetype = 'image/png';
} else {
  // Convertir a JPEG
  compressedBuffer = await sharp(req.file.buffer)
    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
  req.file.mimetype = 'image/jpeg';
}
```

---

## 7. Manejo de Errores Mejorado

```javascript
async function compressImage(req, res, next) {
  if (!req.file) {
    return next();
  }

  try {
    // Validar que es una imagen válida
    const metadata = await sharp(req.file.buffer).metadata();
    if (!metadata.width || !metadata.height) {
      return res.status(400).json({
        success: false,
        message: 'El archivo no es una imagen válida'
      });
    }

    // Comprimir
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    req.file.buffer = compressedBuffer;
    req.file.size = compressedBuffer.length;
    req.file.mimetype = 'image/jpeg';

    next();
  } catch (error) {
    console.error('Error comprimiendo imagen:', error);
    
    // Si es un error de formato, informar al usuario
    if (error.message.includes('Input buffer contains unsupported image format')) {
      return res.status(400).json({
        success: false,
        message: 'Formato de imagen no soportado'
      });
    }

    // Para otros errores, continuar con el archivo original
    next();
  }
}
```

---

## 8. Testing

Para probar la compresión:

```bash
# Subir una imagen grande (ej: 15MB)
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@large-image.jpg"

# Deberías recibir una respuesta con:
# - url: URL de la imagen comprimida en S3
# - size: Tamaño del archivo comprimido
# - metadata: Información sobre la compresión
```

---

## 9. Monitoreo y Logging

Agrega logging para monitorear la compresión:

```javascript
console.log(`[UPLOAD] Archivo: ${req.file.originalname}`);
console.log(`[UPLOAD] Tamaño original: ${(req.imageMetadata.originalSize / 1024 / 1024).toFixed(2)}MB`);
console.log(`[UPLOAD] Tamaño comprimido: ${(req.imageMetadata.compressedSize / 1024 / 1024).toFixed(2)}MB`);
console.log(`[UPLOAD] Reducción: ${req.imageMetadata.compressionRatio}`);
```

---

## Resumen de Configuración

✅ **Límite de upload:** 20MB
✅ **Compresión automática:** Todas las imágenes
✅ **Resolución máxima:** 1920x1920px
✅ **Calidad JPEG:** 85%
✅ **Formato final:** JPEG (excepto PNG con transparencia si se configura)

Esta configuración optimiza el balance entre calidad y tamaño de archivo.
