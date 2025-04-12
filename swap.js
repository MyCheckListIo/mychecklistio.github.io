// swap.js

// Variables iniciales
let userCoins = 500; // Monedas del usuario
let userTokens = 10; // Tokens del usuario
let tokenPrice = 0.02; // Precio inicial del token

// Obtener elementos del DOM
const userCoinsElement = document.getElementById('userCoins');
const userTokensElement = document.getElementById('userTokens');
const tokenPriceElement = document.getElementById('tokenPrice');
const swapAmountInput = document.getElementById('swapAmount');
const swapButton = document.getElementById('swapButton');
const withdrawButton = document.getElementById('withdrawButton');
const walletAddressInput = document.getElementById('walletAddress');
const buyCoinsButton = document.getElementById('buyCoinsButton');
const tokenChartCanvas = document.getElementById('tokenChart');

// Gráfico de precios
let tokenPriceData = {
  labels: [],
  datasets: [{
    label: 'Precio del Token (USD)',
    data: [],
    borderColor: 'lightgreen',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    fill: true
  }]
};

// Configuración del gráfico
const tokenChart = new Chart(tokenChartCanvas, {
  type: 'line',
  data: tokenPriceData,
  options: {
    responsive: true,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        ticks: { color: "white" } 
      },
      y: {
        beginAtZero: false,
        ticks: { color: "white" }
      }
    }
  }
});

// Función para actualizar el precio del token
function updateTokenPrice() {
  // Simulamos una variación en el precio del token
  tokenPrice = (Math.random() * (0.05 - 0.01) + 0.01).toFixed(2);
  tokenPriceElement.textContent = `${tokenPrice} USD`;

  // Actualizamos el gráfico de precios
  tokenPriceData.labels.push(tokenPriceData.labels.length + 1);
  tokenPriceData.datasets[0].data.push(parseFloat(tokenPrice));

  // Limitar los datos del gráfico para mostrar solo los últimos 10 puntos
  if (tokenPriceData.labels.length > 20) {
    tokenPriceData.labels.shift();
    tokenPriceData.datasets[0].data.shift();
  }

  tokenChart.update();
}

backBtn.addEventListener('click', function () {
    window.location.href = 'index.html'; 
  });

// Función para realizar el intercambio de monedas
function handleSwap() {
  const swapAmount = parseInt(swapAmountInput.value);

  if (swapAmount <= 0 || swapAmount > userCoins) {
    alert('Por favor, ingresa una cantidad válida para intercambiar.');
    return;
  }

  const tokensReceived = (swapAmount * tokenPrice).toFixed(2);
  userCoins -= swapAmount;
  userTokens += parseFloat(tokensReceived);

  // Actualizamos los elementos de la interfaz
  userCoinsElement.textContent = userCoins;
  userTokensElement.textContent = userTokens;

  // Limpiamos el campo de cantidad a intercambiar
  swapAmountInput.value = '';
}

// Función para retirar tokens
function handleWithdraw() {
  const walletAddress = walletAddressInput.value.trim();

  if (!walletAddress) {
    alert('Por favor, ingresa tu dirección MetaMask.');
    return;
  }

  if (userTokens <= 0) {
    alert('No tienes tokens para retirar.');
    return;
  }

  // Simulamos la retirada
  alert(`Has retirado ${userTokens} tokens a la dirección ${walletAddress}.`);

  // Restablecemos los tokens del usuario
  userTokens = 0;
  userTokensElement.textContent = userTokens;
  walletAddressInput.value = '';
}

// Función para comprar más monedas
function handleBuyCoins() {
  alert('Redirigiendo para comprar más monedas...');
  // Aquí podrías agregar la lógica para redirigir a un proceso de compra de monedas
}

// Evento para el botón de intercambio
swapButton.addEventListener('click', handleSwap);

// Evento para el botón de retirada
withdrawButton.addEventListener('click', handleWithdraw);

// Evento para el botón de compra de monedas
buyCoinsButton.addEventListener('click', handleBuyCoins);

// Actualizar el precio cada 3 segundos
setInterval(updateTokenPrice, 2000);

// Inicialización del gráfico y precio
updateTokenPrice();
