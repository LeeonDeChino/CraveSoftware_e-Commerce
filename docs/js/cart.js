document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('cart-items');
  const totalTexto = document.getElementById('total');
  const vaciarBtn = document.getElementById('vaciar-carrito');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function renderCart() {
    tbody.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">El carrito está vacío.</td></tr>';
      totalTexto.textContent = 'Total: $0.00';
      return;
    }

    cart.forEach(item => {
      const subtotal = item.precio * item.quantity;
      total += subtotal;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.nombre}</td>
        <td>$${item.precio.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>$${subtotal.toFixed(2)}</td>
        <td><button class="eliminar" data-id="${item.id}">Eliminar</button></td>
      `;
      tbody.appendChild(tr);
    });

    totalTexto.textContent = `Total: $${total.toFixed(2)}`;
    activarEliminar();
  }

  function activarEliminar() {
    document.querySelectorAll('.eliminar').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.id;
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });
  }

  vaciarBtn.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      localStorage.removeItem('cart');
      cart = [];
      renderCart();
    }
  });

  renderCart();
});