const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../middlewares/authMiddleware');

// Ruta para crear una nueva orden de compra
router.post('/', authenticate, orderController.createOrder);

// Ruta para obtener todas las órdenes de un usuario
router.get('/', authenticate, orderController.getUserOrders);

// Ruta para obtener una orden específica por ID
router.get('/:orderId', authenticate, orderController.getOrderById);

// Ruta para cancelar una orden
router.delete('/:orderId', authenticate, orderController.cancelOrder);

module.exports = router;
