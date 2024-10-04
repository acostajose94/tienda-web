const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cart = sequelize.define('Cart', {
    total: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  });

  return Cart;
};
