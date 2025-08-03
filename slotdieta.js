// slotdieta.js adaptado

document.addEventListener('DOMContentLoaded', function () {
  const itemList = document.getElementById('itemList');
  const finishBtn = document.getElementById('finishBtn');
  const listNameElement = document.getElementById('listName');
  const deleteArea = document.getElementById('deleteArea');
  const backBtn = document.createElement('button');
  backBtn.textContent = 'Volver';
  backBtn.classList.add('dynamicBtn');
  document.body.appendChild(backBtn);

  let items = [];
  let draggedItem = null;
  let checkboxStates = [];
  let touchOffsetX;
  let touchOffsetY;

  function obtenerIdUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  function updateListName(listName) {
    listNameElement.textContent = listName;
  }

  function loadList() {
    const accesoId = obtenerIdUrl();
    if (!accesoId) {
      alert('Acceso inválido o no autorizado.');
      window.location.href = 'index.html';
      return;
    }

    const accesos = JSON.parse(localStorage.getItem('accesosUsuarios')) || {};
    const accesoData = accesos[accesoId];

    if (!accesoData) {
      alert('Acceso no encontrado o expirado.');
      window.location.href = 'index.html';
      return;
    }

    const baseRecetas = {
      estandar: [
        { nombre: "Pollo al horno", ingredientes: ["pollo", "papas", "ajo"] },
        { nombre: "Ensalada César", ingredientes: ["lechuga", "pollo", "aderezo César"] },
        { nombre: "Espaguetis a la boloñesa", ingredientes: ["pasta", "carne", "tomate"] },
      ],
      saludable: [
        { nombre: "Quinoa con verduras", ingredientes: ["quinoa", "calabacín", "pimiento"] },
        { nombre: "Salmón al vapor", ingredientes: ["salmón", "espárragos", "limón"] },
      ],
      vegana: [
        { nombre: "Tofu salteado", ingredientes: ["tofu", "brócoli", "salsa de soja"] },
        { nombre: "Ensalada de garbanzos", ingredientes: ["garbanzos", "tomate", "pepino"] },
      ],
      keto: [
        { nombre: "Huevos revueltos con aguacate", ingredientes: ["huevos", "aguacate", "aceite de oliva"] },
        { nombre: "Ensalada de pollo y aguacate", ingredientes: ["pollo", "aguacate", "lechuga"] },
      ]
    };

    let recetas = baseRecetas[accesoData.tipoDieta];
    if (!recetas) {
      alert('Dieta no válida.');
      return;
    }

    items = [];

    if (accesoData.tipoCompra.includes('completo')) {
      for (let i = 0; i < 7; i++) {
        const rIndex = i % recetas.length;
        recetas[rIndex].ingredientes.forEach(ingrediente => {
          items.push({ item: ingrediente, quantity: 1, unit: '', completed: false });
        });
      }
      updateListName(`Menú completo - ${accesoData.tipoDieta}`);
    } else {
      const rIndex = (accesoData.dia - 1) % recetas.length;
      recetas[rIndex].ingredientes.forEach(ingrediente => {
        items.push({ item: ingrediente, quantity: 1, unit: '', completed: false });
      });
      updateListName(`Receta Día ${accesoData.dia} - ${accesoData.tipoDieta}`);
    }

    displayItems();
  }

  function displayItems() {
    itemList.innerHTML = '';
    items.forEach((item, index) => {
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
      itemDiv.addEventListener('touchcancel', handleTouchCancel);
      itemDiv.addEventListener('touchstart', handleDragStart);
      itemDiv.addEventListener('touchmove', handleTouchMove);

      itemList.appendChild(itemDiv);
    });
    updateCheckboxStates();
  }

  // Resto del código (drag & drop, eliminar, terminar lista, etc.) se puede mantener igual
  // ...

  loadList();

  finishBtn.addEventListener('click', finishList);
  backBtn.addEventListener('click', function () {
    window.location.href = 'index.html';
  });
});
