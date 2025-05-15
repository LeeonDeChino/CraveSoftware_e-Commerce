async function register() {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);
  alert("Revisa tu correo para confirmar el registro.");
}

async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  // Redirigir a catálogo
  window.location.href = "products.html";
}