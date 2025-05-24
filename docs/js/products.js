document.addEventListener('DOMContentLoaded', async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = '/CraveSoftware_e-Commerce/index.html';
    return;
  }

  const contenedor = document.getElementById('productos-container');
  const mensaje = document.getElementById('mensaje-vacio');
  const buscador = document.getElementById('buscador');
  const userEmailSpan = document.getElementById('user-email');
  const logoutButton = document.getElementById('logout-button');

  userEmailSpan.textContent = user.email;

  logoutButton.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/CraveSoftware_e-Commerce/index.html';
  });

  let productos = [];

  try {
    const { data, error } = await supabase.from('producto').select('*');
    if (error) throw error;
    productos = data;
    mostrarProductos(productos);
  } catch (err) {
    console.error('❌ Error al cargar productos:', err.message);
  }

  //Function mostrar productos

  function mostrarProductos(lista) {
  contenedor.innerHTML = '';
  if (lista.length === 0) {
    mensaje.style.display = 'block';
    return;
  }
  mensaje.style.display = 'none';

  // Diccionario que relaciona producto → imagen
  const imagenes = {
    'Camiseta': '/CraveSoftware_e-Commerce/assets/shirtLogo.png',
    'Hoodie': '/CraveSoftware_e-Commerce/assets/hoodieLogo.png',
    'Taza': '/CraveSoftware_e-Commerce/assets/cupLogo.png',
    'Gorra': '/CraveSoftware_e-Commerce/assets/capLogo.png',
    'Sticker Pack': '/CraveSoftware_e-Commerce/assets/stickerpackLogo.png'
  };

  lista.forEach(prod => {
    const rutaImagen = imagenes[prod.nombre] || '/CraveSoftware_e-Commerce/assets/placeholder.png';

    const div = document.createElement('div');
    div.className = 'producto';
    div.innerHTML = `
      <img src="${rutaImagen}" alt="${prod.nombre}" class="producto-img" />
      <h3>${prod.nombre}</h3>
      <p>${prod.descripción}</p>
      <p><strong>$${prod.precio}</strong></p>
      <button class="add-to-cart" data-id="${prod.id_producto}" data-nombre="${prod.nombre}" data-precio="${prod.precio}">
        Agregar al carrito
      </button>
    `;
    contenedor.appendChild(div);
  });
    // Activar botones luego de renderizar
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.id;
        const nombre = button.dataset.nombre;
        const precio = parseFloat(button.dataset.precio);
        addToCart(id, nombre, precio);
      });
    });
  }

  buscador.addEventListener('input', e => {
    const texto = e.target.value.toLowerCase();
    const filtrados = productos.filter(p =>
      p.Nombre.toLowerCase().includes(texto) || p.Descripción.toLowerCase().includes(texto)
    );
    mostrarProductos(filtrados);
  });

  function addToCart(id, nombre, precio) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, nombre, precio, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`🛒 ${nombre} agregado al carrito`);
  }
});