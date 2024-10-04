require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const { Order, Payment, CartItem, Product } = require('../models'); // Asegúrate de incluir CartItem aquí


const successUrl = process.env.NODE_ENV === 'production' 
    ? 'https://tienda-web-gnvj.onrender.com/success.html' 
    : 'http://localhost:5000/success';

const cancelUrl = process.env.NODE_ENV === 'production' 
    ? 'https://tienda-web-gnvj.onrender.com/cancel.html' 
    : 'http://localhost:5000/cancel';







const handlePaymentSuccess = async (req, res) => {
  const { sessionId } = req.body;

  try {
    // Recuperar la sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Actualiza el pago a 'completed' en la base de datos
      const payment = await Payment.findOne({ where: { transactionId: sessionId } });
      if (payment) {
        payment.status = 'completed';
        await payment.save();

        // Obtener el carrito de la compra para el usuario (o puedes guardar el cartId en el pago)
        const cartItems = await CartItem.findAll({
          where: { cartId: payment.cartId }, // supondremos que el cartId está almacenado en la tabla de Payment
          include: [{
            model: Product,
            attributes: ['id', 'name', 'price'], // Asegúrate de obtener el precio actual del producto
          }],
        });

        // Crear la orden en la base de datos
        const order = await Order.create({
          userId: payment.userId, // ID del usuario que hizo el pago
          totalPrice: payment.amount, // Total pagado
          status: 'pending', // Estado inicial de la orden
        });

        // Crear los items en la tabla intermedia orderItem
        for (const item of cartItems) {
          await OrderItem.create({
            orderId: order.id,       // ID de la orden
            productId: item.Product.id,   // ID del producto
            price: item.Product.price, // Guardamos el precio actual del producto
            quantity: item.quantity,  // Cantidad del producto
          });

          // Opcional: actualizar el stock del producto si es necesario
          const product = await Product.findByPk(item.Product.id);
          if (product) {
            product.stock -= item.quantity; // Reducir stock en función de la cantidad comprada
            await product.save();
          }
        }

        // Puedes limpiar el carrito después de crear la orden
        await CartItem.destroy({ where: { cartId: payment.cartId } });

        res.json({ message: 'Pago y creación de orden completados con éxito' });
      }
    } else {
      res.status(400).json({ message: 'El pago no fue completado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


const createPayment= async(req,res)=>{
  
  const { cartId } = req.body;
  
  // Comprobar si cartId es undefined
  if (!cartId) {
    return res.status(400).json({ error: 'El cartId es obligatorio' });
  }
  try {
    // Paso 1: Buscar los elementos del carrito por cartId
    const cartItems = await CartItem.findAll({
        where: { cartId: cartId },
        include: [{
            model: Product,
            attributes: ['id', 'name', 'price'], 
        }],
    });

    console.log(JSON.stringify(cartItems, null, 2)); 

    // Paso 2: Crear un array de items para Stripe
    const line_items = cartItems.map(item => ({
        price_data: {
            currency: 'usd', // Cambia a tu moneda
            product_data: {
                name: item.Product.name,
                // Puedes agregar más detalles como descripción o imagen aquí
            },
            unit_amount: item.Product.price * 100, // Stripe espera el monto en centavos
        },
        quantity: item.quantity, // Asegúrate de que quantity exista en tu CartItem
    }));

    // Paso 3: Crear la sesión de checkout en Stripe
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'], // Métodos de pago aceptados
        line_items: line_items,
        mode: 'payment', // Puedes cambiar a 'subscription' si es necesario
        success_url: successUrl, // URL de éxito
        cancel_url: cancelUrl, // URL de cancelación
    });
    // await Payment.create({
    //   amount: order.totalPrice,
    //   paymentMethod: 'stripe',
    //   status: 'pending',
    //   transactionId: session.id,
    //   orderId: order.id,
    //   userId: req.user.id, // Supón que tienes autenticación
    // });
    // Paso 4: Devolver la sesión de Stripe
    // res.status(200).json({ id: session.id });
    res.json({ id: session.id });
} catch (error) {
    console.error('Error en el proceso de pago:', error);
    res.status(500).json({ error: 'Error al crear la sesión de pago' });
}
};
module.exports = {
   
  handlePaymentSuccess,
  createPayment
};
