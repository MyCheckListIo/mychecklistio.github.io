document.addEventListener('DOMContentLoaded', function () {
  const buyItemBtn = document.getElementById('buyItemBtn');
  const backBtn = document.getElementById('backBtn');
  const shopItems = document.getElementById('shopItems');

  // Ejemplo de ítems en la tienda (reemplazar con tus datos)
  const itemsInShop = [
    { name: 'Receta de Pastel de Chocolate', price: 50 },
    { name: 'Aspecto "Héroe Oscuro"', price: 100 },
    { name: 'Receta de Mojito Refrescante', price: 30 }
  ];

  // Mostrar los ítems en la tienda
  shopItems.innerHTML = itemsInShop.map(item => `
    <div class="shopItem">
      <h2>${item.name}</h2>
      <p>Precio: ${item.price} MCL</p>
    </div>
  `).join('');

  // Evento click para comprar un ítem
  buyItemBtn.addEventListener('click', function () {
    // Aquí iría la lógica para comprar un ítem
    alert('¡Item comprado!');
  });

  // Botón para volver al inicio
  backBtn.addEventListener('click', function () {
    window.location.href = 'index.html';
  });
});
