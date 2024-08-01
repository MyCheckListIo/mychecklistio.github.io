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

  function updateStatsDetails() {
    document.getElementById('listasCreadas').textContent = statsData.listasCreadas || 0;
    document.getElementById('itemsFinalizados').textContent = statsData.itemsFinalizados || 0;
    document.getElementById('experienciaUsuario').textContent = statsData.experienciaUsuario || 0;
    document.getElementById('nivel').textContent = statsData.nivel || 1;
    document.getElementById('monedasGanadasTotal').textContent = statsData.monedasGanadasTotal || 0;
    document.getElementById('monedasGastadas').textContent = statsData.monedasGastadas || 0;
    document.getElementById('gemasTotal').textContent = statsData.gemasTotal || 0;
    document.getElementById('gemasGastadas').textContent = statsData.gemasGastadas || 0;
  }

  function updateBarChart() {
    const productsByDayOfWeek = statsData.productsByDayOfWeek || [0, 0, 0, 0, 0, 0, 0];
    createBarChart(productsByDayOfWeek);
  }

  if (Object.keys(statsData).length > 0) {
    updateStatsDetails();
    updateBarChart();
  } else {
    statsContainer.innerHTML = `<p>No hay datos disponibles para mostrar el gráfico.</p>`;
    createBarChart([0, 0, 0, 0, 0, 0, 0]);
  }
});

function goToHistory() {
  window.location.href = 'history.html';
}

function saveStats() {
  localStorage.setItem('stats', JSON.stringify(statsData));
}

function addList() {
  statsData.listasCreadas = (statsData.listasCreadas || 0) + 1;
  saveStats();
  updateStatsDetails();
}

function finalizeItem() {
  statsData.itemsFinalizados = (statsData.itemsFinalizados || 0) + 1;
  saveStats();
  updateStatsDetails();
}

function gainExperience(points) {
  statsData.experienciaUsuario = (statsData.experienciaUsuario || 0) + points;
  saveStats();
  updateStatsDetails();
}

function spendCoins(amount) {
  statsData.monedasGastadas = (statsData.monedasGastadas || 0) + amount;
  saveStats();
  updateStatsDetails();
}

function gainCoins(amount) {
  statsData.monedasGanadasTotal = (statsData.monedasGanadasTotal || 0) + amount;
  saveStats();
  updateStatsDetails();
}

function spendGems(amount) {
  statsData.gemasGastadas = (statsData.gemasGastadas || 0) + amount;
  saveStats();
  updateStatsDetails();
}

function gainGems(amount) {
  statsData.gemasTotal = (statsData.gemasTotal || 0) + amount;
  saveStats();
  updateStatsDetails();
}

function updateDayProductCount(dayIndex, count) {
  statsData.productsByDayOfWeek = statsData.productsByDayOfWeek || [0, 0, 0, 0, 0, 0, 0];
  statsData.productsByDayOfWeek[dayIndex] = count;
  saveStats();
  updateBarChart();
}

function goToHistory() {
  window.location.href = 'history.html';
}
