document.addEventListener('DOMContentLoaded', async () => {
  const historialSection = document.getElementById('historial');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    historialSection.innerHTML = '<p>Debes iniciar sesión para ver tu historial.</p>';
    return;
  }

  // Obtener pedidos del usuario
  const { data: pedidos, error: pedidosError } = await supabase
    .from('pedido')
    .select('*')
    .eq('id_cliente', user.id)
    .order('fecha', { ascending: false });

  if (pedidosError || pedidos.length === 0) {
    historialSection.innerHTML = '<p>No hay pedidos registrados.</p>';
    return;
  }

  // Mostrar pedidos
  historialSection.innerHTML = '';
  for (const pedido of pedidos) {
    const { data: detalles, error: detalleError } = await supabase
      .from('detallepedido')
      .select('cantidad, preciounitario, producto:id_producto(nombre)')
      .eq('id_pedido', pedido.id_pedido);

    if (detalleError) continue;

    const total = detalles.reduce((sum, d) => sum + d.preciounitario * d.cantidad, 0);
    const fecha = new Date(pedido.fecha).toLocaleDateString();

    const pedidoDiv = document.createElement('div');
    pedidoDiv.classList.add('pedido');
    pedidoDiv.innerHTML = `
      <h3>Pedido #${pedido.id_pedido} - ${fecha}</h3>
      <ul>
        ${detalles.map(d => `
          <li>${d.producto.nombre} × ${d.cantidad} - $${(d.preciounitario * d.cantidad).toFixed(2)}</li>
        `).join('')}
      </ul>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      <hr/>
    `;

    historialSection.appendChild(pedidoDiv);
  }
});