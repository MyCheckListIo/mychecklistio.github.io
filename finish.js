document.addEventListener('DOMContentLoaded', function () {
  const redeemBtn = document.getElementById('redeemBtn');
  const purchaseDetails = document.getElementById('purchaseDetails');
  const rewardList = document.getElementById('rewardList');
  const userLevel = document.getElementById('userLevel');
  const userExperience = document.getElementById('userExperience');
  const userTokens = document.getElementById('userTokens');
  const userGems = document.getElementById('userGems');

  let userInfo = {
    level: 1,
    experience: 0,
    tokens: 0,
    gems: 0
  };

  try {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUserInfo) {
      userInfo = storedUserInfo;
    }
  } catch (error) {
    console.error('Error al recuperar la información del usuario:', error);
  }

  let savedProducts = [];
  try {
    savedProducts = JSON.parse(localStorage.getItem('markedProductHistory')) || [];
    if (!Array.isArray(savedProducts)) {
      savedProducts = [];
      console.error('Error al recuperar los productos marcados desde localStorage.');
    }
  } catch (error) {
    console.error('Error al recuperar los productos marcados:', error);
  }

  function displayUserInfo() {
    userLevel.textContent = userInfo.level || 'Desconocido';
    userExperience.textContent = userInfo.experience || 'Desconocido';
    userTokens.textContent = userInfo.tokens || 'Desconocido';
    userGems.textContent = userInfo.gems || 'Desconocido';
  }

  function calculateRewards() {
    let redeemedTokens = 0;
    let redeemedExperience = 0;
    let redeemedGems = 0;

    savedProducts.forEach(item => {
      if (item.completed) {
        redeemedTokens += parseInt(item.quantity, 10) || 0;
        redeemedExperience += (parseInt(item.quantity, 10) || 0) * 10;
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
    displayUserInfo();

    const stats = {
      redeemedRewards,
      totalProducts: savedProducts.length,
      userInfo,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('stats', JSON.stringify(stats));
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    // Guardar los detalles de la lista en el historial
    const listId = saveToHistory({
      name: 'Lista Finalizada',
      items: savedProducts,
      redeemedRewards,
      totalProducts: savedProducts.length,
      userInfo
    });

    // Mostrar el ID de la lista finalizada
    alert(`Lista finalizada. ID: ${listId}`);

    redeemBtn.textContent = 'Finalizar';
    redeemBtn.removeEventListener('click', calculateRewards);
    redeemBtn.addEventListener('click', goToIndex);
  }

  function displayPurchaseDetails(products) {
    const productCounts = {};
    let totalItems = 0;

    products.forEach(item => {
      totalItems += parseInt(item.quantity, 10) || 0;
      if (item.completed) {
        productCounts[item.name] = (productCounts[item.name] || 0) + (parseInt(item.quantity, 10) || 0);
      }
    });

    purchaseDetails.innerHTML = `
      <div class="container">
        <h2>Detalles</h2>
        <p>Total de Productos Diferentes: ${Object.keys(productCounts).length}</p>
        <p>Cantidad Total de Ítems: ${totalItems}</p>
        <ul>
          ${Object.entries(productCounts).map(([productName, quantity]) => `<li>${productName}: ${quantity} kg</li>`).join('')}
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
  displayUserInfo();
});

function saveToHistory(list) {
  let history = [];

  try {
    const existingData = localStorage.getItem('history');
    if (existingData) {
      history = JSON.parse(existingData);
    }
  } catch (error) {
    console.error('Error al recuperar el historial:', error);
  }

  // Generar un ID único usando un número aleatorio
  const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

  const newEntry = {
    id: generateUniqueId(), // Usar el ID único generado
    name: list.name || 'Lista sin nombre',
    items: list.items || [],
    redeemedRewards: list.redeemedRewards || {},
    totalProducts: list.totalProducts || 0,
    userInfo: list.userInfo || {},
    timestamp: new Date().toISOString()
  };

  history.push(newEntry);

  try {
    localStorage.setItem('history', JSON.stringify(history));
  } catch (error) {
    console.error('Error al guardar el historial:', error);
  }

  // Guardar el nuevo objeto con su ID en localStorage
  try {
    localStorage.setItem(`list_${newEntry.id}`, JSON.stringify(newEntry));
  } catch (error) {
    console.error('Error al guardar el objeto de la lista en localStorage:', error);
  }

  return newEntry.id; // Retornar el ID único generado
}
