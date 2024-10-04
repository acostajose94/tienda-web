const express = require('express');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const paymentRoutes = require('./paymentRoutes');
const categoryRoutes = require('./categoryRoutes'); // Corregido el nombre
const router = express.Router();

// Rutas públicas
router.use('/auth', authRoutes);

// Rutas protegidas o adicionales (productos, carrito, pedidos, etc.)
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
//router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/categories', categoryRoutes); // Corregido el nombre
console.log("routes");
module.exports = router;
