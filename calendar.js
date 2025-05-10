const btnAgregarRecordatorio = document.getElementById('btnAgregarRecordatorio');
const popup = document.getElementById('popup');
const popupClose = document.getElementById('popupClose');
const reminderForm = document.getElementById('reminderForm');
const calendarDate = document.getElementById('calendarDate');
const calendarReminder = document.getElementById('calendarReminder');
const prevDay = document.getElementById('prevDay');
const nextDay = document.getElementById('nextDay');
const btnGuardarExtra = document.getElementById('btnGuardarExtra');

let currentDate = new Date();
let holdTimer;
let editingDate = null;

function updateCalendarDate() {
  calendarDate.textContent = currentDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  loadReminder();
}

function loadReminder() {
    const dateKey = currentDate.toISOString().split('T')[0];  // Usamos la fecha en formato YYYY-MM-DD
    const savedReminders = JSON.parse(localStorage.getItem('reminders')) || {};
    const remindersForDate = savedReminders[dateKey] || [];
  
    if (remindersForDate.length > 0) {
      calendarReminder.innerHTML = remindersForDate.map((reminder, index) => `
        <div class="reminder-item">
          <span class="delete-btn" data-date="${dateKey}" data-index="${index}">❌</span>
          <p><strong>${reminder.text}</strong></p> <!-- Asegúrate de que esto sea un texto -->
          <p>📅 ${reminder.date} 🕒 ${reminder.time}</p>
        </div>
      `).join('');
  
      const deleteBtns = calendarReminder.querySelectorAll('.delete-btn');
      deleteBtns.forEach(deleteBtn => {
        deleteBtn.addEventListener('click', (e) => {
          const index = e.target.dataset.index;
          deleteReminder(dateKey, index);
        });
      });
  
    } else {
      calendarReminder.innerHTML = '<p>No hay recordatorio para esta fecha.</p>';
    }
  }
  

function saveReminder() {
    const text = document.getElementById('reminderText').value;
    const date = document.getElementById('reminderDate').value;
    const time = document.getElementById('reminderTime').value;
  
    if (!text || !date || !time) {
      alert('Por favor completa todos los campos.');
      return;
    }
  
    const savedReminders = JSON.parse(localStorage.getItem('reminders')) || {};
    const dateKey = date; // Usamos la fecha seleccionada para guardar el recordatorio
    const newReminder = { text, date, time };
  
    if (!savedReminders[dateKey]) {
      savedReminders[dateKey] = [];
    }
  
    savedReminders[dateKey].push(newReminder);
    localStorage.setItem('reminders', JSON.stringify(savedReminders));
  
    if (date === currentDate.toISOString().split('T')[0]) {
      loadReminder();  // Recarga los recordatorios del día actual
    }
  
    reminderForm.reset();
    popup.style.display = 'none';
    editingDate = null;
    loadReminder();  // Recarga los recordatorios después de guardar
  }
  

function deleteReminder(dateKey, index) {
  const savedReminders = JSON.parse(localStorage.getItem('reminders')) || {};
  savedReminders[dateKey].splice(index, 1);  // Elimina el recordatorio en el índice dado

  if (savedReminders[dateKey].length === 0) {
    delete savedReminders[dateKey];  // Elimina la fecha si no hay recordatorios restantes
  }

  localStorage.setItem('reminders', JSON.stringify(savedReminders));
  loadReminder();  // Recarga los recordatorios después de la eliminación
}

btnAgregarRecordatorio.addEventListener('click', () => {
  popup.style.display = 'block';
  reminderForm.reset();
  editingDate = null;
});

popupClose.addEventListener('click', () => {
  popup.style.display = 'none';
});

reminderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  saveReminder();
});

btnGuardarExtra.addEventListener('click', saveReminder);

prevDay.addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() - 1);
  updateCalendarDate();
});

nextDay.addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() + 1);
  updateCalendarDate();
});

window.addEventListener('click', (e) => {
  if (e.target === popup) {
    popup.style.display = 'none';
  }
});

updateCalendarDate();
