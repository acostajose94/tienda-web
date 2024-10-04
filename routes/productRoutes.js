const express = require('express');
const { getProducts, createProduct, updateProducto, deleteProducto, getProductoById } = require('../controllers/productController');
const authenticate = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/adminMiddleware');
const upload = require('../middlewares/upload');  // Importar el middleware upload

const router = express.Router();

// Rutas abiertas para cualquier usuario autenticado
router.get('/', getProducts);
router.get('/:id', getProductoById);

// Rutas protegidas (solo admins pueden crear productos)
router.post('/', authenticate, isAdmin, upload.single('image'), createProduct);
router.put('/:id', authenticate, isAdmin, upload.single('image'), updateProducto);
router.delete('/:id', authenticate, isAdmin, deleteProducto);

module.exports = router;
