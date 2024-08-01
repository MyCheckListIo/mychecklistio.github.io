document.addEventListener('DOMContentLoaded', function () {
  const backBtn = document.getElementById('backBtn');
  const homeBtn = document.getElementById('homeBtn');
  const historyList = document.getElementById('historyList');
  const popup = document.getElementById('popup');
  const popupDetails = document.getElementById('popupDetails');
  const popupTitle = document.getElementById('popupTitle');
  const closePopup = document.querySelector('.close');
  const pagination = document.getElementById('pagination');

  let history = [];
  let currentPage = 1;
  const itemsPerPage = 5;

  loadHistoryFromLocalStorage();

  function loadHistoryFromLocalStorage() {
    try {
      // Leer el historial del almacenamiento local
      const savedHistoryData = localStorage.getItem('history');
      if (savedHistoryData) {
        history = JSON.parse(savedHistoryData);

        // Verificar si los elementos en el historial son válidos
        history = history.filter(entry => entry && entry.id && Array.isArray(entry.items));
        renderHistoryList();
      } else {
        console.log('No se encontraron datos de historial en localStorage.');
      }
    } catch (error) {
      console.error('Error al recuperar el historial:', error);
    }
  }

  function renderHistoryList() {
    const totalPages = Math.ceil(history.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageHistory = history.slice(start, end);

    if (pageHistory.length > 0) {
      const listHTML = pageHistory.map(entry => {
        const date = new Date(entry.timestamp).toLocaleDateString();
        return `
          <li>
            <button class="historyItem" data-id="${entry.id}">
              ${entry.name} - ${date}
            </button>
          </li>
        `;
      }).join('');
      
      historyList.innerHTML = `
        <h2>Historial de Listas Completadas</h2>
        <ul>${listHTML}</ul>
      `;

      renderPagination(totalPages);
    } else {
      historyList.innerHTML = '<p>No hay listas completadas para mostrar.</p>';
      pagination.innerHTML = '';
    }
  }

  function renderPagination(totalPages) {
    let paginationHTML = '';
    
    if (totalPages > 1) {
      if (currentPage > 1) {
        paginationHTML += `<button class="paginationBtn" data-page="${currentPage - 1}">Anterior</button>`;
      }

      for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<button class="paginationBtn" data-page="${i}">${i}</button>`;
      }

      if (currentPage < totalPages) {
        paginationHTML += `<button class="paginationBtn" data-page="${currentPage + 1}">Siguiente</button>`;
      }
    }

    pagination.innerHTML = paginationHTML;
  }

  function showPopup(entry) {
    if (!entry || !entry.items || !Array.isArray(entry.items)) {
      popupDetails.innerHTML = '<p>No se encontraron detalles para mostrar.</p>';
      return;
    }

    const productCounts = {};
    let totalItems = 0;

    entry.items.forEach(item => {
      totalItems += parseInt(item.quantity, 10) || 0;
      productCounts[item.name] = (productCounts[item.name] || 0) + (parseInt(item.quantity, 10) || 0);
    });

    popupTitle.textContent = entry.name;
    popupDetails.innerHTML = `
      <h3>Detalles</h3>
      <p>Total de Productos Diferentes: ${Object.keys(productCounts).length}</p>
      <p>Cantidad Total de Ítems: ${totalItems}</p>
      <ul>
        ${Object.entries(productCounts).map(([productName, quantity]) => 
          `<li>${productName}: ${quantity} ${entry.items.find(item => item.name === productName).unit}</li>`
        ).join('')}
      </ul>
    `;
    popup.style.display = 'flex'; // Mostrar el popup
  }

  historyList.addEventListener('click', function (event) {
    const target = event.target;
    if (target.classList.contains('historyItem')) {
      const listId = target.getAttribute('data-id');  // Usar getAttribute para obtener el data-id
      const selectedEntry = history.find(entry => entry.id === listId);
      if (selectedEntry) {
        showPopup(selectedEntry);
      } else {
        console.log(`Entry with ID ${listId} not found`);
      }
    }
  });

  pagination.addEventListener('click', function (event) {
    const target = event.target;
    if (target.classList.contains('paginationBtn')) {
      const pageNumber = parseInt(target.getAttribute('data-page'), 10);
      if (pageNumber >= 1 && pageNumber <= Math.ceil(history.length / itemsPerPage)) {
        currentPage = pageNumber;
        renderHistoryList();
      }
    }
  });

  closePopup.addEventListener('click', function () {
    popup.style.display = 'none'; // Ocultar el popup
  });

  window.addEventListener('click', function (event) {
    if (event.target === popup) {
      popup.style.display = 'none'; // Ocultar el popup si se hace clic fuera de él
    }
  });

  backBtn.addEventListener('click', function () {
    window.location.href = 'stats.html';
  });

  homeBtn.addEventListener('click', function () {
    window.location.href = 'index.html';
  });
});
