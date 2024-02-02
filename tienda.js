// Datos de prueba para simular detalles del usuario
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

// Función para comprar mejoras de interfaz
function comprarMejora(mejora, costo) {
  if (usuario.tokens >= costo) {
    // Lógica para aplicar la mejora de interfaz
    alert(`¡Mejora aplicada! ${mejora}`);
    usuario.tokens -= costo; // Restar los tokens gastados
    cargarDetallesUsuario();
  } else {
    alert('No tienes suficientes tokens para comprar esta mejora.');
  }
}

// Función para comprar recetas
function comprarReceta(receta, costo, porciones) {
  if (usuario.tokens >= costo) {
    // Lógica para agregar la receta a la lista del usuario
    alert(`¡Receta comprada! ${receta} - Porciones: ${porciones}`);
    usuario.tokens -= costo; // Restar los tokens gastados
    cargarDetallesUsuario();
  } else {
    alert('No tienes suficientes tokens para comprar esta receta.');
  }
}

// Función para volver a la página principal
function volverAHome() {
  // Puedes redirigir a la página principal o ejecutar otras acciones
  window.location.href = 'home.html';
}

// Asignar funciones a los eventos
document.getElementById('volverHomeButton').addEventListener('click', volverAHome);

// Función principal al cargar la página
document.addEventListener('DOMContentLoaded', function () {
  cargarDetallesUsuario();
});
