document.addEventListener('DOMContentLoaded', function () {
  const itemList = document.getElementById('itemList');
  const finishBtn = document.getElementById('finishBtn');
  const shareBtn = document.getElementById('shareBtn');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const whatsappBtn = document.getElementById('whatsappBtn');

  let items = [];

  function loadList() {
    const slotData = localStorage.getItem('savedLists');
    if (slotData) {
      const savedLists = JSON.parse(slotData);
      const slot1Obj = savedLists.find(slot => slot.slot === 1);
      if (slot1Obj && slot1Obj.items && Array.isArray(slot1Obj.items)) {
        items = slot1Obj.items;
        displayItems();
      } else {
        console.error('La propiedad "items" no está definida correctamente en los datos del slot 1.');
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

  function compartirLista(id) {
    localStorage.setItem(id, JSON.stringify(items));
    const baseUrl = 'https://mychecklistio.github.io/slot1/'; // URL base de tu sitio
    const listaUrl = `${baseUrl}?id=${id}`; // Enlace completo con la ID única
    return listaUrl;
  }


  function copiarEnlace() {
    const enlace = compartirLista(generarIdUnica());
    // Copiar el enlace al portapapeles
    navigator.clipboard.writeText(enlace)
      .then(() => alert('¡Enlace copiado al portapapeles!'))
      .catch(err => console.error('Error al copiar el enlace:', err));
  }

  function compartirPorWhatsApp() {
    const enlace = compartirLista(generarIdUnica());
    const mensaje = encodeURIComponent(`¡Echa un vistazo a esta lista! ${enlace}`);
    // Abrir WhatsApp con el mensaje predefinido
    window.open(`https://wa.me/?text=${mensaje}`);
  }

  function generarIdUnica() {
    return 'lista_' + new Date().getTime();
  }

  loadList();

  finishBtn.addEventListener('click', finishList);

  shareBtn.addEventListener('click', function() {
    copyLinkBtn.style.display = 'inline-block';
    whatsappBtn.style.display = 'inline-block';
  });

  copyLinkBtn.addEventListener('click', copiarEnlace);

  whatsappBtn.addEventListener('click', compartirPorWhatsApp);
});
