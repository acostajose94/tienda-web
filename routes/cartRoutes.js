const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticate = require('../middlewares/authMiddleware');

// Ruta para verificar si la API está funcionando
router.get("/", (req, res) => {
    res.json({ message: "Bienvenido a la aplicación de backend" });
});

// Ruta para agregar productos al carrito (con autenticación)
router.post('/add', authenticate, cartController.addToCart);

// Ruta para obtener el carrito del usuario autenticado
router.get('/list', authenticate, cartController.getCart);

// Ruta para eliminar un producto específico del carrito
router.delete('/item/:productId', authenticate, cartController.removeItemFromCart);

// Ruta para vaciar el carrito
router.delete('/clear', authenticate, cartController.clearCart);

module.exports = router;
