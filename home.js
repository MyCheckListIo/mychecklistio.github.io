// Mapeo de secciones a URLs
const secciones = {
  crearLista: 'crearLista.html',
  listasGuardadas: 'listasGuardadas.html',
  activarLista: 'activarLista.html',
  stats: 'stats.html',
  tienda: 'tienda.html',
};

function navegarA(seccion) {
  // Verificar si la sección proporcionada está en el mapeo
  if (seccion in secciones) {
    const url = secciones[seccion];
    
    // Puedes redirigir a la página correspondiente
    window.location.href = url;
  } else {
    // Manejar sección no válida (por ejemplo, mostrar un mensaje de error)
    console.error('Sección no válida:', seccion);
  }
}

const usuario = {
  nombre: "Usuario Ejemplo",
  logueado: true,
  tokens: 50,
  gemas: 10,
};

function cargarDetallesUsuario() {
  const userDetailsContainer = document.getElementById('userDetails');
  if (usuario.logueado) {
    userDetailsContainer.innerHTML = `
      <p>Bienvenido, ${usuario.nombre}!</p>
      <p>Tokens: ${usuario.tokens}</p>
      <p>Gemas: ${usuario.gemas}</p>
    `;
  } else {
    userDetailsContainer.innerHTML = `
      <p>¡Inicia sesión para disfrutar de todas las funciones!</p>
      <button class="login-button" onclick="iniciarConEmail()">Iniciar sesión</button>
    `;
  }
}

function cerrarSesion() {
  // Implementa la lógica para cerrar sesión (simulado)
  console.log('Cerrando sesión...');
  // Redirige a la página de inicio de sesión o a donde prefieras
  window.location.href = 'index.html';
}

// Llamada a la función al cargar la página
cargarDetallesUsuario();
