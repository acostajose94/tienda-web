const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');  // Middleware de autenticación
const isAdmin = require('../middlewares/adminMiddleware');     // Middleware de autorización
const categoryController = require('../controllers/categoryController.js');

// Ruta para crear una nueva categoría
router.post('/',categoryController.createCategory);

// Ruta para obtener todas las categorías
router.get('/', categoryController.getAllCategories);

// Ruta para obtener una categoría por ID
router.get('/:id', categoryController.getCategoryById);

// Ruta para actualizar una categoría por ID
router.put('/:id', categoryController.updateCategory);

// Ruta para eliminar una categoría por ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
