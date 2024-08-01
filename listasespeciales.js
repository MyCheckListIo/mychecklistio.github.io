document.addEventListener('DOMContentLoaded', function() {
    const tokenCountElement = document.getElementById('tokenCount');
    let tokens = parseInt(tokenCountElement.textContent);
  
    const listasEspeciales = [
      { nombre: 'Pizza para Cuatro', costo: 10, contenido: ['Harina', 'Tomate', 'Queso', 'Jamón'], objetivo: 'Completa una lista' },
      { nombre: 'Ensalada Completa', costo: 5, contenido: ['Lechuga', 'Tomate', 'Pepino', 'Aceite de Oliva'], objetivo: 'Completa dos listas' }
    ];
  
    const listasContainer = document.getElementById('listasEspecialesContainer');
    const listasCompradasContainer = document.getElementById('listasCompradasContainer');
    const historialComprasContainer = document.getElementById('historialComprasContainer');
    const listasCompradas = [];
  
    // Modal elements
    const modal = document.getElementById('listaModal');
    const modalTitulo = document.getElementById('modalTitulo');
    const modalContenido = document.getElementById('modalContenido');
    const modalBtnComprar = document.getElementById('modalBtnComprar');
    const spanClose = document.getElementsByClassName('close')[0];
  
    spanClose.onclick = function() {
      modal.style.display = 'none';
    };
  
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };
  
    let listaSeleccionada = null; // Variable para almacenar la lista seleccionada
  
    listasEspeciales.forEach(lista => {
      const listaDiv = document.createElement('div');
      listaDiv.classList.add('lista-especial');
  
      const listaInfo = document.createElement('div');
      listaInfo.textContent = `${lista.nombre} - ${lista.costo} Tokens`;
  
      const btnVerDetalles = document.createElement('button');
      btnVerDetalles.classList.add('btn-ver-detalles');
      btnVerDetalles.textContent = 'Ver Detalles';
      btnVerDetalles.addEventListener('click', () => {
        listaSeleccionada = lista; // Guarda la lista seleccionada en la variable
        modalTitulo.textContent = lista.nombre;
        modalContenido.innerHTML = `
          <p>Ingredientes:</p>
          <ul>
            ${lista.contenido.map(ingrediente => `<li>${ingrediente}</li>`).join('')}
          </ul>
          <p>Objetivo: ${lista.objetivo}</p>
        `;
        modal.style.display = 'block';
      });
  
      listaDiv.appendChild(listaInfo);
      listaDiv.appendChild(btnVerDetalles);
      listasContainer.appendChild(listaDiv);
    });
  
    modalBtnComprar.addEventListener('click', () => {
      if (listaSeleccionada && tokens >= listaSeleccionada.costo) {
        tokens -= listaSeleccionada.costo;
        tokenCountElement.textContent = tokens;
        listasCompradas.push(listaSeleccionada);
        renderListasCompradas();
        modal.style.display = 'none';
        alert(`Has comprado la lista: ${listaSeleccionada.nombre}`);
      } else if (!listaSeleccionada) {
        alert('Primero selecciona una lista para comprar.');
      } else {
        alert('No tienes suficientes tokens.');
      }
    });
  
    function renderListasCompradas() {
      listasCompradasContainer.innerHTML = '';
      listasCompradas.forEach(lista => {
        const listaDiv = document.createElement('div');
        listaDiv.classList.add('lista-comprada');
  
        const listaInfo = document.createElement('div');
        listaInfo.textContent = lista.nombre;
  
        const btnActivar = document.createElement('button');
        btnActivar.classList.add('btn-activar');
        btnActivar.textContent = 'Activar';
        btnActivar.addEventListener('click', () => {
          // Al hacer clic en activar, redirigir a activarespeciales.html con los datos de la lista
          localStorage.setItem('listaActiva', JSON.stringify(lista));
          window.location.href = 'activarespeciales.html';
        });
  
        listaDiv.appendChild(listaInfo);
        listaDiv.appendChild(btnActivar);
        listasCompradasContainer.appendChild(listaDiv);
      });
    }
  });
  