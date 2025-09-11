document.addEventListener('DOMContentLoaded', function () {
  const itemForm = document.getElementById('itemForm');
  const itemInput = document.getElementById('itemInput');
  const quantityInput = document.getElementById('quantityInput');
  const unitInput = document.getElementById('unitInput');
  const addItemBtn = document.getElementById('addItemBtn');
  const itemContainer = document.getElementById('itemContainer');
  const saveListBtn = document.getElementById('saveListBtn');
  const backBtn = document.getElementById('backBtn');

  window.itemList = [];
  let savedLists = getSavedLists();

  function getSavedLists() {
    try { return JSON.parse(localStorage.getItem('savedLists')) || []; }
    catch { return []; }
  }

  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('slot'));
  }

  function loadSlotInfo() {
    const slotIndex = getUrlParams();
    if (!isNaN(slotIndex) && slotIndex > 0) {
      const savedList = savedLists.find(list => list.slot === slotIndex);
      if (savedList) {
        itemList = savedList.items || [];
        displayItemList();
      }
    }
  }

  function addItemToList(event) {
    event.preventDefault();
    const item = itemInput.value.trim();
    const quantity = quantityInput.value.trim();
    const unit = unitInput.value.trim();
    if (!item) return alert('Por favor complete el nombre del elemento.');
    if (quantity && (isNaN(quantity) || parseFloat(quantity) <= 0)) return alert('La cantidad debe ser un número válido mayor que cero.');
    itemList.push({ item, quantity: quantity || '', unit: unit || '' });
    displayItemList();
    clearFormInputs();
  }

  function clearFormInputs() {
    itemInput.value = '';
    quantityInput.value = '';
    unitInput.value = '';
  }

  function displayItemList() {
    itemContainer.innerHTML = '';
    if (itemList.length === 0) {
      itemContainer.innerHTML = '<p class="empty-message">La lista está vacía.</p>';
      return;
    }
    itemList.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('item');
      itemElement.innerHTML = `
        <span>${item.item}</span>
        <span>${item.quantity} ${item.unit}</span>
        <button class="editBtn" data-index="${index}" style="display:none;">Editar</button>
        <button class="deleteBtn" data-index="${index}" style="display:none;">Eliminar</button>
      `;
      itemContainer.appendChild(itemElement);
      itemElement.querySelector('.editBtn').addEventListener('click', editItem);
      itemElement.querySelector('.deleteBtn').addEventListener('click', confirmDeleteItem);
      itemElement.addEventListener('click', e => showButtons(e.currentTarget));
    });
  }
  window.displayItemList = displayItemList;

  function showButtons(itemElement) {
    const editButton = itemElement.querySelector('.editBtn');
    const deleteButton = itemElement.querySelector('.deleteBtn');
    const buttons = document.querySelectorAll('.editBtn, .deleteBtn');
    buttons.forEach(b => b.style.display = 'none');
    editButton.style.display = 'inline-block';
    deleteButton.style.display = 'inline-block';
    document.addEventListener('click', function hideButtons(e) {
      if (!itemContainer.contains(e.target)) {
        buttons.forEach(b => b.style.display = 'none');
        document.removeEventListener('click', hideButtons);
      }
    });
  }

  function editItem(event) {
    event.stopPropagation();
    const index = event.target.dataset.index;
    const currentItem = itemList[index];
  
    const editedItem = prompt('Ingrese el nuevo nombre del elemento:', currentItem.item);
    if (!editedItem) return;
  
    let editedQuantity = prompt('Ingrese la nueva cantidad:', currentItem.quantity);
    // Permitir que quede vacío, pero si hay algo debe ser número
    if (editedQuantity !== null) {
      editedQuantity = editedQuantity.trim();
      if (editedQuantity && isNaN(editedQuantity)) {
        alert('La cantidad debe ser un número válido o dejarse vacía.');
        return;
      }
    } else {
      editedQuantity = currentItem.quantity;
    }
  
    let editedUnit = prompt('Ingrese la nueva unidad de medida:', currentItem.unit);
    if (editedUnit !== null) {
      editedUnit = editedUnit.trim();
    } else {
      editedUnit = currentItem.unit;
    }
  
    itemList[index] = {
      item: editedItem.trim(),
      quantity: editedQuantity,
      unit: editedUnit
    };
  
    displayItemList();
  }
  

  function confirmDeleteItem(event) {
    event.stopPropagation();
    const index = event.target.dataset.index;
    if (confirm(`¿Está seguro que desea eliminar "${itemList[index].item}"?`)) {
      itemList.splice(index, 1);
      displayItemList();
    }
  }

  function saveList() {
    if (itemList.length === 0) return alert('La lista está vacía. Agregue al menos un elemento antes de guardar.');
    const listName = prompt('Ingrese un nombre para la lista:');
    if (!listName) return alert('Debe ingresar un nombre para la lista.');
    const slotNumber = parseInt(prompt('Ingrese el número de slot para la lista (del 1 al 5):'));
    if (isNaN(slotNumber) || slotNumber < 1 || slotNumber > 5) return alert('El número de slot debe ser un número del 1 al 5.');
    const newList = { slot: slotNumber, name: listName.trim(), items: itemList };
    const existingIndex = savedLists.findIndex(list => list.slot === slotNumber);
    if (existingIndex !== -1 && !confirm(`Ya hay una lista guardada en el slot ${slotNumber}. ¿Desea reemplazarla?`)) return;
    existingIndex !== -1 ? savedLists[existingIndex] = newList : savedLists.push(newList);
    try {
      localStorage.setItem('savedLists', JSON.stringify(savedLists));
      localStorage.setItem('lastSavedSlot', slotNumber);
      localStorage.setItem('listSaved', 'true');
      alert(`Lista "${listName}" guardada correctamente en el slot ${slotNumber}.`);
      window.location.href = 'index.html';
    } catch {
      alert('Ocurrió un error al guardar la lista. Inténtelo nuevamente.');
    }
  }

  backBtn.addEventListener('click', () => window.location.href = 'index.html');
  itemForm.addEventListener('submit', addItemToList);
  saveListBtn.addEventListener('click', saveList);
  loadSlotInfo();

  const scanBtn = document.getElementById('scanBtn');
  const scanPopup = document.getElementById('scanPopup');
  const closePopupBtn = document.getElementById('closePopupBtn');
  const scanListBtn = document.getElementById('scanListBtn');
  const openPhotosBtn = document.getElementById('openPhotosBtn');
  const cameraInput = document.getElementById('cameraInput');
  const photoInput = document.getElementById('photoInput');
  const loadingPopup = document.getElementById('loadingPopup');
  const loadingText = document.getElementById('loadingText');

  if (scanBtn && scanPopup && scanListBtn && openPhotosBtn && cameraInput && photoInput && loadingPopup && loadingText) {
    scanBtn.addEventListener('click', () => scanPopup.style.display = 'flex');
    closePopupBtn.addEventListener('click', () => scanPopup.style.display = 'none');
    window.addEventListener('click', e => { if (e.target === scanPopup) scanPopup.style.display = 'none'; });

    scanListBtn.addEventListener('click', async () => {
      scanPopup.style.display = 'none';
      async function openCamera(c) { try { return await navigator.mediaDevices.getUserMedia(c); } catch { return null; } }
      let stream = await openCamera({ video: { facingMode: 'environment' } });
      if (!stream) stream = await openCamera({ video: true });
      if (!stream) return cameraInput.click();

      const video = document.createElement('video');
      video.autoplay = true; video.playsInline = true; video.srcObject = stream;
      await new Promise(r => video.onloadedmetadata = r);

      const popup = document.createElement('div');
      Object.assign(popup.style, { position:'fixed', top:'0', left:'0', width:'100%', height:'100%', background:'rgba(0,0,0,0.85)', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', zIndex:'9999' });
      Object.assign(video.style, { maxWidth:'95%', maxHeight:'70%', borderRadius:'8px' });
      popup.appendChild(video);

      const controls = document.createElement('div');
      Object.assign(controls.style, { marginTop:'14px', display:'flex', gap:'10px' });
      const captureBtn = document.createElement('button'); captureBtn.textContent = 'Capturar lista';
      const cancelBtn = document.createElement('button'); cancelBtn.textContent = 'Cancelar';
      controls.appendChild(captureBtn); controls.appendChild(cancelBtn); popup.appendChild(controls);
      document.body.appendChild(popup);

      captureBtn.addEventListener('click', async () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.9));
        stream.getTracks().forEach(track => track.stop());
        popup.remove();
        processImageWithLoading(blob);
      });

      cancelBtn.addEventListener('click', () => { stream.getTracks().forEach(track => track.stop()); popup.remove(); });
    });

    openPhotosBtn.addEventListener('click', () => { scanPopup.style.display = 'none'; photoInput.click(); });

    async function preprocessFileToDataUrl(file) {
      return new Promise((res, rej) => {
        const fr = new FileReader();
        fr.onload = e => res(e.target.result);
        fr.onerror = rej;
        fr.readAsDataURL(file);
      });
    }

    async function processImageWithLoading(file) {
      if (!file) return;
      const dataUrl = await preprocessFileToDataUrl(file);
      if (!dataUrl) return;
      loadingPopup.style.display = 'flex';
      const steps = ['Creando lista...', 'Desencriptando los items...', 'Analizando la nueva lista...'];
      for (let step of steps) { loadingText.textContent = step; await new Promise(r => setTimeout(r, 700)); }
      try {
        const { data: { text } } = await Tesseract.recognize(dataUrl, 'spa', {
          logger: m => console.log(m),
          tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789áéíóúÁÉÍÓÚ ',
          preserve_interword_spaces: '1',
          tessedit_pageseg_mode: 6, // modo columna uniforme
        });
        
        const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '');
        lines.forEach(line => itemList.push({ item: line, quantity: '', unit: '' }));
        displayItemList();
        loadingPopup.style.display = 'none';
        alert('Ítems agregados desde la imagen');
      } catch {
        loadingPopup.style.display = 'none';
        alert('Error al procesar la imagen.');
      }
    }

    cameraInput.addEventListener('change', function () { processImageWithLoading(this.files[0]); });
    photoInput.addEventListener('change', function () { processImageWithLoading(this.files[0]); });
  }
});
