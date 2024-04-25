document.addEventListener('DOMContentLoaded', function () {
  const buyItemBtn = document.getElementById('buyItemBtn');
  const backBtn = document.getElementById('backBtn');
  const shopItems = document.getElementById('shopItems');

  const itemsInShop = [
    { name: 'Receta de Pastel de Chocolate', price: 50 },
    { name: 'Aspecto "Héroe Oscuro"', price: 100 },
    { name: 'Receta de Mojito Refrescante', price: 30 }
  ];

  shopItems.innerHTML = itemsInShop.map(item => `
    <div class="shopItem">
      <h2>${item.name}</h2>
      <p>Precio: ${item.price} MCL</p>
    </div>
  `).join('');

  buyItemBtn.addEventListener('click', function () {
    alert('¡Item comprado!');
  });

  backBtn.addEventListener('click', function () {
    window.location.href = 'index.html';
  });
});
