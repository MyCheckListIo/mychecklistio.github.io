document.addEventListener('DOMContentLoaded', function () {
  const redeemBtn = document.getElementById('redeemBtn');

  const productHistory = JSON.parse(localStorage.getItem('productHistory'));
  const rewards = JSON.parse(localStorage.getItem('rewards'));

  const purchaseDetails = document.getElementById('purchaseDetails');
  const userRewards = document.getElementById('userRewards');

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
      <h2>Items</h2>
      <p>Total de Productos Diferentes: ${Object.keys(productCounts).length}</p>
      <p>Cantidad Total de Ítems: ${totalItems}</p>
      <ul>
        ${Object.entries(productCounts).map(([productName, quantity]) => `<li>${productName}: ${quantity}</li>`).join('')}
      </ul>
    </div>
  `;

  redeemBtn.addEventListener('click', redeemRewards);

  function redeemRewards() {
    const redeemedRewards = {
      experience: 100,
      loyaltyPoints: 50,
      coupons: ['Descuento 10%', 'Envío gratis']
    };

    const stats = {
      productCounts,
      totalItems,
      redeemedRewards,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('stats', JSON.stringify(stats));

    window.location.href = 'index.html';
  }
});
