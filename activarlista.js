// Datos de prueba para la cuenta del usuario
const usuario = {
  puntos: 0,
  recompensas: [],
};

// Función para actualizar la visualización de puntos y recompensas
function actualizarVisualizacion() {
  document.getElementById('puntosUsuario').textContent = usuario.puntos;

  const recompensasUsuario = document.getElementById('recompensasUsuario');
  recompensasUsuario.innerHTML = '';

  usuario.recompensas.forEach(recompensa => {
    const listItem = document.createElement('li');
    listItem.textContent = recompensa;
    recompensasUsuario.appendChild(listItem);
  });
}

// Función para activar la lista y comprar productos
function activarLista() {
  // Lógica para activar la lista y comprar productos
  // Supongamos que se compran productos y se actualiza la cuenta del usuario

  // Actualizar la cuenta de puntos del usuario según los productos comprados
  usuario.puntos += 5; // Ejemplo de puntos ganados al activar la lista

  // Mostrar un mensaje o realizar otras acciones según tu lógica
  alert(`¡Lista activada! Ganaste 5 puntos.`);

  // Almacenar la lista activa en localStorage
  const listaActiva = {
    nombre: 'Lista de Compras', // Puedes cambiar esto según tu lógica
    elementos: ['Manzanas', 'Leche', 'Pan'], // Puedes cambiar esto según tu lógica
  };
  localStorage.setItem('listaActiva', JSON.stringify(listaActiva));

  // Redirigir a la página de activarlista.html
  window.location.href = 'activarlista.html';
}

// Función para canjear puntos por recompensas
function canjearPuntos() {
  // Lógica para canjear puntos y otorgar recompensas
  // Supongamos que se canjean puntos y se actualiza la lista de recompensas del usuario

  // Por ejemplo, canjear 10 puntos por una recompensa
  if (usuario.puntos >= 10) {
    usuario.recompensas.push('Recompensa Especial');
    usuario.puntos -= 10; // Restar los puntos canjeados
    alert('¡Canjeaste tus puntos por una Recompensa Especial!');
  } else {
    alert('No tienes puntos suficientes para canjear una recompensa.');
  }

  // Actualizar la visualización después de canjear puntos
  actualizarVisualizacion();
}

// Asignar funciones a los eventos de los botones
document.getElementById('activarListaButton').addEventListener('click', activarLista);
document.getElementById('canjearPuntosButton').addEventListener('click', canjearPuntos);

// Actualizar la visualización al cargar la página
document.addEventListener('DOMContentLoaded', function () {
  actualizarVisualizacion();
});

// ... (tu código existente)

// Función para volver a la página de inicio (Home)
function volverAHome() {
  // Redireccionar a la página de inicio (puedes cambiar la URL según tu estructura de archivos)
  window.location.href = 'home.html';
}

// Asignar la función al evento de clic del botón "Volver a Home"
document.getElementById('volverHomeButton').addEventListener('click', volverAHome);

// ... (tu código existente)
