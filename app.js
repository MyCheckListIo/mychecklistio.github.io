function fadeInAnimation() {
  const container = document.querySelector('.container');
  if (container) {
    container.classList.add('fadeIn');
  }
}

document.addEventListener('DOMContentLoaded', fadeInAnimation);

function redirectToPage(pageName) {
  window.location.href = `${pageName}.html`;
}

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

document.addEventListener('DOMContentLoaded', function() {
  let userInfo = {
    level: 1,
    experience: 0,
    tokens: 0,
    gems: 0
  };

  // Cargar información del usuario desde localStorage
  function loadUserInfo() {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUserInfo) {
      userInfo = storedUserInfo;
    }
    displayUserInfo();
  }

  // Mostrar información del usuario en la interfaz
  function displayUserInfo() {
    document.getElementById('userLevel').textContent = `Nivel: ${userInfo.level}`;
    document.getElementById('userXP').textContent = `Experiencia: ${userInfo.experience}`;
    document.getElementById('userTokens').textContent = `Tokens: ${userInfo.tokens}`;
    document.getElementById('userGems').textContent = `Gemas: ${userInfo.gems}`;
  }

  // Actualizar información del usuario
  function updateUserInfo(newTokens, newExperience, newLevel) {
    userInfo.tokens += newTokens;
    userInfo.experience += newExperience;
    userInfo.level = newLevel; // Actualiza el nivel si es necesario

    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    displayUserInfo(); // Actualiza la visualización
  }

  // Ejemplo de función que podría ser llamada al completar una tarea
  function completeTask() {
    // Lógica para completar una tarea
    const tokensEarned = 5; // Ejemplo de tokens ganados
    const experienceGained = 10; // Ejemplo de experiencia ganada
    const newLevel = userInfo.experience + experienceGained >= 100 ? userInfo.level + 1 : userInfo.level; // Ejemplo de lógica de nivel

    updateUserInfo(tokensEarned, experienceGained, newLevel);
  }

  loadUserInfo(); // Cargar la información del usuario al inicio
});

const calendarDate = document.getElementById("calendarDate");
const calendarInfo = document.getElementById("calendarInfo");

const hoy = new Date();
let currentDay = hoy.getDate();
calendarDate.textContent = currentDay;

const recordatorios = [
  "Hoy vence: Luz",
  "Hoy vence: Gas",
  "Hoy vence: Agua",
  "Hoy vence: Internet",
  "Hoy vence: Obra Social",
  "Sin pagos hoy 😊"
];

calendarInfo.textContent = recordatorios[Math.floor(Math.random() * recordatorios.length)];

// Función para cambiar la fecha
function changeDay(offset) {
  currentDay += offset;
  if (currentDay < 1) currentDay = 31; // Asumir un mes de 31 días
  if (currentDay > 31) currentDay = 1; // Asumir un mes de 31 días

  calendarDate.textContent = currentDay;
  calendarInfo.textContent = recordatorios[Math.floor(Math.random() * recordatorios.length)];
}

// Asignar eventos a las flechas
const prevButton = document.getElementById("prevDay");
const nextButton = document.getElementById("nextDay");

if (prevButton) {
  prevButton.addEventListener("click", () => changeDay(-1)); // Retroceder un día
}

if (nextButton) {
  nextButton.addEventListener("click", () => changeDay(1)); // Avanzar un día
}
