document.addEventListener('DOMContentLoaded', function () {
    const itemList = document.getElementById('itemList');
    const deleteArea = document.getElementById('deleteArea');
    let draggingItem = null;
  
    // Event listeners for drag and drop functionality
    itemList.addEventListener('dragstart', function (e) {
      draggingItem = e.target;
      setTimeout(() => {
        e.target.style.display = 'none';
      }, 0);
    });
  
    deleteArea.addEventListener('dragover', function (e) {
      e.preventDefault();
      const afterElement = getDragAfterElement(deleteArea, e.clientY);
      const draggable = document.querySelector('.dragging');
      if (afterElement == null) {
        deleteArea.appendChild(draggable);
      } else {
        deleteArea.insertBefore(draggable, afterElement);
      }
    });
  
    deleteArea.addEventListener('dragend', function () {
      draggingItem.style.display = 'block';
      draggingItem = null;
      deleteArea.classList.remove('dragover');
    });
  
    deleteArea.addEventListener('dragenter', function () {
      deleteArea.classList.add('dragover');
    });
  
    deleteArea.addEventListener('dragleave', function () {
      deleteArea.classList.remove('dragover');
    });
  
    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll('.item:not(.dragging)')];
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
  
    // Event listeners for touch drag support
    itemList.addEventListener('touchstart', function (e) {
      const touchItem = e.target.closest('.item');
      if (!touchItem) return;
  
      draggingItem = touchItem;
  
      const rect = draggingItem.getBoundingClientRect();
      const offsetX = e.touches[0].clientX - rect.left;
      const offsetY = e.touches[0].clientY - rect.top;
  
      draggingItem.style.position = 'fixed';
      draggingItem.style.top = `${rect.top}px`;
      draggingItem.style.left = `${rect.left}px`;
      draggingItem.style.width = `${rect.width}px`;
      draggingItem.style.height = `${rect.height}px`;
      draggingItem.style.pointerEvents = 'none';
  
      const handleMove = (moveEvent) => {
        draggingItem.style.top = `${moveEvent.touches[0].clientY - offsetY}px`;
        draggingItem.style.left = `${moveEvent.touches[0].clientX - offsetX}px`;
  
        const newTarget = document.elementFromPoint(moveEvent.touches[0].clientX, moveEvent.touches[0].clientY);
        if (newTarget === deleteArea) {
          deleteArea.classList.add('dragover');
        } else {
          deleteArea.classList.remove('dragover');
        }
      };
  
      const handleEnd = () => {
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
  
        draggingItem.style.position = 'relative';
        draggingItem.style.top = 'auto';
        draggingItem.style.left = 'auto';
        draggingItem.style.width = 'auto';
        draggingItem.style.height = 'auto';
        draggingItem.style.pointerEvents = 'auto';
  
        if (deleteArea.classList.contains('dragover')) {
          itemList.removeChild(draggingItem);
        }
  
        draggingItem = null;
        deleteArea.classList.remove('dragover');
      };
  
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);
    });
  
    // Event listeners for button actions
    const shareBtn = document.getElementById('shareBtn');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const finishBtn = document.getElementById('finishBtn');
    const idMensaje = document.getElementById('idMensaje');
    const listName = document.getElementById('listName');
  
    shareBtn.addEventListener('click', function () {
      const listId = generateListId();
      idMensaje.style.display = 'block';
      idMensaje.textContent = `ID de Lista creada: ${listId}`;
      copyLinkBtn.style.display = 'inline-block';
      whatsappBtn.style.display = 'inline-block';
    });
  
    copyLinkBtn.addEventListener('click', function () {
      const textArea = document.createElement('textarea');
      textArea.value = idMensaje.textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('ID de Lista copiada al portapapeles');
    });
  
    whatsappBtn.addEventListener('click', function () {
      const text = idMensaje.textContent;
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });
  
    finishBtn.addEventListener('click', function () {
      const items = itemList.querySelectorAll('.item');
      const completedItems = Array.from(items).filter(item => item.querySelector('input[type="checkbox"]').checked);
      const totalItems = items.length;
      const completedCount = completedItems.length;
      const incompleteCount = totalItems - completedCount;
      alert(`Lista finalizada: ${completedCount} completados, ${incompleteCount} incompletos`);
      // Aquí podrías enviar los datos a tu backend o realizar cualquier otra acción necesaria.
    });
  
    // Función para generar un ID de lista aleatorio
    function generateListId() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const idLength = 8;
      let result = '';
      for (let i = 0; i < idLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }
  
    // Función para crear un nuevo elemento de lista con imagen
function createListItem(text, imageUrl) {
    const item = document.createElement('div');
    item.classList.add('item');
    item.draggable = true;
    item.innerHTML = `
      <div class="item-content">
        <img src="${imageUrl}" alt="Item Image">
        <input type="checkbox">
        <span>${text}</span>
        <i class="delete-icon fas fa-trash-alt"></i>
      </div>
    `;
    const deleteIcon = item.querySelector('.delete-icon');
    deleteIcon.addEventListener('click', function () {
      item.remove();
    });
    return item;
  }
  
  // Función para cargar elementos de lista con imágenes desde localStorage
  function loadListWithImages() {
    const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    savedItems.forEach(item => {
      const { text, imageUrl } = item;
      const listItem = createListItem(text, imageUrl);
      itemList.appendChild(listItem);
    });
  }
  
  // Llamar a la función adecuada para cargar la lista con imágenes al cargar la página
  loadListWithImages();
  
  