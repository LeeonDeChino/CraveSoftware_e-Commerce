async function mostrarCarrito() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const container = document.getElementById('cart-container');
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Tu carrito está vacío.</p>';
    return;
  }

  let total = 0;

  for (const item of cart) {
    const { data: producto, error } = await supabase
      .from('Producto')
      .select('*')
      .eq('ID_Producto', item.ID_Producto)
      .single();

    if (error || !producto) continue;

    const subtotal = producto.Precio * item.Cantidad;
    total += subtotal;

    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <h3>${producto.Nombre}</h3>
      <p>Cantidad: ${item.Cantidad}</p>
      <p>Precio unitario: $${producto.Precio}</p>
      <p>Subtotal: $${subtotal}</p>
      <button onclick="eliminarDelCarrito(${item.ID_Producto})">Eliminar</button>
    `;
    container.appendChild(div);
  }

  const totalDiv = document.createElement('div');
  totalDiv.innerHTML = `<h3>Total del pedido: $${total}</h3>`;
  container.appendChild(totalDiv);
}

function eliminarDelCarrito(id) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.ID_Producto !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  mostrarCarrito();
}

async function confirmarPedido() {
  const user = supabase.auth.user();

  if (!user) {
    alert('Debes iniciar sesión para confirmar el pedido.');
    return;
  }

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert('El carrito está vacío.');
    return;
  }

  const { data: cliente, error: clienteError } = await supabase
    .from('Cliente')
    .select('ID_Cliente')
    .eq('Correo', user.email)
    .single();

  if (clienteError || !cliente) {
    alert('No se encontró un cliente asociado a este correo.');
    return;
  }

  // Calcular total
  let total = 0;
  for (const item of cart) {
    const { data: producto } = await supabase
      .from('Producto')
      .select('Precio')
      .eq('ID_Producto', item.ID_Producto)
      .single();
    total += producto.Precio * item.Cantidad;
  }

  // Insertar pedido
  const { data: pedido, error: pedidoError } = await supabase
    .from('Pedido')
    .insert([{
      Fecha: new Date().toISOString(),
      Total: total,
      Estado: 'Pendiente',
      ID_Cliente: cliente.ID_Cliente
    }])
    .select()
    .single();

  if (pedidoError) {
    console.error(pedidoError);
    alert('Error al crear el pedido.');
    return;
  }

  // Insertar detalles
  for (const item of cart) {
    const { data: producto } = await supabase
      .from('Producto')
      .select('Precio')
      .eq('ID_Producto', item.ID_Producto)
      .single();

    await supabase.from('DetallePedido').insert([{
      ID_Pedido: pedido.ID_Pedido,
      ID_Producto: item.ID_Producto,
      Cantidad: item.Cantidad,
      PrecioUnitario: producto.Precio,
      VarianteSeleccionada: null // Por ahora null
    }]);
  }

  alert('¡Pedido confirmado con éxito!');
  localStorage.removeItem('cart');
  window.location.href = 'history.html'; // Redirige al historial
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', mostrarCarrito);