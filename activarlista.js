document.addEventListener('DOMContentLoaded', function () {
  const listContainer = document.getElementById('listContainer');
  const noListsMessage = document.getElementById('noListsMessage');
  const backBtn = document.getElementById('backBtn');

  let savedLists = JSON.parse(localStorage.getItem('savedLists')) || [];

  function displaySavedLists() {
    listContainer.innerHTML = '';
    const maxSlots = 5;

    for (let slot = 1; slot <= maxSlots; slot++) {
      const listCard = document.createElement('div');
      listCard.classList.add('list-card');
      const listIndex = savedLists.findIndex(list => parseInt(list.slot) === slot);
      if (listIndex !== -1) {
        
        const list = savedLists[listIndex];
        listCard.innerHTML = `
          <div class="card-header">Slot ${list.slot}</div>
          <div class="card-body">${list.name}</div>
          <div class="card-footer">
            <button class="activateBtn" data-index="${listIndex}">Activar</button>
          </div>
        `;
      } else {
        
        listCard.innerHTML = `
          <div class="card-header">Slot ${slot}</div>
          <div class="card-body">No hay lista</div>
          <div class="card-footer">
            <button class="activateBtn" data-slot="${slot}">Activar</button>
          </div>
        `;
      }
      listContainer.appendChild(listCard);
    }

    const activateButtons = document.querySelectorAll('.activateBtn');
    activateButtons.forEach(btn => btn.addEventListener('click', activateList));
  }

  function activateList(event) {
    const index = event.target.dataset.index;
    const slotNumber = event.target.dataset.slot || parseInt(savedLists[index].slot);

    const activeListData = localStorage.getItem(`activeList${slotNumber}`);
    if (activeListData) {
      const confirmOverride = confirm(`Ya hay una lista activa en el slot ${slotNumber}. ¿Desea reemplazarla?`);
      if (!confirmOverride) {
        return;
      }
    }

    localStorage.setItem(`activeList${slotNumber}`, JSON.stringify(savedLists[index]));
    window.location.href = `slot${slotNumber}.html`;
  }

  backBtn.addEventListener('click', function () {
    window.location.href = 'index.html';
  });

  const container = document.querySelector('.container');
  container.classList.add('fadeIn');

  displaySavedLists();
});
