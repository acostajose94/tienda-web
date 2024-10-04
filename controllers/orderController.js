const { Order, CartItem, Product } = require('../models');

const createOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    // Obtener el carrito del usuario
    const cartItems = await CartItem.findAll({ where: { userId }, include: [Product] });
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío.' });
    }

    // Crear la orden de compra
    const totalPrice = cartItems.reduce((total, item) => total + item.Product.price * item.quantity, 0);
    const order = await Order.create({ userId, totalPrice });

    // Procesar cada ítem del carrito y asociarlo a la orden
    for (const item of cartItems) {
      await order.addProduct(item.Product, { through: { quantity: item.quantity } });
      // Opcional: Actualizar stock de productos
      item.Product.stock -= item.quantity;
      await item.Product.save();
    }

    // Limpiar el carrito después de la compra
    await CartItem.destroy({ where: { userId } });

    res.status(201).json({ message: 'Orden creada con éxito.', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la orden.' });
  }
};

const getUserOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.findAll({ where: { userId }, include: [Product] });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las órdenes.' });
  }
};

const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  try {
    const order = await Order.findOne({ where: { id: orderId, userId }, include: [Product] });
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada.' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la orden.' });
  }
};

const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  try {
    const order = await Order.findOne({ where: { id: orderId, userId } });
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada.' });
    }

    // Cancelar la orden
    await order.destroy();
    res.status(200).json({ message: 'Orden cancelada.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al cancelar la orden.' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
};
