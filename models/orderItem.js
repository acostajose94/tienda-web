const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderProducts = sequelize.define('OrderProducts', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });

  return OrderProducts;
};
