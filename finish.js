document.addEventListener('DOMContentLoaded', function () {
  const redeemBtn = document.getElementById('redeemBtn');
  const purchaseDetails = document.getElementById('purchaseDetails');
  const rewardList = document.getElementById('rewardList');
  const userLevel = document.getElementById('userLevel');
  const userExperience = document.getElementById('userExperience');
  const userTokens = document.getElementById('userTokens');
  const userGems = document.getElementById('userGems');

  // Información inicial del usuario
  let userInfo = {
    level: 1,
    experience: 0,
    tokens: 0,
    gems: 0
  };

  // Recuperar información del usuario desde localStorage
  const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (storedUserInfo) {
    userInfo = storedUserInfo;
  }

  // Recuperar productos marcados desde localStorage
  let savedProducts = JSON.parse(localStorage.getItem('markedProductHistory')) || [];
  if (!Array.isArray(savedProducts)) {
    savedProducts = [];
    console.error('Error al recuperar los productos marcados desde localStorage.');
  }

  // Mostrar información del usuario
  function displayUserInfo() {
    userLevel.textContent = userInfo.level;
    userExperience.textContent = userInfo.experience;
    userTokens.textContent = userInfo.tokens;
    userGems.textContent = userInfo.gems;
  }

  // Calcular recompensas
  function calculateRewards() {
    let redeemedTokens = 0;
    let redeemedExperience = 0;
    let redeemedGems = 0;

    savedProducts.forEach(item => {
      if (item.completed) {
        redeemedTokens += parseInt(item.quantity, 10);
        redeemedExperience += parseInt(item.quantity, 10) * 10;
      }
    });

    redeemedGems = 1; // Asigna una gema fija como recompensa

    // Actualizar la información del usuario
    userInfo.tokens += redeemedTokens;
    userInfo.experience += redeemedExperience;
    userInfo.gems += redeemedGems;

    // Recompensas canjeadas
    const redeemedRewards = {
      tokens: redeemedTokens,
      experience: redeemedExperience,
      gems: redeemedGems
    };

    // Mostrar detalles de la compra y recompensas
    displayPurchaseDetails(savedProducts);
    displayRewards(redeemedRewards);
    displayUserInfo();

    // Guardar estadísticas en localStorage
    const stats = {
      redeemedRewards,
      totalProducts: savedProducts.length,
      userInfo,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('stats', JSON.stringify(stats));

    // Guardar la información del usuario actualizada en localStorage
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    // Actualizar el botón para finalizar
    redeemBtn.textContent = 'Finalizar';
    redeemBtn.removeEventListener('click', calculateRewards);
    redeemBtn.addEventListener('click', goToIndex);
  }

  // Mostrar detalles de la compra
  function displayPurchaseDetails(products) {
    const productCounts = {};
    let totalItems = 0;

    products.forEach(item => {
      totalItems += parseInt(item.quantity, 10);
      productCounts[item.name] = (productCounts[item.name] || 0) + parseInt(item.quantity, 10);
    });

    purchaseDetails.innerHTML = `
      <div class="container">
        <h2>Detalles</h2>
        <p>Total de Productos Diferentes: ${Object.keys(productCounts).length}</p>
        <p>Cantidad Total de Ítems: ${totalItems}</p>
        <ul>
          ${Object.entries(productCounts).map(([productName, quantity]) => `<li>${productName}: ${quantity}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Mostrar recompensas
  function displayRewards(rewards) {
    const rewardItems = Object.entries(rewards).map(([rewardName, rewardValue]) => {
      return `<li>${rewardName}: ${rewardValue}</li>`;
    }).join('');

    rewardList.innerHTML = rewardItems;
  }

  // Redirigir a la página de inicio
  function goToIndex() {
    window.location.href = 'index.html';
  }

  // Agregar evento para el botón de canjear
  redeemBtn.addEventListener('click', calculateRewards);

  // Mostrar detalles iniciales de la compra y la información del usuario
  displayPurchaseDetails(savedProducts);
  displayUserInfo();
});
