const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticate = require('../middlewares/authMiddleware'); // Supón que tienes autenticación

// Ruta para crear una sesión de pago
//router.post('/create-checkout-session', authenticate, paymentController.createCheckoutSession);

router.post('/createpayment',paymentController.createPayment)

// Ruta para manejar la confirmación de pago (puede ser un webhook o una petición explícita)
router.post('/payment-success', paymentController.handlePaymentSuccess);

module.exports = router;
