// models/user.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Asegura que no haya usuarios duplicados
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Asegura que no haya emails duplicados
      validate: {
        isEmail: true, // Validación de formato de email
      },
    },
    
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Valor por defecto
    },
  });

  // Método para ocultar la contraseña al convertir a JSON
  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password; // Elimina la contraseña de la respuesta
    return values;
  };

  return User;
};
