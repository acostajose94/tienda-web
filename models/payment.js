const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['credit_card', 'paypal', 'culqi']], // Agrega otros métodos de pago según tu necesidad
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending', // El estado puede ser 'pending', 'completed', 'failed'
      validate: {
        isIn: [['pending', 'completed', 'failed']],
      },
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true, // Puede ser opcional si no tienes un ID de transacción inicialmente
    },
  });

  // Relaciones con otras entidades
  Payment.associate = (models) => {
    Payment.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order',
      onDelete: 'CASCADE', // Elimina el pago si se elimina la orden
    });
    Payment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE', // Elimina el pago si se elimina el usuario
    });
  };

  return Payment;
};
