document.addEventListener('DOMContentLoaded', function () {
  const redeemBtn = document.getElementById('redeemBtn');
  const purchaseDetails = document.getElementById('purchaseDetails');
  const rewardList = document.getElementById('rewardList');
  let userInfo = {
    level: 1,
    experience: 0,
    tokens: 0,
    gems: 0
  };

  let savedProducts = JSON.parse(localStorage.getItem('markedProductHistory')) || [];
  if (!Array.isArray(savedProducts)) {
    savedProducts = [];
    console.error('Error al recuperar los productos marcados desde localStorage.');
  }

  function calculateRewards() {
    let redeemedTokens = 0;
    let redeemedExperience = 0;
    let redeemedGems = 0;

    savedProducts.forEach(item => {
      if (item.completed) {
        redeemedTokens += parseInt(item.quantity); 
        redeemedExperience += parseInt(item.quantity) * 10;
      }
    });

    redeemedGems = 1;
    userInfo.tokens += redeemedTokens;
    userInfo.experience += redeemedExperience;
    userInfo.gems += redeemedGems;

    const redeemedRewards = {
      tokens: redeemedTokens,
      experience: redeemedExperience,
      gems: redeemedGems
    };

    displayPurchaseDetails(savedProducts);
    displayRewards(redeemedRewards);

    const stats = {
      redeemedRewards,
      totalProducts: savedProducts.length,
      userInfo,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('stats', JSON.stringify(stats));

    redeemBtn.textContent = 'Finalizar';
    redeemBtn.removeEventListener('click', calculateRewards);
    redeemBtn.addEventListener('click', goToIndex);
  }

  function displayPurchaseDetails(products) {
    const productCounts = {};
    let totalItems = 0;

    products.forEach(item => {
      totalItems += parseInt(item.quantity);
      productCounts[item.name] = (productCounts[item.name] || 0) + parseInt(item.quantity);
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

  function displayRewards(rewards) {
    const rewardItems = Object.entries(rewards).map(([rewardName, rewardValue]) => {
      return `<li>${rewardName}: ${rewardValue}</li>`;
    }).join('');

    rewardList.innerHTML = rewardItems;
  }

  function goToIndex() {
    window.location.href = 'index.html';
  }

  redeemBtn.addEventListener('click', calculateRewards);
  displayPurchaseDetails(savedProducts);
});
