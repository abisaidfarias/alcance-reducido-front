/**
 * Ejemplo Completo de Ruta de Upload con Compresión
 * 
 * Este es un ejemplo completo de cómo implementar el endpoint de upload
 * con compresión automática de imágenes.
 * 
 * Instalación:
 * npm install multer sharp @aws-sdk/client-s3
 * 
 * Variables de entorno necesarias:
 * - AWS_REGION
 * - AWS_ACCESS_KEY_ID
 * - AWS_SECRET_ACCESS_KEY
 * - S3_BUCKET_NAME
 */

const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const compressImage = require('./middleware/imageCompression'); // Ajusta la ruta según tu estructura

const router = express.Router();

// Configurar cliente S3
const s3Client = new S3Client({ 
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Configurar multer para almacenar en memoria
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

/**
 * Endpoint de upload simple
 * POST /api/upload
 * 
 * Body (form-data):
 * - image: archivo de imagen (hasta 20MB)
 * - type: (opcional) tipo de archivo (ej: 'testReport')
 */
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
      const fileExtension = req.file.mimetype === 'image/png' ? 'png' : 'jpg';
      const fileName = `images/${timestamp}-${randomString}.${fileExtension}`;

      // Subir a S3
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read', // O usa políticas de bucket si prefieres
      });

      await s3Client.send(command);

      // Construir URL pública
      const region = process.env.AWS_REGION || 'us-east-1';
      const url = `https://${process.env.S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${fileName}`;

      // Respuesta exitosa
      res.json({
        success: true,
        message: 'Imagen subida y comprimida exitosamente',
        url,
        size: req.file.size,
        metadata: req.imageMetadata || null
      });

    } catch (error) {
      console.error('[UPLOAD] Error:', error);
      
      // Manejar errores específicos
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'El archivo es demasiado grande. Máximo 20MB'
        });
      }

      if (error.message && error.message.includes('Tipo de archivo no permitido')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al subir la imagen'
      });
    }
  }
);

/**
 * Endpoint de upload múltiple (opcional)
 * POST /api/upload/multiple
 * 
 * Body (form-data):
 * - images: array de archivos de imagen (máximo 10)
 */
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

      const sharp = require('sharp');
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

        const region = process.env.AWS_REGION || 'us-east-1';
        const url = `https://${process.env.S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${fileName}`;

        return {
          url,
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
      console.error('[UPLOAD MULTIPLE] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error al subir las imágenes'
      });
    }
  }
);

module.exports = router;

