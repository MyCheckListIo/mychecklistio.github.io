// Datos de prueba para simular detalles del usuario
const usuario = {
  nombre: "Usuario Ejemplo",
  logueado: true,
  tokens: 50,
  gemas: 10,
};

// Función para cargar detalles del usuario en el header
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

// Función para mostrar dinámicamente las listas guardadas
function mostrarListasGuardadas() {
  const listasGuardadasContainer = document.getElementById('listasGuardadasContainer');
  listasGuardadasContainer.innerHTML = '';

  // Recupera las listas guardadas del localStorage
  const listasGuardadas = JSON.parse(localStorage.getItem('listasGuardadas')) || [];

  listasGuardadas.forEach(lista => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span>${lista.nombre}</span>
      <button onclick="manejarLista('${lista.id}')">Ver Detalles</button>
    `;
    listasGuardadasContainer.appendChild(listItem);
  });
}

// Función para manejar las acciones de la lista (Editar, Compartir, Activar)
function manejarLista(listaId) {
  const lista = listasGuardadas.find(item => item.id === listaId.toString());

  if (lista) {
    const accion = prompt(`¿Qué deseas hacer con la lista "${lista.nombre}"?\n1. Editar\n2. Compartir\n3. Activar`);

    switch (accion) {
      case '1':
        editarLista(listaId);
        break;
      case '2':
        compartirLista(listaId);
        break;
      case '3':
        activarLista(listaId);
        break;
      default:
        alert('Acción no válida');
    }
  }
}

// Función para editar una lista
function editarLista(listaId) {
  // Implementa la lógica para editar la lista con el ID proporcionado
  alert(`Editando lista con ID: ${listaId}`);
}

// Función para compartir una lista
function compartirLista(listaId) {
  // Implementa la lógica para compartir la lista con el ID proporcionado
  alert(`Compartiendo lista con ID: ${listaId}`);
}

// Función para activar una lista
function activarLista(listaId) {
  const lista = listasGuardadas.find(item => item.id === listaId.toString());

  if (lista) {
    // Almacenar la lista activa en localStorage
    localStorage.setItem('listaActiva', JSON.stringify(lista));

    // Redirigir a la página de activarlista.html
    window.location.href = 'activarlista.html';
  } else {
    alert('No se encontró la lista seleccionada');
  }
}


// Asignar funciones a los eventos
document.getElementById('volverHomeButton').addEventListener('click', volverAHome);

// Función principal al cargar la página
document.addEventListener('DOMContentLoaded', function () {
  cargarDetallesUsuario();
  mostrarListasGuardadas();
});


// Función para volver a Home
function volverAHome() {
  // Lógica para redirigir a la página de Home
  window.location.href = 'home.html';
}
