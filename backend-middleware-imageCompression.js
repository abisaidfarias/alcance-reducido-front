/**
 * Middleware de Compresión de Imágenes
 * 
 * Este middleware comprime automáticamente todas las imágenes antes de subirlas a S3.
 * 
 * Instalación:
 * npm install sharp
 * 
 * Uso:
 * const compressImage = require('./middleware/imageCompression');
 * router.post('/upload', upload.single('image'), compressImage, async (req, res) => { ... });
 */

const sharp = require('sharp');

/**
 * Comprime imágenes automáticamente antes de subirlas a S3
 * 
 * Configuración:
 * - Resolución máxima: 1920x1920px
 * - Calidad JPEG: 85%
 * - Mantiene proporción de aspecto
 * - No agranda imágenes pequeñas
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
    
    console.log(`[COMPRESSION] Imagen original: ${metadata.width}x${metadata.height}, ${(originalSize / 1024 / 1024).toFixed(2)}MB`);

    // Comprimir la imagen
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(1920, 1920, {
        fit: 'inside', // Mantener proporción, ajustar dentro del tamaño máximo
        withoutEnlargement: true // No agrandar imágenes pequeñas
      })
      .jpeg({ 
        quality: 85, // Calidad JPEG 85% (ajustable: 70-95)
        mozjpeg: true // Usar mozjpeg para mejor compresión
      })
      .toBuffer();

    const compressedSize = compressedBuffer.length;
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    
    console.log(`[COMPRESSION] Imagen comprimida: ${(compressedSize / 1024 / 1024).toFixed(2)}MB (${compressionRatio}% reducción)`);

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
    console.error('[COMPRESSION] Error comprimiendo imagen:', error);
    
    // Si es un error de formato, informar al usuario
    if (error.message && error.message.includes('Input buffer contains unsupported image format')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Formato de imagen no soportado. Por favor, usa JPEG, PNG, GIF o WEBP.' 
      });
    }

    // Para otros errores, retornar error
    return res.status(500).json({ 
      success: false, 
      message: 'Error al procesar la imagen. Por favor, intenta con otra imagen.' 
    });
  }
}

module.exports = compressImage;

