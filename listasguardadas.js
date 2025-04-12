document.addEventListener('DOMContentLoaded', function () {
  const listContainer = document.getElementById('listContainer');
  const noListsMessage = document.getElementById('noListsMessage');
  const backBtn = document.getElementById('backBtn');
  const alarmButtons = document.querySelectorAll('.alarmBtn');

  let savedLists = [];

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
        <button class="activateBtn" data-index="${index}">Activar</button>
          <button class="editBtn" data-index="${index}">Editar</button>
          <button class="deleteBtn" data-index="${index}">Eliminar</button>
          
          <button class="alarmBtn" data-index="${index}">Alarma</button>
        </div>
      `;
        listContainer.appendChild(listCard);

        const editBtn = listCard.querySelector('.editBtn');
        const deleteBtn = listCard.querySelector('.deleteBtn');
        const activateBtn = listCard.querySelector('.activateBtn');
        const alarmBtn = listCard.querySelector('.alarmBtn');

        editBtn.addEventListener('click', editList);
        deleteBtn.addEventListener('click', deleteList);
        activateBtn.addEventListener('click', activateList);
        alarmBtn.addEventListener('click', setAlarm);
      });
    }
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

  function setAlarm(event) {
    const index = event.target.dataset.index;
    const listName = savedLists[index].name;

    const selectedTime = prompt("Seleccione la hora y minuto para la alarma (formato HH:MM):");
    const selectedDay = prompt("Seleccione el día y mes para la alarma (formato DD/MM):");

    if (!selectedTime || !selectedDay) {
      alert("Debe seleccionar la hora, minuto, día y mes para establecer la alarma.");
      return;
    }

    const [hours, minutes] = selectedTime.split(":");
    const [day, month] = selectedDay.split("/");

    const alarmDate = new Date();
    alarmDate.setHours(hours, minutes, 0);
    alarmDate.setDate(day);
    alarmDate.setMonth(month - 1);

    // Se compara la fecha y hora de la alarma con la fecha y hora actuales
    const now = new Date();
    if (alarmDate <= now) {
      alert("La hora de la alarma debe ser en el futuro.");
      return;
    }

    if (!("Notification" in window)) {
      alert("Tu navegador no admite notificaciones.");
    } else if (Notification.permission === "granted") {
      scheduleNotification(listName, alarmDate);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function(permission) {
        if (permission === "granted") {
          scheduleNotification(listName, alarmDate);
        } else {
          alert("Para establecer alarmas, necesitas permitir las notificaciones.");
        }
      });
    } else {
      alert("Para establecer alarmas, necesitas permitir las notificaciones en la configuración de tu navegador.");
    }
  }

  function scheduleNotification(listName, alarmDate) {
  const now = new Date();
  const timeDiff = alarmDate.getTime() - now.getTime();
  if (timeDiff <= 0) {
    alert("La hora de la alarma debe ser en el futuro.");
    return;
  }

  setTimeout(() => {
    createNotification(listName);
  }, timeDiff);
}


  function createNotification(listName) {
  if (!("Notification" in window)) {
    alert("Tu navegador no admite notificaciones.");
  } else if (Notification.permission === "granted") {
    showNotification(listName);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function(permission) {
      if (permission === "granted") {
        showNotification(listName);
      } else {
        alert("Para recibir notificaciones, necesitas permitirlas en la configuración de tu navegador.");
      }
    });
  } else {
    alert("Para recibir notificaciones, necesitas permitirlas en la configuración de tu navegador.");
  }
}

function showNotification(listName) {
  const notification = new Notification("Recordatorio", {
    body: `Recuerda hacer la lista "${listName}"`
  });

  notification.onclick = function() {
    window.focus();
    notification.close();
  };
}


  backBtn.addEventListener('click', function () {
    window.location.href = 'index.html';
  });
});
