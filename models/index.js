const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Conexión a la base de datos

// Importar los modelos
const User = require('./user')(sequelize);
const Product = require('./product')(sequelize);
const Category = require('./category')(sequelize);
const Cart = require('./cart')(sequelize);
const CartItem = require('./cartItem')(sequelize);
const Order = require('./order')(sequelize);
const OrderItem = require('./orderItem')(sequelize);
const Payment = require('./payment')(sequelize);

// Definir las relaciones entre los modelos

// Relación User -> Order (Un usuario puede tener muchas órdenes)
User.hasMany(Order, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
Order.belongsTo(User, {
  foreignKey: 'userId'
});

// Relación Product -> Category (Un producto pertenece a una categoría)
Category.hasMany(Product, {
  foreignKey: 'categoryId'
});
Product.belongsTo(Category, {
  foreignKey: 'categoryId'
});

// Relación Cart -> User (Un carrito pertenece a un usuario)
User.hasOne(Cart, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
Cart.belongsTo(User, {
  foreignKey: 'userId'
});

// Relación Cart -> CartItem (Un carrito puede tener muchos productos)
Cart.hasMany(CartItem, {
  foreignKey: 'cartId',
  onDelete: 'CASCADE'
});
CartItem.belongsTo(Cart, {
  foreignKey: 'cartId'
});

// Relación Product -> CartItem (Un producto puede estar en muchos carritos)
Product.hasMany(CartItem, {
  foreignKey: 'productId'
});
CartItem.belongsTo(Product, {
  foreignKey: 'productId'
});

// Relación Order -> OrderItem (Una orden puede tener muchos productos)
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  onDelete: 'CASCADE'
});
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId'
});

// Relación Product -> OrderItem (Un producto puede estar en muchas órdenes)
Product.hasMany(OrderItem, {
  foreignKey: 'productId'
});
OrderItem.belongsTo(Product, {
  foreignKey: 'productId'
});


// Nueva relación: Order -> Payment (Una orden puede tener un pago)
Order.hasOne(Payment, {
  foreignKey: 'orderId',
  onDelete: 'CASCADE'
});
Payment.belongsTo(Order, {
  foreignKey: 'orderId'
});


// Exportar todos los modelos junto con la conexión de Sequelize
module.exports = {
  sequelize,
  User,
  Product,
  Category,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment
};
