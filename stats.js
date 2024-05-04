document.addEventListener('DOMContentLoaded', function () {
  const statsContainer = document.getElementById('statsContainer');
  const statsData = JSON.parse(localStorage.getItem('stats')) || {};

  function createBarChart(data) {
    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [{
          label: 'Productos Comprados',
          data: data,
          backgroundColor: 'rgba(355, 299, 32, 0.5)',
          borderColor: 'rgba(355, 299, 32, 0.2)',
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

  if (Object.keys(statsData).length > 0) {
    const productsByDayOfWeek = [10, 15, 20, 18, 12, 25, 30];
    
    createBarChart(productsByDayOfWeek);
  } else {
    statsContainer.innerHTML += `<p>No hay datos disponibles para mostrar el gráfico.</p>`;
    createBarChart([0, 0, 0, 0, 0, 0, 0]);
  }
});

function goToHistory() {
  window.location.href = 'history.html';
}
