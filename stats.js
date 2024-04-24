document.addEventListener('DOMContentLoaded', function () {
  const statsContainer = document.getElementById('statsContainer');
  const backBtn = document.getElementById('backBtn');
  const historyBtn = document.getElementById('historyBtn');

  // Obtener los datos del localStorage
  const totalLists = localStorage.getItem('savedLists') ? JSON.parse(localStorage.getItem('savedLists')).length : 0;
  const totalProducts = localStorage.getItem('totalProducts') ? parseInt(localStorage.getItem('totalProducts')) : 0;
  const productHistory = localStorage.getItem('productHistory') ? JSON.parse(localStorage.getItem('productHistory')) : [];

  // Mostrar estadísticas básicas
  statsContainer.innerHTML = `
    <div class="statCard">
      <h3>Cantidad de Listas</h3>
      <p>${totalLists}</p>
    </div>
    <div class="statCard">
      <h3>Cantidad de Productos Comprados</h3>
      <p>${totalProducts}</p>
    </div>
  `;

  // Generar gráfico de barras para cantidad de productos por día de la semana
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const productsByDayOfWeek = Array(7).fill(0);

  productHistory.forEach(item => {
    const date = new Date(item.date);
    const dayOfWeek = date.getDay();
    productsByDayOfWeek[dayOfWeek] += parseInt(item.quantity);
  });

  const chartContainer = document.createElement('div');
  chartContainer.classList.add('chartContainer');
  daysOfWeek.forEach((day, index) => {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${productsByDayOfWeek[index] * 10}px`;
    bar.textContent = `${day.slice(0, 3)}: ${productsByDayOfWeek[index]}`;
    chartContainer.appendChild(bar);
  });
  statsContainer.appendChild(chartContainer);

  // Evento de clic para volver al inicio
  backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // Evento de clic para ver el historial
  historyBtn.addEventListener('click', () => {
    window.location.href = 'history.html';
  });
});
