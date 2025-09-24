document.addEventListener('DOMContentLoaded', function () {
  const listContainer = document.getElementById('listContainer');
  const noListsMessage = document.getElementById('noListsMessage');
  const backBtn = document.getElementById('backBtn');
  const especialesBtn = document.getElementById('especialesToggleBtn');
  const comprarEspecialesWrapper = document.getElementById('comprarEspecialesWrapper');
  const irASlotBtn = document.getElementById('irASlotBtn');

  // Overlay
  const shareOverlay = document.getElementById('shareOverlay');
  const loadingAnimation = document.getElementById('loadingAnimation');
  const shareResult = document.getElementById('shareResult');
  const shareLink = document.getElementById('shareLink');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const openLinkBtn = document.getElementById('openLinkBtn');

  let mostrandoEspeciales = false;
  let savedLists = [];

  loadLists();

  especialesBtn.addEventListener('click', () => {
    mostrandoEspeciales = !mostrandoEspeciales;
    especialesBtn.textContent = mostrandoEspeciales ? 'Ver Normales' : 'Ver Especiales';
    comprarEspecialesWrapper.style.display = mostrandoEspeciales ? 'block' : 'none';
    listContainer.innerHTML = '';
    mostrandoEspeciales ? loadEspeciales() : displaySavedLists();
  });

  irASlotBtn.addEventListener('click', () => {
    window.location.href = 'slotdieta.html';
  });

  backBtn.addEventListener('click', function () {
    window.location.href = 'index.html';
  });

  function loadLists() {
    const savedListsData = localStorage.getItem('savedLists');
    if (savedListsData) {
      savedLists = JSON.parse(savedListsData);
    }
    displaySavedLists();
  }

  function displaySavedLists() {
    listContainer.innerHTML = '';
    if (savedLists.length === 0) {
      noListsMessage.style.display = 'block';
      return;
    }

    noListsMessage.style.display = 'none';

    savedLists.forEach((list, index) => {
      const listCard = document.createElement('div');
      listCard.classList.add('card');
      listCard.innerHTML = `
        <div class="card-header">${list.name || 'Lista sin nombre'}</div>
        <div class="card-body">Slot ${list.slot}</div>
        <div class="card-footer">
          <button class="activateBtn" data-index="${index}">Activar</button>
          <button class="editBtn" data-index="${index}">Editar</button>
          <button class="deleteBtn" data-index="${index}">Eliminar</button>
          <button class="alarmBtn" data-index="${index}">Alarma</button>
          <button class="shareBtn" data-index="${index}">Compartir</button>
        </div>
      `;

      listContainer.appendChild(listCard);

      listCard.querySelector('.editBtn').addEventListener('click', editList);
      listCard.querySelector('.deleteBtn').addEventListener('click', deleteList);
      listCard.querySelector('.activateBtn').addEventListener('click', activateList);
      listCard.querySelector('.alarmBtn').addEventListener('click', setAlarm);
      listCard.querySelector('.shareBtn').addEventListener('click', shareList);
    });
  }

  function shareList(e) {
    const index = e.target.dataset.index;
    const list = savedLists[index];

    // Mostrar overlay y animación
    shareOverlay.style.display = 'flex';
    loadingAnimation.style.display = 'block';
    shareResult.style.display = 'none';

    // Simulamos "crear lista" (aquí iría el push a Firestore/Realtime DB)
    setTimeout(() => {
      // Generar ID único (6-7 caracteres)
      const uniqueId = Math.random().toString(36).substring(2, 8);
      const link = `https://mychecklistio.github.io/${uniqueId}`;

      // Aquí subirías "list" al backend con ese uniqueId

      // Mostrar resultado
      loadingAnimation.style.display = 'none';
      shareResult.style.display = 'block';
      shareLink.value = link;

      copyLinkBtn.onclick = () => {
        navigator.clipboard.writeText(link);
        alert('Link copiado al portapapeles');
      };

      openLinkBtn.onclick = () => {
        window.open(link, '_blank');
      };

      // Cerrar overlay al hacer click fuera
      shareOverlay.addEventListener('click', (ev) => {
        if (ev.target === shareOverlay) {
          shareOverlay.style.display = 'none';
        }
      });

    }, 1500); // Simula tiempo de creación
  }

  function loadEspeciales() {
    const accesos = JSON.parse(localStorage.getItem('accesosUsuarios')) || {};
    const claves = Object.keys(accesos);

    if (claves.length === 0) {
      noListsMessage.textContent = 'No tienes listas especiales compradas.';
      noListsMessage.style.display = 'block';
      return;
    }

    noListsMessage.style.display = 'none';

    claves.forEach(id => {
      const acceso = accesos[id];
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <div class="card-header">${acceso.tipoCompra}</div>
        <div class="card-body">${acceso.tipoDieta} - Día ${acceso.dia}</div>
        <div class="card-footer">
          <button onclick="window.location.href='slotdieta.html?id=${id}'">Ver</button>
        </div>
      `;
      listContainer.appendChild(card);
    });
  }

  function deleteList(e) {
    const index = e.target.dataset.index;
    const confirmDelete = confirm(`¿Está seguro que desea eliminar la lista "${savedLists[index].name}"?`);
    if (confirmDelete) {
      savedLists.splice(index, 1);
      displaySavedLists();
      localStorage.setItem('savedLists', JSON.stringify(savedLists));
    }
  }

  function activateList(e) {
    const index = e.target.dataset.index;
    const slotNumber = parseInt(savedLists[index].slot);
    localStorage.setItem('activeList', JSON.stringify(savedLists[index]));
    window.location.href = `slot${slotNumber}.html`;
  }

  function editList(e) {
    const index = e.target.dataset.index;
    const editedList = savedLists[index];
    const editedListParam = encodeURIComponent(JSON.stringify(editedList));
    window.location.href = `crearlista.html?list=${editedListParam}`;
  }

  function setAlarm(e) {
    const index = e.target.dataset.index;
    const listName = savedLists[index].name;
    const selectedTime = prompt("Hora (HH:MM):");
    const selectedDay = prompt("Día y mes (DD/MM):");
    if (!selectedTime || !selectedDay) return;
    const [hours, minutes] = selectedTime.split(":");
    const [day, month] = selectedDay.split("/");
    const alarmDate = new Date();
    alarmDate.setHours(hours, minutes, 0);
    alarmDate.setDate(day);
    alarmDate.setMonth(month - 1);
    const now = new Date();
    if (alarmDate <= now) return;
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      scheduleNotification(listName, alarmDate);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") scheduleNotification(listName, alarmDate);
      });
    }
  }

  function scheduleNotification(listName, alarmDate) {
    const timeDiff = alarmDate.getTime() - Date.now();
    if (timeDiff <= 0) return;
    setTimeout(() => createNotification(listName), timeDiff);
  }

  function createNotification(listName) {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      showNotification(listName);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") showNotification(listName);
      });
    }
  }

  function showNotification(listName) {
    const notification = new Notification("Recordatorio", {
      body: `Recuerda hacer la lista "${listName}"`
    });
    notification.onclick = function () {
      window.focus();
      notification.close();
    };
  }
});
