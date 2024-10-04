const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');
const { sequelize } = require('./models'); // Extraer la instancia de sequelize

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api', routes);

// app.get("/", (req, res) => {
//   res.json({ message: "bienvenido a la aplicacion de back" });
// });
app.use(express.static('public'));
// Manejo de errores para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Conectar a la base de datos y sincronizar los modelos
sequelize.sync()
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar con la base de datos:', error);
  });
