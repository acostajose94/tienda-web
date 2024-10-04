// models/index.js
const { Sequelize } = require('sequelize');
require('dotenv').config();


const dialecto = process.env.NODE_ENV === 'production' 
    ? 'postgres' 
    : 'mysql';

// Configuración de Sequelize con las variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME,         // Nombre de la base de datos
  process.env.DB_USER,         // Usuario de la base de datos
  process.env.DB_PASSWORD,     // Contraseña de la base de datos
  {
    host: process.env.DB_HOST, // Host de la base de datos
    dialect: dialecto,          // Dialecto que estás usando (MySQL)
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
