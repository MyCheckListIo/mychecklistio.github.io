document.addEventListener('DOMContentLoaded', function () {
  const backBtn = document.getElementById('backBtn');
  const homeBtn = document.getElementById('homeBtn');
  const historyList = document.getElementById('historyList');
  const popup = document.getElementById('popup');
  const popupDetails = document.getElementById('popupDetails');
  const popupTitle = document.getElementById('popupTitle');
  const closePopup = document.querySelector('.close');

  const savedLists = JSON.parse(localStorage.getItem('savedLists')) || [];

  if (savedLists.length > 0) {
    historyList.innerHTML = `
      <h2>Listas Finalizadas</h2>
      <ul>
        ${savedLists.map(list => `<li><button class="historyItem" data-listId="${list.slot}">${list.name}</button></li>`).join('')}
      </ul>
    `;
  } else {
    historyList.innerHTML = '<p>No hay listas finalizadas para mostrar.</p>';
  }

  historyList.addEventListener('click', function (event) {
    const target = event.target;
    if (target.classList.contains('historyItem')) {
      const listId = target.dataset.listId;
      const selectedList = savedLists.find(list => list.slot === parseInt(listId));
      if (selectedList) {
        popupTitle.textContent = selectedList.name;
        popupDetails.innerHTML = `
          <h3>Detalles</h3>
          <p>Total de productos: ${selectedList.items.length}</p>
          <h3>Productos</h3>
          <ul>
            ${selectedList.items.map(item => `<li>${item.name} - ${item.quantity} ${item.unit}</li>`).join('')}
          </ul>
        `;
        popup.style.display = 'block';
      }
    }
  });

  closePopup.addEventListener('click', function () {
    popup.style.display = 'none';
  });

  backBtn.addEventListener('click', function () {
    window.location.href = 'stats.html';
  });

  homeBtn.addEventListener('click', function () {
    window.location.href = 'index.html';
  });
});
