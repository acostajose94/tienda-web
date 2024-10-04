const stripe2 = Stripe('pk_test_51PxIXo2NMOaW4kiZqMfKufX9ou9wboVGb5f6CD10Pd50CNOvs5XkNkrd9a6GtPrXwCbKNGQhd3wd98U4GZ96Re9g00rtNL3hmZ');
const cartId = "2"; // Cambia a 'cartId' para que coincida con tu controlador
const checkoutButton = document.getElementById('checkout-button');

checkoutButton.addEventListener('click', () => {
  fetch('/api/payments/createpayment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }, 
    body: JSON.stringify({ cartId }), // Cambia 'carteraid' a 'cartId'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud de pago');
    }
    return response.json();
  })
  .then(session => {
    return stripe2.redirectToCheckout({ sessionId: session.id });
  })
  .then(result => {
    if (result.error) {
      alert(result.error.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error al iniciar el pago: ' + error.message); // Agrega un mensaje de alerta más amigable
  });
});
