document.addEventListener('DOMContentLoaded', function () {
  const listContainer = document.getElementById('listContainer');
  const noListsMessage = document.getElementById('noListsMessage');
  const backBtn = document.getElementById('backBtn');

  let savedLists = [];

  // Cargar listas desde el localStorage al cargar la página
  loadListsFromLocalStorage();

  function loadListsFromLocalStorage() {
    const savedListsData = localStorage.getItem('savedLists');
    if (savedListsData) {
      savedLists = JSON.parse(savedListsData);
      displaySavedLists();
    } else {
      console.log('No se encontraron listas en el localStorage.');
    }
  }

  function displaySavedLists() {
    listContainer.innerHTML = '';
    if (savedLists.length === 0) {
      noListsMessage.style.display = 'block';
    } else {
      noListsMessage.style.display = 'none';
      savedLists.forEach((list, index) => {
        const listCard = document.createElement('div');
        listCard.classList.add('list-card');
        const listName = list.name || `Lista ${list.slot}`;
        listCard.innerHTML = `
          <div class="card-header">${listName}</div>
          <div class="card-body">Slot ${list.slot}</div>
          <div class="card-footer">
            <button class="editBtn" data-index="${index}">Editar</button>
            <button class="deleteBtn" data-index="${index}">Eliminar</button>
            <button class="activateBtn" data-index="${index}">Activar</button>
          </div>
        `;
        listContainer.appendChild(listCard);

        // Agregar evento clic a la tarjeta para redirigir al slot 1
        listCard.addEventListener('click', () => {
          window.location.href = 'slot1.html';
        });
      });
    }

    const editButtons = document.querySelectorAll('.editBtn');
    const deleteButtons = document.querySelectorAll('.deleteBtn');
    const activateButtons = document.querySelectorAll('.activateBtn');

    editButtons.forEach(btn => btn.addEventListener('click', editList));
    deleteButtons.forEach(btn => btn.addEventListener('click', deleteList));
    activateButtons.forEach(btn => btn.addEventListener('click', activateList));
  }

  function deleteList(event) {
    const index = event.target.dataset.index;
    const confirmDelete = confirm(`¿Está seguro que desea eliminar la lista "${savedLists[index].name}"?`);
    if (confirmDelete) {
      savedLists.splice(index, 1);
      displaySavedLists();
      saveListsToLocalStorage();
    }
  }

  function saveListsToLocalStorage() {
    localStorage.setItem('savedLists', JSON.stringify(savedLists));
  }

  function activateList(event) {
    const index = event.target.dataset.index;
    const slotNumber = parseInt(savedLists[index].slot);
    const activeList = localStorage.getItem(`savedList${slotNumber}`);
    if (activeList) {
      window.location.href = `slot${slotNumber}.html`;
      return;
    }
    localStorage.setItem('activeList', JSON.stringify(savedLists[index]));
    window.location.href = `slot${slotNumber}.html`;
  }

  function editList(event) {
    const index = event.target.dataset.index;
    const editedList = savedLists[index];
    const editedListParam = encodeURIComponent(JSON.stringify(editedList));
    window.location.href = `crearlista.html?list=${editedListParam}`;
  }

  backBtn.addEventListener('click', function () {
    window.location.href = 'index.html';
  });
});
