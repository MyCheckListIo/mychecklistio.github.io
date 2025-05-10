// Animación de fade-in para el contenedor
function fadeInAnimation() {
  const container = document.querySelector('.container');
  if (container) {
    container.classList.add('fadeIn');
  }
}

document.addEventListener('DOMContentLoaded', fadeInAnimation);

// Redirección a páginas
function redirectToPage(pageName) {
  window.location.href = `${pageName}.html`;
}

// Añadir eventos a los botones para redirección
function addButtonEvent(buttonId, pageName) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener('click', () => redirectToPage(pageName));
  }
}

const buttons = [
  { id: 'btnCrearLista', page: 'crearlista' },
  { id: 'btnListasGuardadas', page: 'listasguardadas' },
  { id: 'btnActivarLista', page: 'activarlista' },
  { id: 'btnCargarLista', page: 'cargarlista' },
  { id: 'btnProductos', page: 'productos' },
  { id: 'btnRecetario', page: 'recetario' },
  { id: 'btnStats', page: 'stats' },
  { id: 'btnUsuario', page: 'user' },
  { id: 'btnIdentificador', page: 'identificador' },
  { id: 'btnPrecios', page: 'precios' },
  { id: 'btnTopLeft', page: 'listasespeciales' },
  { id: 'btnTopRight', page: 'recompensadiaria' }
];

buttons.forEach(btn => addButtonEvent(btn.id, btn.page));

// Función para mostrar u ocultar botones con animación
function toggleButtonsVisibility() {
  const buttons = ['btnTopLeft', 'btnTopRight'].map(id => document.getElementById(id)).filter(Boolean);

  buttons.forEach(button => {
    if (button.classList.contains('hidden')) {
      button.classList.remove('hidden', 'fade-out');
      button.classList.add('fade-in');
    } else {
      button.classList.replace('fade-in', 'fade-out');
      setTimeout(() => button.classList.add('hidden'), 500);
    }
  });
}

const toggleButton = document.getElementById('btnToggle');
if (toggleButton) {
  toggleButton.addEventListener('click', toggleButtonsVisibility);
}

// Cargar y mostrar información del usuario
document.addEventListener('DOMContentLoaded', function() {
  let userInfo = {
    level: 1,
    experience: 0,
    tokens: 0,
    gems: 0
  };

  function loadUserInfo() {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUserInfo) {
      userInfo = storedUserInfo;
    }
    displayUserInfo();
  }

  function displayUserInfo() {
    document.getElementById('userLevel').textContent = `Nivel: ${userInfo.level}`;
    document.getElementById('userXP').textContent = `Experiencia: ${userInfo.experience}`;
    document.getElementById('userTokens').textContent = `Tokens: ${userInfo.tokens}`;
    document.getElementById('userGems').textContent = `Gemas: ${userInfo.gems}`;
  }

  function updateUserInfo(newTokens, newExperience, newLevel) {
    userInfo.tokens += newTokens;
    userInfo.experience += newExperience;
    userInfo.level = newLevel;

    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    displayUserInfo();
  }

  loadUserInfo();
});

// Calendar Functions
const calendarDate = document.getElementById("calendarDate");
const calendarInfo = document.getElementById("calendarInfo");

const hoy = new Date();
let currentDay = hoy.getDate();
calendarDate.textContent = currentDay;

function formatReminder(reminder) {
  if (typeof reminder === 'string') {
    return reminder;
  } else if (typeof reminder === 'object' && reminder !== null) {
    return Object.values(reminder).join(" | ");
  } else {
    return String(reminder);
  }
}

function loadReminders() {
  const storedReminders = JSON.parse(localStorage.getItem('reminders')) || {};
  const dateKey = `2025-05-${currentDay < 10 ? '0' + currentDay : currentDay}`;
  const reminders = storedReminders[dateKey];

  calendarInfo.innerHTML = '';

  if (!reminders) {
    calendarInfo.innerHTML = "<div>Sin pagos hoy 😊</div>";
  } else if (Array.isArray(reminders)) {
    reminders.forEach(reminder => {
      const div = document.createElement("div");
      div.textContent = formatReminder(reminder);
      calendarInfo.appendChild(div);
    });
  } else {
    const div = document.createElement("div");
    div.textContent = formatReminder(reminders);
    calendarInfo.appendChild(div);
  }
}

loadReminders();

function changeDay(offset) {
  currentDay += offset;
  if (currentDay < 1) currentDay = 31;
  if (currentDay > 31) currentDay = 1;
  calendarDate.textContent = currentDay;
  loadReminders();
}

const prevButton = document.getElementById("prevDay");
const nextButton = document.getElementById("nextDay");

if (prevButton) {
  prevButton.addEventListener("click", () => changeDay(-1));
}

if (nextButton) {
  nextButton.addEventListener("click", () => changeDay(1));
}

function saveReminder(day, reminder) {
  const storedReminders = JSON.parse(localStorage.getItem('reminders')) || {};

  if (!storedReminders[day]) {
    storedReminders[day] = [];
  }

  if (!Array.isArray(storedReminders[day])) {
    storedReminders[day] = [storedReminders[day]];
  }

  storedReminders[day].push(reminder);
  localStorage.setItem('reminders', JSON.stringify(storedReminders));
}

// Notificación al cargar una página
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const slotIndex = params.get('slot');
  if (slotIndex) {
    showNotification(slotIndex);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  if (localStorage.getItem('listSaved') === 'true') {
    showNotification();
    localStorage.removeItem('listSaved');
  }
});

function showNotification() {
  const notification = document.getElementById('notification');
  notification.classList.add('visible');

  setTimeout(function() {
    notification.classList.remove('visible');
  }, 3000);
}
