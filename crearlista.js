document.addEventListener('DOMContentLoaded', function () {
  const itemForm = document.getElementById('itemForm');
  const itemInput = document.getElementById('itemInput');
  const quantityInput = document.getElementById('quantityInput');
  const unitInput = document.getElementById('unitInput');
  const addItemBtn = document.getElementById('addItemBtn');
  const itemContainer = document.getElementById('itemContainer');
  const saveListBtn = document.getElementById('saveListBtn');
  const backBtn = document.getElementById('backBtn');

  let itemList = [];
  let savedLists = JSON.parse(localStorage.getItem('savedLists')) || [];

  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const slotIndex = params.get('slot');
    return parseInt(slotIndex);
  }

  function loadSlotInfo() {
    const slotIndex = getUrlParams();
    if (slotIndex) {
      const savedList = localStorage.getItem(`savedList${slotIndex}`);
      if (savedList) {
        const parsedList = JSON.parse(savedList);
        itemList = parsedList.items || [];
        displayItemList();
      }
    }
  }

  function addItemToList(event) {
    event.preventDefault();
    
    const item = itemInput.value.trim();
    const quantity = quantityInput.value.trim();
    const unit = unitInput.value.trim();

    if (!item || !quantity || !unit) {
      alert('Por favor complete todos los campos antes de agregar el elemento.');
      return;
    }

    const newItem = { item, quantity, unit };
    itemList.push(newItem);
    displayItemList();
    
    itemInput.value = '';
    quantityInput.value = '';
    unitInput.value = '';
  }

  function displayItemList() {
    itemContainer.innerHTML = '';
    itemList.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('item');
      itemElement.innerHTML = `
        <span>${item.item}</span>
        <span>${item.quantity} ${item.unit}</span>
        <button class="editBtn" data-index="${index}" style="display: none;">Editar</button>
        <button class="deleteBtn" data-index="${index}" style="display: none;">Eliminar</button>
      `;
      itemContainer.appendChild(itemElement);

      const editButton = itemElement.querySelector('.editBtn');
      const deleteButton = itemElement.querySelector('.deleteBtn');
      editButton.addEventListener('click', editItem);
      deleteButton.addEventListener('click', confirmDeleteItem);
    });

    const itemElements = document.querySelectorAll('.item');
    itemElements.forEach(item => {
      item.addEventListener('click', showButtons);
    });
  }

  function showButtons(event) {
    const itemIndex = event.currentTarget.querySelector('.editBtn').dataset.index;
    const editButton = event.currentTarget.querySelector('.editBtn');
    const deleteButton = event.currentTarget.querySelector('.deleteBtn');
    
    const buttons = document.querySelectorAll('.editBtn, .deleteBtn');
    buttons.forEach(button => button.style.display = 'none');
    
    editButton.style.display = 'inline-block';
    deleteButton.style.display = 'inline-block';

    document.addEventListener('click', function hideButtons(e) {
      if (!itemContainer.contains(e.target)) {
        buttons.forEach(button => button.style.display = 'none');
        document.removeEventListener('click', hideButtons);
      }
    });
  }

  function editItem(event) {
    const index = event.target.dataset.index;
    const editedItem = prompt('Ingrese el nuevo nombre del elemento:', itemList[index].item);
    if (editedItem !== null && editedItem.trim() !== '') {
      const editedQuantity = prompt('Ingrese la nueva cantidad:', itemList[index].quantity);
      const editedUnit = prompt('Ingrese la nueva unidad de medida:', itemList[index].unit);

      itemList[index].item = editedItem.trim();
      itemList[index].quantity = editedQuantity.trim();
      itemList[index].unit = editedUnit.trim();

      displayItemList();
    }
  }

  function confirmDeleteItem(event) {
    const index = event.target.dataset.index;
    const itemToDelete = itemList[index].item;
    const confirmDelete = confirm(`¿Está seguro que desea eliminar "${itemToDelete}"?`);
    if (confirmDelete) {
      itemList.splice(index, 1);
      displayItemList();
    }
  }

  function saveList() {
    if (itemList.length === 0) {
      alert('La lista está vacía. Agregue al menos un elemento antes de guardar.');
      return;
    }

    const listName = prompt('Ingrese un nombre para la lista:');
    if (!listName) {
      alert('Debe ingresar un nombre para la lista.');
      return;
    }

    const slotNumberText = prompt('Ingrese el número de slot para la lista (del 1 al 5):');
    const slotNumber = parseInt(slotNumberText);

    if (isNaN(slotNumber) || slotNumber < 1 || slotNumber > 5) {
      alert('El número de slot debe ser un número del 1 al 5.');
      return;
    }

    const existingListIndex = savedLists.findIndex(list => list.slot === slotNumber);
    if (existingListIndex !== -1) {
      const confirmOverride = confirm(`Ya hay una lista guardada en el slot ${slotNumber}. ¿Desea reemplazarla?`);
      if (!confirmOverride) return;
    }

    const newList = { slot: slotNumber, name: listName, items: itemList };
    savedLists.push(newList);
    localStorage.setItem('savedLists', JSON.stringify(savedLists));

    alert(`Lista "${listName}" guardada correctamente en el slot ${slotNumber}.`);
    window.location.href = 'index.html';
  }

  backBtn.addEventListener('click', function () {
    window.location.href = 'index.html'; 
  });

  itemForm.addEventListener('submit', addItemToList);
  saveListBtn.addEventListener('click', saveList);

  loadSlotInfo();
});
