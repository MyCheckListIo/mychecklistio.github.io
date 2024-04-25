function fadeInAnimation() {
  const container = document.querySelector('.container');
  container.classList.add('fadeIn');
}

document.addEventListener('DOMContentLoaded', fadeInAnimation);

function handleTransitionEnd() {
  const container = document.querySelector('.container');
  container.style.opacity = '1';
}

function redirectToPage(pageName) {
  window.location.href = `${pageName}.html`;
}

document.getElementById('btnCrearLista').addEventListener('click', function() {
  redirectToPage('crearlista');
});

document.getElementById('btnListasGuardadas').addEventListener('click', function() {
  redirectToPage('listasguardadas');
});

document.getElementById('btnActivarLista').addEventListener('click', function() {
  redirectToPage('activarlista');
});

document.getElementById('btnStats').addEventListener('click', function() {
  redirectToPage('stats');
});

document.getElementById('btnTienda').addEventListener('click', function() {
  redirectToPage('shop');
});

document.getElementById('btnUsuario').addEventListener('click', function() {
  redirectToPage('user');
});
