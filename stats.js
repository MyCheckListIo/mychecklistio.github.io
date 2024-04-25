document.addEventListener('DOMContentLoaded', function () {
  const statsContainer = document.getElementById('statsContainer');
  const productHistory = localStorage.getItem('productHistory') ? JSON.parse(localStorage.getItem('productHistory')) : [];

  // Función para crear el gráfico
  function createBarChart(data) {
    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [{
          label: 'Productos Comprados',
          data: data,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  if (productHistory.length > 0) {
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const productsByDayOfWeek = Array(7).fill(0);

    // Simulación de datos para el gráfico
    productsByDayOfWeek[0] = 5; // Lunes
    productsByDayOfWeek[1] = 10; // Martes
    productsByDayOfWeek[2] = 8; // Miércoles
    productsByDayOfWeek[3] = 15; // Jueves
    productsByDayOfWeek[4] = 12; // Viernes
    productsByDayOfWeek[5] = 20; // Sábado
    productsByDayOfWeek[6] = 7; // Domingo

    createBarChart(productsByDayOfWeek);

    // Obtener datos del usuario del localStorage y llenarlos en la página
    document.getElementById('listasCreadas').textContent = localStorage.getItem('listasCreadas') || '0';
    document.getElementById('itemsFinalizados').textContent = localStorage.getItem('itemsFinalizados') || '0';
    document.getElementById('experienciaUsuario').textContent = localStorage.getItem('experienciaUsuario') || 'Nivel 1';
    document.getElementById('nivel').textContent = localStorage.getItem('nivel') || '1';
    document.getElementById('monedasGanadasTotal').textContent = localStorage.getItem('monedasGanadasTotal') || '0';
    document.getElementById('monedasGastadas').textContent = localStorage.getItem('monedasGastadas') || '0';
    document.getElementById('gemasTotal').textContent = localStorage.getItem('gemasTotal') || '0';
    document.getElementById('gemasGastadas').textContent = localStorage.getItem('gemasGastadas') || '0';
  } else {
    statsContainer.innerHTML += `<p>No hay datos disponibles para mostrar el gráfico.</p>`;
    createBarChart([0, 0, 0, 0, 0, 0, 0]); // Crear un gráfico con valores predeterminados

    // Puedes establecer valores predeterminados para los datos adicionales aquí también
  }
});

function goToHistory() {
  window.location.href = 'history.html';
}