document.addEventListener('DOMContentLoaded', () => {
  const resumenDiv = document.getElementById('resumen-carrito');
  const totalP = document.getElementById('checkout-total');
  const form = document.getElementById('checkout-form');

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    resumenDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
    return;
  }

  let total = 0;
  resumenDiv.innerHTML = '';

  cart.forEach(item => {
    const subtotal = item.precio * item.quantity;
    total += subtotal;

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('checkout-item');
    itemDiv.innerHTML = `
      <p><strong>${item.nombre}</strong> × ${item.quantity}</p>
      <p>Subtotal: $${(subtotal).toFixed(2)}</p>
    `;
    resumenDiv.appendChild(itemDiv);
  });

  totalP.textContent = `Total: $${total.toFixed(2)}`;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const metodopago = document.getElementById('metodopago').value;

    if (!nombre || !direccion || !metodopago) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const { data: { user }, error } = await supabase.auth.getUser();

  if (!user) {
    alert('Debes iniciar sesión para completar tu compra.');
    return;
  }

    // Insertar pedido
    const { data: pedido, error: pedidoError } = await supabase
  .from('pedido')
  .insert([{
    id_cliente: user.id,
    fecha: new Date().toISOString(),
    total: total,
    estado: 'Pendiente'
  }])
  .select()
  .single();

    if (pedidoError) {
      console.error('Error al crear pedido:', pedidoError);
      alert('Ocurrió un error al crear el pedido.');
      return;
    }

    // Insertar detalles del pedido
    const detalles = cart.map(item => ({
      id_pedido: pedido.id_pedido,
      id_producto: item.id,
      cantidad: item.quantity,
      preciounitario: item.precio
    }));

    const { error: detalleError } = await supabase
      .from('detallepedido')
      .insert(detalles);

    if (detalleError) {
      console.error('Error al guardar detalles del pedido:', detalleError);
      alert('Error al guardar los detalles del pedido.');
      return;
    }

    // Simulación de Stripe y envío de correo
    localStorage.removeItem('cart');
    window.location.href = '/CraveSoftware_e-Commerce/stripe-simulation.html';
  });
});