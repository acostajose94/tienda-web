const { Cart, CartItem, Product } = require('../models');

// Controlador para agregar o actualizar la cantidad de un producto en el carrito
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;  // Supongamos que tienes el usuario autenticado

  try {
    // Busca o crea el carrito del usuario
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId, total: 0 });
    }

    // Verifica si el producto existe en la base de datos
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Busca si el producto ya está en el carrito
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId }
    });

    if (!cartItem) {
      // Si no existe en el carrito, crea un nuevo CartItem
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
      });
    } else {
      // Si ya existe, actualiza la cantidad
      cartItem.quantity = quantity;

      // Si la cantidad es 0 o menos, elimina el producto del carrito
      if (quantity <= 0) {
        await cartItem.destroy();
      } else {
        await cartItem.save();
      }
    }

    // Recalcula el total del carrito basado en todos los CartItems
    const updatedCartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [Product],
    });

    // Recalcula el precio total del carrito
    cart.total = updatedCartItems.reduce((total, item) => {
      return total + item.Product.price * item.quantity;
    }, 0);

    // Guarda el nuevo total del carrito
    await cart.save();

    // Retorna el carrito actualizado y el artículo del carrito
    res.status(200).json({ cart, cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al agregar el producto al carrito.' });
  }
};

// Controlador para obtener el carrito del usuario autenticado
const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ where: { userId }, include: [{ model: CartItem, include: [Product] }] });
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al obtener el carrito.' });
  }
};

// Controlador para eliminar un producto del carrito
const removeItemFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (!cartItem) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    await cartItem.destroy();

    const updatedCartItems = await CartItem.findAll({ where: { cartId: cart.id }, include: [Product] });
    cart.total = updatedCartItems.reduce((total, item) => total + item.Product.price * item.quantity, 0);
    await cart.save();

    res.status(200).json({ message: 'Producto eliminado del carrito.', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al eliminar el producto del carrito.' });
  }
};

// Controlador para vaciar el carrito
const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });
    cart.total = 0;
    await cart.save();

    res.status(200).json({ message: 'Carrito vaciado.', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al vaciar el carrito.' });
  }
};
module.exports = {
  addToCart,
  getCart,
  removeItemFromCart,
  clearCart,
};

