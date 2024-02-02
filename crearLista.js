// Datos de prueba para simular detalles del usuario
const usuario = {
  nombre: "Usuario Ejemplo",
  logueado: true,
  tokens: 50,
  gemas: 10,
};

// Lista de elementos de la lista actual
let elementosListaActual = [];

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

// función para editar un elemento de la lista
function editarElemento(index) {
  const nuevoNombre = prompt('Editar elemento:', elementosListaActual[index]);
  if (nuevoNombre !== null) {
    elementosListaActual[index] = nuevoNombre.trim();
    actualizarListaElementos();
  }
}

// Actualización en la función actualizarListaElementos para incluir el botón de editar
function actualizarListaElementos() {
  const listaElementosContainer = document.getElementById('listaElementos');
  listaElementosContainer.innerHTML = '';

  elementosListaActual.forEach((elemento, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add('lista-elementos-item');
    listItem.innerHTML = `
      <span>${elemento}</span>
      <span onclick="editarElemento(${index})" class="editar-elemento">Editar</span>
      <span onclick="eliminarElemento(${index})" class="eliminar-elemento">Eliminar</span>
    `;
    listaElementosContainer.appendChild(listItem);
  });
}

// Función para agregar un elemento a la lista
function agregarElemento() {
  const elementoInput = document.getElementById('elementoInput');
  const nuevoElemento = elementoInput.value.trim();

  if (nuevoElemento !== '') {
    elementosListaActual.push(nuevoElemento);
    actualizarListaElementos();
    elementoInput.value = '';
  }
}

// Función para eliminar un elemento de la lista
function eliminarElemento(index) {
  elementosListaActual.splice(index, 1);
  actualizarListaElementos();
}

// Función para procesar el formulario y guardar la lista
function procesarFormulario(event) {
  event.preventDefault();
  const nombreLista = document.getElementById('nombreLista').value.trim();

  if (nombreLista !== '' && elementosListaActual.length > 0) {
    // Lógica para guardar la lista en localStorage
    const listasGuardadas = JSON.parse(localStorage.getItem('listasGuardadas')) || [];
    const nuevaLista = { id: listasGuardadas.length + 1, nombre: nombreLista, elementos: elementosListaActual };
    listasGuardadas.push(nuevaLista);
    localStorage.setItem('listasGuardadas', JSON.stringify(listasGuardadas));

    // Restablecer la lista de elementos
    elementosListaActual = [];
    actualizarListaElementos();
    
    // Redirigir a la página principal (Home)
    volverAHome();
  } else {
    alert('Completa el nombre de la lista y agrega al menos un elemento.');
  }
}

// Función para volver a la página principal
function volverAHome() {
  // Puedes redirigir a la página principal o ejecutar otras acciones
  alert('Regresando a la página principal...');
  window.location.href = 'home.html';
}

// Asignar funciones a los eventos
document.getElementById('agregarElementoButton').addEventListener('click', agregarElemento);
document.getElementById('crearListaForm').addEventListener('submit', procesarFormulario);
document.getElementById('volverHomeButton').addEventListener('click', volverAHome);

// Función principal al cargar la página
document.addEventListener('DOMContentLoaded', function () {
  cargarDetallesUsuario();
  actualizarListaElementos();
});
