document.addEventListener('DOMContentLoaded', function () {
  const itemList = document.getElementById('itemList');
  const finishBtn = document.getElementById('finishBtn');
  const createIdBtn = document.getElementById('shareBtn');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const whatsappBtn = document.getElementById('whatsappBtn');
  const idMensaje = document.getElementById('idMensaje');
  const listNameElement = document.getElementById('listName');
  const deleteArea = document.getElementById('deleteArea');

  let items = [];
  let draggedItem = null;
  let checkboxStates = [];
  let touchOffsetX;
  let touchOffsetY;

  function generarIdUnica() {
    return Math.random().toString(36).substr(2, 9);
  }

  function crearIdLista() {
    const idUnica = generarIdUnica();
    localStorage.setItem('idLista', idUnica);
    idMensaje.textContent = `ID de Lista creada: ${idUnica}`;
    idMensaje.style.display = 'block';
    alert(`Se ha creado la ID de Lista: ${idUnica}\n¡Cópiala y compártela con otros para acceder a la lista en tiempo real!`);
  }

  function updateListName(listName) {
    listNameElement.textContent = listName;
  }

  function loadList() {
    const slotData = localStorage.getItem('savedLists');
    if (slotData) {
      const savedLists = JSON.parse(slotData);
      const slot1Obj = savedLists.find(slot => slot.slot === 1);
      if (slot1Obj && slot1Obj.items && Array.isArray(slot1Obj.items)) {
        items = slot1Obj.items;
        displayItems();
        updateListName(slot1Obj.name);
      } else {
        console.error('La propiedad "items" no está definida correctamente en los datos del slot 1.');
      }
    } else {
      console.error('No se encontraron datos guardados en el localStorage.');
    }
  }

  createIdBtn.addEventListener('click', crearIdLista);

  function displayItems() {
    itemList.innerHTML = '';
    items.forEach((item, index) => {
      const itemDiv = createItemElement(item, index);
      itemList.appendChild(itemDiv);
    });
    updateCheckboxStates();
  }

  function createItemElement(item, index) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    itemDiv.draggable = true;
    itemDiv.dataset.index = index;

    itemDiv.innerHTML = `
      <input type="checkbox" id="checkbox${index}" ${item.completed ? 'checked' : ''}>
      <label for="checkbox${index}">${item.item} - ${item.quantity} ${item.unit}</label>
    `;

    itemDiv.addEventListener('dragstart', handleDragStart);
    itemDiv.addEventListener('dragover', handleDragOver);
    itemDiv.addEventListener('drop', handleDrop);
    itemDiv.addEventListener('dragend', handleDragEnd);

    itemDiv.addEventListener('touchstart', handleDragStart);
    itemDiv.addEventListener('touchmove', handleTouchMove);

    return itemDiv;
  }

  function handleDragStart(event) {
    draggedItem = event.target;
    
    updateCheckboxStates();
    checkboxStates = items.map(item => item.completed);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleTouchMove(event) {
    event.preventDefault();
    const touch = event.touches[0];

    if (!touchOffsetX && !touchOffsetY) {
      touchOffsetX = touch.clientX - draggedItem.getBoundingClientRect().left;
      touchOffsetY = touch.clientY - draggedItem.getBoundingClientRect().top;
    }

    const offsetX = touch.clientX - touchOffsetX;
    const offsetY = touch.clientY - touchOffsetY;

    draggedItem.style.left = offsetX + 'px';
    draggedItem.style.top = offsetY + 'px';

    if (offsetY < -10) {
      items[draggedIndex].favorite = !items[draggedIndex].favorite;
      displayItems();
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    const targetItem = event.target.closest('.item');
    const targetIndex = parseInt(targetItem.dataset.index);
    const draggedIndex = parseInt(draggedItem.dataset.index);

    const movementX = event.clientX - draggedItem.offsetLeft;
    const movementY = event.clientY - draggedItem.offsetTop;

    if (movementX > 0) {

      items[draggedIndex].completed = true;
      displayItems();
    } else if (movementX < 0) {
      
      if (confirm('¿Estás seguro de que deseas eliminar este elemento de la lista?')) {
        items.splice(draggedIndex, 1);
        displayItems();
      }
    }
  }

  function handleDragEnd(event) {
    event.target.style.opacity = '1';
    const dropzone = document.elementFromPoint(event.clientX, event.clientY);
    if (!dropzone.closest('.item-list')) {
      if (confirm('¿Estás seguro de que deseas eliminar este elemento de la lista?')) {
        checkboxStates = items.map(item => item.completed); 
        const indexToRemove = parseInt(event.target.dataset.index);
        items.splice(indexToRemove, 1);
        displayItems();
        restoreCheckboxStates();
      }
    }
  }

  function restoreCheckboxStates() {
    items.forEach((item) => {
      item.completed = false;
    });

    items.forEach((item, index) => {
      const checkbox = document.getElementById(`checkbox${index}`);
      if (checkbox) {
        checkbox.checked = item.completed;
      }
    });
  }

  function updateCheckboxStates() {
    items.forEach((item, index) => {
      const checkbox = document.getElementById(`checkbox${index}`);
      if (checkbox) {
        item.completed = checkbox.checked;
      }
    });
  }

  // Función para guardar estadísticas en localStorage
  function saveStats(totalProducts, markedProducts, unmarkedProducts) {
    const statsData = {
      totalProducts: totalProducts,
      markedProducts: markedProducts,
      unmarkedProducts: unmarkedProducts
      // Puedes agregar más información aquí si es necesario
    };
    localStorage.setItem('stats', JSON.stringify(statsData));
  }

  // Función para redireccionar a la página finish.html
  function redirectToFinishPage() {
    window.location.href = 'finish.html';
  }

  // Dentro de la función finishList(), utiliza estas funciones
  function finishList() {
    const markedProducts = [];
    const unmarkedProducts = [];

    // Separar productos marcados y no marcados
    items.forEach(item => {
      if (item.completed) {
        markedProducts.push({
          name: item.item,
          quantity: item.quantity,
          unit: item.unit,
          completed: item.completed
        });
      } else {
        unmarkedProducts.push({
          name: item.item,
          quantity: item.quantity,
          unit: item.unit,
          completed: item.completed
        });
      }
    });

    // Calcular la cantidad total de productos
    const totalProducts = items.reduce((acc, item) => acc + parseInt(item.quantity), 0);

    // Llamar a las funciones para guardar estadísticas y redireccionar
    saveStats(totalProducts, markedProducts, unmarkedProducts);
    redirectToFinishPage();
  }

  function compartirLista(id) {
    localStorage.setItem(id, JSON.stringify(items));
    const baseUrl = window.location.origin;
    const listaUrl = `${baseUrl}/slot1?id=${id}`;
    return listaUrl;
  }

  function copiarEnlace() {
    const enlace = compartirLista(localStorage.getItem('idLista'));
    navigator.clipboard.writeText(enlace)
      .then(() => alert('¡Enlace copiado al portapapeles!'))
      .catch(err => console.error('Error al copiar el enlace:', err));
  }

  function compartirPorWhatsApp() {
    const enlace = compartirLista(localStorage.getItem('idLista'));
    const mensaje = encodeURIComponent(`¡Echa un vistazo a esta lista! ${enlace}`);
    window.open(`https://wa.me/?text=${mensaje}`);
  }

  loadList();

  finishBtn.addEventListener('click', finishList);
  copyLinkBtn.addEventListener('click', copiarEnlace);
  whatsappBtn.addEventListener('click', compartirPorWhatsApp);
  itemDiv.addEventListener('touchstart', handleDragStart);
  itemDiv.addEventListener('touchmove', handleTouchMove);
  itemDiv.addEventListener('touchend', handleDrop);
});