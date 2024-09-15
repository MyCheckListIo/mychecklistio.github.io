const recipes = [
  { name: 'Ensalada de tomate y huevo', ingredients: ['tomates', 'huevos', 'aceite', 'sal'] },
  { name: 'Arroz con pollo', ingredients: ['arroz', 'pollo', 'cebolla', 'ajo', 'caldo', 'pimiento'] },
  { name: 'Tortilla de huevos', ingredients: ['huevos', 'patatas', 'aceite', 'sal'] },
  { name: 'Pizza margarita', ingredients: ['tomates', 'queso', 'harina', 'levadura', 'aceite'] },
  { name: 'Sopa de arroz', ingredients: ['arroz', 'zanahorias', 'caldo', 'pollo', 'cebolla'] },
  { name: 'Enchiladas verdes', ingredients: ['tortillas', 'pollo', 'tomates verdes', 'crema', 'queso'] },
  { name: 'Guacamole', ingredients: ['aguacates', 'tomates', 'cebolla', 'cilantro', 'limón'] },
  { name: 'Ceviche de pescado', ingredients: ['pescado', 'limón', 'cebolla', 'cilantro', 'tomates', 'chile'] },
  { name: 'Chilaquiles rojos', ingredients: ['tortillas', 'salsa roja', 'queso', 'crema', 'pollo', 'cebolla'] },
  { name: 'Spaghetti a la boloñesa', ingredients: ['spaghetti', 'carne molida', 'tomate', 'ajo', 'cebolla'] },
  { name: 'Tacos de carnitas', ingredients: ['tortillas', 'carnitas', 'cilantro', 'cebolla', 'limón'] },
  { name: 'Sándwich de atún', ingredients: ['pan', 'atún', 'mayonesa', 'tomates', 'lechuga'] },
  { name: 'Pollo al curry', ingredients: ['pollo', 'curry', 'leche de coco', 'arroz', 'ajo', 'jengibre'] },
  { name: 'Guiso de lentejas', ingredients: ['lentejas', 'zanahorias', 'papas', 'chorizo', 'ajo'] },
  { name: 'Tacos de pescado', ingredients: ['pescado', 'tortillas', 'repollo', 'salsa', 'limón'] }
];

const ingredientInput = document.getElementById('ingredientInput');
const ingredientList = document.getElementById('ingredientList');
const recipeList = document.getElementById('recipeList');
const recipeDetails = document.getElementById('recipeDetails');
const tokensDisplay = document.getElementById('tokensDisplay');

let selectedIngredients = [];
let userTokens = 20;

tokensDisplay.textContent = `Tokens: ${userTokens}`;

ingredientInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    const ingredient = ingredientInput.value.trim().toLowerCase();

    if (ingredient && !selectedIngredients.includes(ingredient)) {
      selectedIngredients.push(ingredient);
      renderIngredients();
      updateRecipeList();
    }

    ingredientInput.value = '';
  }
});

function renderIngredients() {
  ingredientList.innerHTML = '';

  selectedIngredients.forEach((ingredient, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${ingredient} <button onclick="removeIngredient(${index})" class="remove-btn">X</button>`;
    ingredientList.appendChild(li);
  });
}

function removeIngredient(index) {
  selectedIngredients.splice(index, 1);
  renderIngredients();
  updateRecipeList();
}

function updateRecipeList() {
  recipeList.innerHTML = '';

  const filteredRecipes = recipes.filter(recipe =>
    selectedIngredients.every(ingredient => recipe.ingredients.includes(ingredient))
  );

  filteredRecipes.forEach(recipe => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${recipe.name}</span>
                    <div class="recipe-options">
                      <button class="recipe-btn" onclick="viewDetails('${recipe.name}')">Detalles</button>
                      <button class="recipe-btn" onclick="addToFavorites('${recipe.name}')">Favoritos</button>
                      <button class="recipe-btn" onclick="shareRecipe('${recipe.name}')">Compartir</button>
                    </div>`;
    recipeList.appendChild(li);
  });

  if (filteredRecipes.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No hay recetas disponibles con los ingredientes seleccionados.';
    recipeList.appendChild(li);
  }
}

function viewDetails(recipeName) {
  recipeDetails.innerHTML = '';

  const selectedRecipe = recipes.find(recipe => recipe.name === recipeName);

  recipeDetails.innerHTML = `
    <h3>${selectedRecipe.name}</h3>
    <p>Ingredientes:</p>
    <ul>
      ${selectedRecipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
    </ul>
    <p>Precio: ${selectedRecipe.price} tokens</p>
    <button onclick="buyRecipe('${selectedRecipe.name}', ${selectedRecipe.price})" class="buy-btn">Comprar</button>
  `;
}

function buyRecipe(recipeName, recipePrice) {
  if (userTokens >= recipePrice) {
    userTokens -= recipePrice;
    tokensDisplay.textContent = `Tokens: ${userTokens}`;
    
    let purchasedRecipes = JSON.parse(localStorage.getItem('purchasedRecipes')) || [];
    purchasedRecipes.push(recipeName);
    localStorage.setItem('purchasedRecipes', JSON.stringify(purchasedRecipes));
    
    alert(`Has comprado la receta: ${recipeName}. Ahora está disponible en tu lista.`);
  } else {
    alert('No tienes suficientes tokens para comprar esta receta.');
  }
}

function addToFavorites(recipeName) {
  alert(`Añadido a Favoritos: ${recipeName}`);
}

function shareRecipe(recipeName) {
  alert(`Compartiendo receta: ${recipeName}`);
}

function goHome() {
  window.location.href = 'index.html';
}