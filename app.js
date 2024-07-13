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
  { id: 'btnStats', page: 'stats' },
  { id: 'btnUsuario', page: 'user' },
  { id: 'btnPrecios', page: 'precios' },
  { id: 'btnTopLeft', page: 'listasespeciales' }, 
  { id: 'btnTopRight', page: 'recompensadiaria' } 
];

buttons.forEach(btn => addButtonEvent(btn.id, btn.page));
