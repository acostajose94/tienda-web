const express = require('express');
const { register, login } = require('../controllers/authController');
const { check } = require('express-validator');
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', [
  check('username', 'El nombre de usuario es obligatorio').not().isEmpty(), // Cambiar 'name' a 'username'
  check('email', 'Proporciona un email válido').isEmail(),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
], register);

// Ruta para iniciar sesión
router.post('/login', [
  check('email', 'Proporciona un email válido').isEmail(),
  check('password', 'La contraseña es obligatoria').exists()
], login);

module.exports = router;
