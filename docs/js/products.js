document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.getElementById('productos-container');
  const mensaje = document.getElementById('mensaje-vacio');
  const buscador = document.getElementById('buscador');

  let productos = [];

  try {
    const { data, error } = await supabase.from('producto').select('*');
    if (error) throw error;

    productos = data;
    mostrarProductos(productos);
  } catch (err) {
    console.error('❌ Error al cargar productos:', err.message);
  }

  function mostrarProductos(lista) {
    contenedor.innerHTML = '';
    if (lista.length === 0) {
      mensaje.style.display = 'block';
      return;
    }
    mensaje.style.display = 'none';

    lista.forEach(prod => {
      const div = document.createElement('div');
      div.className = 'producto';
      div.innerHTML = `
        <h3>${prod.nombre}</h3>
        <p>${prod.descripcion}</p>
        <p><strong>$${prod.precio}</strong></p>
      `;
      contenedor.appendChild(div);
    });
  }

  buscador.addEventListener('input', e => {
    const texto = e.target.value.toLowerCase();
    const filtrados = productos.filter(p =>
      p.nombre.toLowerCase().includes(texto) || p.descripcion.toLowerCase().includes(texto)
    );
    mostrarProductos(filtrados);
  });
});
