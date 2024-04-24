document.addEventListener('DOMContentLoaded', function () {
  const listContainer = document.getElementById('listContainer');
  const noListsMessage = document.getElementById('noListsMessage');
  const backBtn = document.getElementById('backBtn');

  let savedLists = JSON.parse(localStorage.getItem('savedLists')) || [];

  function displaySavedLists() {
    listContainer.innerHTML = '';
    if (savedLists.length === 0) {
      noListsMessage.style.display = 'block'; // Mostrar mensaje de lista vacía
    } else {
      noListsMessage.style.display = 'none'; // Ocultar mensaje de lista vacía si hay listas
      savedLists.forEach((list, index) => {
        const listCard = document.createElement('div');
        listCard.classList.add('list-card');
        listCard.innerHTML = `
          <div class="card-header">Slot ${list.slot}</div>
          <div class="card-body">${list.name}</div>
          <div class="card-footer">
            <button class="activateBtn" data-index="${index}">Activar</button>
          </div>
        `;
        listContainer.appendChild(listCard);
      });
    }

    const activateButtons = document.querySelectorAll('.activateBtn');
    activateButtons.forEach(btn => btn.addEventListener('click', activateList));
  }

  function activateList(event) {
    const index = event.target.dataset.index;
    const slotNumber = parseInt(savedLists[index].slot);

    // Verificar si hay una lista activa en el slot actual
    const activeListData = localStorage.getItem(`activeList${slotNumber}`);
    if (activeListData) {
      const confirmOverride = confirm(`Ya hay una lista activa en el slot ${slotNumber}. ¿Desea reemplazarla?`);
      if (!confirmOverride) {
        return; // Salir de la función si el usuario decide no reemplazar la lista
      }
    }

    // Guardar la lista activa en el localStorage
    localStorage.setItem(`activeList${slotNumber}`, JSON.stringify(savedLists[index]));
    window.location.href = `slot${slotNumber}.html`; // Redirigir a la página del slot
  }

  backBtn.addEventListener('click', function () {
    window.location.href = 'index.html';
  });

  // Mostrar los elementos gradualmente al cargar la página
  const container = document.querySelector('.container');
  container.classList.add('fadeIn');

  // Llamamos a la función para mostrar las listas al cargar la página
  displaySavedLists();
});
