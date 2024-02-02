// Mock de datos del usuario (puedes obtener estos datos de tu sistema de autenticación)
const usuario = {
  nombre: "Usuario Ejemplo",
  logueado: true,
  tokens: 50,
  gemas: 10,
};

// Función para cargar los detalles del usuario en el header
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
      <button onclick="iniciarConEmail()">Iniciar sesión</button>
    `;
  }
}

// Función para volver a la página principal
function volverAHome() {
  // Puedes redirigir a la página principal o ejecutar otras acciones
  alert('Volviendo a la página principal...');
  window.location.href = 'home.html';
}

// Asignar funciones a los eventos
document.getElementById('volverHomeButton').addEventListener('click', volverAHome);

// Función principal al cargar la página
document.addEventListener('DOMContentLoaded', function () {
  cargarDetallesUsuario();
});
