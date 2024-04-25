document.addEventListener('DOMContentLoaded', function () {
  const itemList = document.getElementById('itemList');
  const finishBtn = document.getElementById('finishBtn');
  const backBtn = document.createElement('button');
  backBtn.textContent = 'Volver';
  backBtn.classList.add('dynamicBtn');
  document.body.appendChild(backBtn);

  let items = [];

  function loadList() {
    const slotData = localStorage.getItem('savedLists');
    if (slotData) {
      const savedLists = JSON.parse(slotData);
      const slot2Obj = savedLists.find(slot => slot.slot === 2);
      if (slot2Obj && slot2Obj.items && Array.isArray(slot2Obj.items)) {
        items = slot2Obj.items;
        displayItems();
      } else {
        console.error('La propiedad "items" no está definida correctamente en los datos del slot 2.');
      }
    } else {
      console.error('No se encontraron datos guardados en el localStorage.');
    }
  }

  function displayItems() {
    itemList.innerHTML = '';
    items.forEach((item, index) => {
      const itemDiv = createItemElement(item, index);
      itemList.appendChild(itemDiv);
    });
  }

  function createItemElement(item, index) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    itemDiv.innerHTML = `
      <input type="checkbox" id="checkbox${index}" ${item.completed ? 'checked' : ''}>
      <label for="checkbox${index}">${item.item} - ${item.quantity} ${item.unit}</label>
    `;
    return itemDiv;
  }

  function finishList() {
    const totalProducts = items.reduce((acc, item) => acc + parseInt(item.quantity), 0);
    const productHistory = items.map(item => ({
      name: item.item,
      quantity: item.quantity,
      unit: item.unit,
      completed: item.completed
    }));

    localStorage.setItem('totalProducts', totalProducts);
    localStorage.setItem('productHistory', JSON.stringify(productHistory));
    window.location.href = 'finish.html';
  }

  loadList();

  finishBtn.addEventListener('click', finishList);
});
