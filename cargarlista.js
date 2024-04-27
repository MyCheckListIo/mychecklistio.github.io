document.addEventListener('DOMContentLoaded', function () {
  const loadListForm = document.getElementById('loadListForm');
  const validationMessage = document.getElementById('validationMessage');
  const slotSelection = document.getElementById('slotSelection');
  const confirmSlotBtn = document.getElementById('confirmSlotBtn');

  loadListForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const listIDInput = document.getElementById('listID');
    const listID = listIDInput.value.trim();

    const isValidList = validateList(listID);

    if (isValidList) {
      validationMessage.textContent = 'Lista válida';
      slotSelection.classList.remove('hidden');
    } else {
      validationMessage.textContent = 'Lista inválida';
      slotSelection.classList.add('hidden');
    }
  });

  confirmSlotBtn.addEventListener('click', function () {
    const slotSelect = document.getElementById('slot');
    const selectedSlot = slotSelect.value;
    const listIDInput = document.getElementById('listID');
    const listID = listIDInput.value.trim();

    if (selectedSlot) {
      const storedList = localStorage.getItem(listID);

      if (storedList) {
        alert(`¡La lista con ID ${listID} está disponible!`);
        window.location.href = `https://mychecklistio.github.io/slot${selectedSlot}/?id=${listID}`;
      } else {
        alert('El ID de lista proporcionado no corresponde a ninguna lista guardada.');
      }
    } else {
      alert('Por favor, seleccione un slot para cargar la lista.');
    }
  });

  function validateList(listID) {
    return listID.length > 0;
  }
});

function goToIndex() {
  window.location.href = "index.html";
}
