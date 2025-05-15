async function loadProducts() {
  const { data: products, error } = await supabase
    .from('Producto')
    .select('*')
    .order('Nombre', { ascending: true }); // Ordenar por nombre de producto

  if (error) {
    console.error(error);
    alert('Error al cargar los productos.');
    return;
  }

  const productsContainer = document.getElementById('products-container');
  productsContainer.innerHTML = ''; // Limpiar contenido previo

  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.innerHTML = `
      <h3>${product.Nombre}</h3>
      <p>${product.Descripción}</p>
      <p>Precio: $${product.Precio}</p>
      <p>Stock: ${product.Stock}</p>
      <button onclick="addToCart(${product.ID_Producto})">Agregar al carrito</button>
    `;
    productsContainer.appendChild(productDiv);
  });
}

// Llamar a la función para cargar productos cuando la página se haya cargado
document.addEventListener('DOMContentLoaded', loadProducts);

// Función para agregar productos al carrito (por ahora, solo en localStorage)
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingProduct = cart.find(item => item.ID_Producto === productId);
  if (existingProduct) {
    existingProduct.Cantidad += 1;
  } else {
    cart.push({ ID_Producto: productId, Cantidad: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Producto agregado al carrito');
}

// Función de logout
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html"; // Redirigir al login
}