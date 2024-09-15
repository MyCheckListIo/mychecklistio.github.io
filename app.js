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

document.getElementById('btnToggle').addEventListener('click', function() {
  const btnTopLeft = document.getElementById('btnTopLeft');
  const btnTopRight = document.getElementById('btnTopRight');
  
  if (btnTopLeft.classList.contains('hidden')) {
    btnTopLeft.classList.remove('hidden');
    btnTopLeft.classList.remove('fade-out');
    btnTopLeft.classList.add('fade-in');
    
    btnTopRight.classList.remove('hidden');
    btnTopRight.classList.remove('fade-out');
    btnTopRight.classList.add('fade-in');
  } else {
    btnTopLeft.classList.remove('fade-in');
    btnTopLeft.classList.add('fade-out');
    btnTopLeft.addEventListener('animationend', function() {
      btnTopLeft.classList.add('hidden');
    }, { once: true });
    
    btnTopRight.classList.remove('fade-in');
    btnTopRight.classList.add('fade-out');
    btnTopRight.addEventListener('animationend', function() {
      btnTopRight.classList.add('hidden');
    }, { once: true });
  }
});
