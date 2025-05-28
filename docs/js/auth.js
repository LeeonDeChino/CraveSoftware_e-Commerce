document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registroForm = document.getElementById('registro-form');
  const recuperarForm = document.getElementById('recuperar-form');
  const msg = document.getElementById('auth-msg');
  const titulo = document.querySelector('main.auth h1');

  const show = (form) => {
  loginForm.style.display = 'none';
  registroForm.style.display = 'none';
  recuperarForm.style.display = 'none';
  form.style.display = 'block';
  msg.textContent = '';

  if (form === loginForm) titulo.textContent = 'Login';
  else if (form === registroForm) titulo.textContent = 'Registro';
  else if (form === recuperarForm) titulo.textContent = 'Recuperar contraseña';
};

  document.getElementById('registro-link').onclick = () => show(registroForm);
  document.getElementById('login-link').onclick = () => show(loginForm);
  document.getElementById('recuperar-link').onclick = () => show(recuperarForm);
  document.getElementById('volver-login').onclick = () => show(loginForm);

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });
if (error) return msg.textContent = `❌ ${error.message}`;

// Verificar si el cliente ya existe
const { data: clienteExistente, error: errorCliente } = await supabase
  .from('cliente')
  .select('id')
  .eq('id', user.id)
  .single();

if (errorCliente && errorCliente.code !== 'PGRST116') {
  console.error('Error al buscar cliente:', errorCliente);
  msg.textContent = '❌ Error al validar cliente.';
  return;
}

// Insertar si no existe
if (!clienteExistente) {
  const { error: insertError } = await supabase
    .from('cliente')
    .insert([{ id: user.id, correo: user.email }]);

  if (insertError) {
    console.error('Error al crear cliente:', insertError);
    msg.textContent = '❌ Error al crear cliente.';
    return;
  }
}

// Redirige si todo fue exitoso
window.location.href = '/CraveSoftware_e-Commerce/products.html';
  });

  registroForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = registroForm['registro-email'].value;
    const password = registroForm['registro-password'].value;

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return msg.textContent = `❌ ${error.message}`;

    msg.textContent = '✅ Registro exitoso. Revisa tu correo para confirmar la cuenta.';
  });

  recuperarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = recuperarForm['recuperar-email'].value;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/CraveSoftware_e-Commerce/reset-password.html`,
    });

    if (error) return msg.textContent = `❌ ${error.message}`;
    msg.textContent = '📩 Se ha enviado un correo para restablecer tu contraseña.';
  });
});