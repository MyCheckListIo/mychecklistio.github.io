document.addEventListener('DOMContentLoaded', function () {
  const redeemBtn = document.getElementById('redeemBtn');

  const productHistory = JSON.parse(localStorage.getItem('productHistory')) || [];
  const rewards = JSON.parse(localStorage.getItem('rewards')) || {};

  const purchaseDetails = document.getElementById('purchaseDetails');
  const rewardList = document.getElementById('rewardList');

  // Supongamos que el nivel y la experiencia actual del usuario están en el objeto userInfo
  let userInfo = {
    level: 1,
    experience: 0,
    tokens: 0,
    gems: 0
  };

  function countProductsAndItems(history) {
    let productCounts = {};
    let totalItems = 0;

    history.forEach(item => {
      totalItems += item.quantity;
      if (productCounts.hasOwnProperty(item.name)) {
        productCounts[item.name] += item.quantity;
      } else {
        productCounts[item.name] = item.quantity;
      }
    });

    return { productCounts, totalItems };
  }

  const { productCounts, totalItems } = countProductsAndItems(productHistory);

  purchaseDetails.innerHTML = `
    <div class="container">
      <h2>Detalles de la Compra</h2>
      <p>Total de Productos Diferentes: ${Object.keys(productCounts).length}</p>
      <p>Cantidad Total de Ítems: ${totalItems}</p>
      <ul>
        ${Object.entries(productCounts).map(([productName, quantity]) => `<li>${productName}: ${quantity}</li>`).join('')}
      </ul>
    </div>
  `;

  redeemBtn.addEventListener('click', redeemRewards);

  function redeemRewards() {
    let redeemedTokens = totalItems; // 1 token por cada ítem
    let redeemedExperience = Object.keys(productCounts).length * 10; // 10 de experiencia por cada producto
    let redeemedGems = 1; // 1 gema por cada lista finalizada

    // Actualizar recompensas
    userInfo.tokens += redeemedTokens;
    userInfo.experience += redeemedExperience;
    userInfo.gems += redeemedGems;

    const redeemedRewards = {
      tokens: redeemedTokens,
      experience: redeemedExperience,
      gems: redeemedGems
    };

    const rewardItems = Object.entries(redeemedRewards).map(([rewardName, rewardValue]) => {
      return `<li>${rewardName}: ${rewardValue}</li>`;
    }).join('');

    rewardList.innerHTML = rewardItems;

    const stats = {
      productCounts,
      totalItems,
      redeemedRewards,
      userInfo,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('stats', JSON.stringify(stats));

    // Cambiar el texto del botón y su función
    redeemBtn.textContent = 'Finalizar';
    redeemBtn.removeEventListener('click', redeemRewards);
    redeemBtn.addEventListener('click', goToIndex);
  }

  function goToIndex() {
    window.location.href = 'index.html';
  }
});
