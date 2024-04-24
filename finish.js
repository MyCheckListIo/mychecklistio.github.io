document.addEventListener('DOMContentLoaded', function () {
  const redeemBtn = document.getElementById('redeemBtn');

  const totalProducts = localStorage.getItem('totalProducts');
  const productHistory = JSON.parse(localStorage.getItem('productHistory'));
  const rewards = JSON.parse(localStorage.getItem('rewards'));

  const purchaseDetails = document.getElementById('purchaseDetails');
  purchaseDetails.innerHTML = `
    <div class="container">
      <h2>Items</h2>
      <p>Total de Productos Comprados: ${totalProducts}</p>
      <ul>
        ${productHistory.map(item => `<li>${item.name} - ${item.quantity} ${item.unit}</li>`).join('')}
      </ul>
    </div>
  `;

  const userRewards = document.getElementById('userRewards');
  userRewards.innerHTML = `
    <div class="container">
      <h2>Recompensas</h2>
      <p>Experiencia Ganada: ${rewards.experience}</p>
      <p>Puntos de Lealtad: ${rewards.loyaltyPoints}</p>
      <p>Cupones Obtenidos:</p>
      <ul>
        ${rewards.coupons.map(coupon => `<li>${coupon}</li>`).join('')}
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

    localStorage.setItem('redeemedRewards', JSON.stringify(redeemedRewards));

    localStorage.removeItem('slot1');

    window.location.href = 'index.html';
  }
});
