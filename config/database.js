// models/index.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de Sequelize con las variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME,         // Nombre de la base de datos
  process.env.DB_USER,         // Usuario de la base de datos
  process.env.DB_PASSWORD,     // Contraseña de la base de datos
  {
    host: process.env.DB_HOST, // Host de la base de datos
    dialect: 'postgres',        // Cambia a 'mysql' si tu base de datos es MySQL
    port: process.env.DB_PORT,  // Puerto de la base de datos
  }
);

// Verificar la conexión con la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

module.exports = sequelize;
