const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Guardar en la carpeta 'uploads'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Renombrar el archivo
  },
});

// Filtro de archivos para permitir solo imágenes JPEG, JPG y PNG
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes con formato JPEG, JPG o PNG'));
  }
};

// Configuración de `multer`
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limitar a 5MB por imagen
  fileFilter: fileFilter,
});

// Exporta el middleware de `multer`
module.exports = upload;
