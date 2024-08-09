document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('productList');
    const actionContainer = document.getElementById('actionContainer');
    const existingListSelect = document.getElementById('existingListSelect');
    const addCategoryButton = document.getElementById('addCategoryButton');
    const newCategoryInput = document.getElementById('newCategoryInput');
    const categorySelect = document.getElementById('categorySelect');
    const categorySelectAction = document.getElementById('categorySelectAction');
    const renameButton = document.getElementById('renameButton');
    const deleteButton = document.getElementById('deleteButton');
    const assignCategoryButton = document.getElementById('assignCategoryButton');
    const addCategoryButtonAction = document.getElementById('addCategoryButtonAction');
    const newCategoryInputAction = document.getElementById('newCategoryInputAction');
    const addToExistingListButton = document.getElementById('addToExistingListButton');
    const addToNewListButton = document.getElementById('addToNewListButton');
    const newListInput = document.getElementById('newListInput');
    const listActions = document.getElementById('listActions');

    function displaySavedProducts() {
        const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
        productList.innerHTML = '';

        savedItems.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.category}</p>
                <button class="action-button" data-id="${product.id}">Seleccionar</button>
            `;

            productList.appendChild(productCard);
        });
    }

    productList.addEventListener('click', (event) => {
        if (event.target.classList.contains('action-button')) {
            // Convertir explícitamente productId a cadena
            const productId = String(event.target.getAttribute('data-id'));
            console.log('Botón de seleccionar clickeado, ID del producto:', productId);  // Depuración
    
            const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
            const selectedProduct = savedItems.find(item => String(item.id) === productId);
    
            if (selectedProduct) {
                actionContainer.classList.remove('hidden');
                document.getElementById('selectedProductName').textContent = selectedProduct.name;
                document.getElementById('renameInput').value = selectedProduct.name;
                document.getElementById('selectedProductCategory').textContent = selectedProduct.category;
    
                existingListSelect.innerHTML = `
                    <option value="">Seleccionar Lista Guardada</option>
                    <option value="list1">Lista 1</option>
                    <option value="list2">Lista 2</option>
                `;
                existingListSelect.classList.remove('hidden');
    
                categorySelectAction.innerHTML = categorySelect.innerHTML;
                categorySelectAction.value = selectedProduct.category;
    
                newCategoryInputAction.style.display = categorySelectAction.value === 'new' ? 'inline-block' : 'none';
    
                listActions.classList.remove('hidden');
                actionContainer.setAttribute('data-id', productId);
            }
        }
    });    

    addCategoryButton.addEventListener('click', () => {
        const newCategory = newCategoryInput.value.trim();
        if (newCategory) {
            const option = document.createElement('option');
            option.value = newCategory;
            option.textContent = newCategory;
            categorySelect.appendChild(option);
            newCategoryInput.value = '';
            newCategoryInput.style.display = 'none';
        }
    });

    categorySelect.addEventListener('change', () => {
        newCategoryInput.style.display = categorySelect.value === 'new' ? 'inline-block' : 'none';
    });

    renameButton.addEventListener('click', () => {
        const productId = actionContainer.getAttribute('data-id');
        const newName = document.getElementById('renameInput').value.trim();
        if (newName) {
            const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
            const productIndex = savedItems.findIndex(item => item.id === productId);

            if (productIndex !== -1) {
                savedItems[productIndex].name = newName;
                localStorage.setItem('savedItems', JSON.stringify(savedItems));
                displaySavedProducts();
                actionContainer.classList.add('hidden');
            }
        }
    });

    deleteButton.addEventListener('click', () => {
        const productId = actionContainer.getAttribute('data-id');
        let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
        savedItems = savedItems.filter(item => item.id !== productId);
        localStorage.setItem('savedItems', JSON.stringify(savedItems));
        displaySavedProducts();
        actionContainer.classList.add('hidden');
    });

    assignCategoryButton.addEventListener('click', () => {
        const productId = actionContainer.getAttribute('data-id');
        const selectedCategory = categorySelectAction.value;
        if (selectedCategory) {
            const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
            const productIndex = savedItems.findIndex(item => item.id === productId);

            if (productIndex !== -1) {
                savedItems[productIndex].category = selectedCategory;
                localStorage.setItem('savedItems', JSON.stringify(savedItems));
                displaySavedProducts();
                actionContainer.classList.add('hidden');
            }
        }
    });

    addCategoryButtonAction.addEventListener('click', () => {
        const newCategory = newCategoryInputAction.value.trim();
        if (newCategory) {
            const option = document.createElement('option');
            option.value = newCategory;
            option.textContent = newCategory;
            categorySelectAction.appendChild(option);
            newCategoryInputAction.value = '';
            newCategoryInputAction.style.display = 'none';
        }
    });

    categorySelectAction.addEventListener('change', () => {
        newCategoryInputAction.style.display = categorySelectAction.value === 'new' ? 'inline-block' : 'none';
    });

    addToExistingListButton.addEventListener('click', () => {
        const productId = actionContainer.getAttribute('data-id');
        const selectedList = existingListSelect.value;
        if (selectedList) {
            // Implementa la lógica para agregar el producto a la lista seleccionada
            console.log('Producto agregado a la lista existente:', selectedList);  // Depuración
            actionContainer.classList.add('hidden');
        }
    });

    addToNewListButton.addEventListener('click', () => {
        const productId = actionContainer.getAttribute('data-id');
        const newListName = newListInput.value.trim();
        if (newListName) {
            // Implementa la lógica para crear una nueva lista y agregar el producto
            console.log('Producto agregado a la nueva lista:', newListName);  // Depuración
            newListInput.value = '';
            newListInput.style.display = 'none';
            actionContainer.classList.add('hidden');
        }
    });

    existingListSelect.addEventListener('change', () => {
        newListInput.style.display = existingListSelect.value ? 'none' : 'inline-block';
    });

    addToNewListButton.addEventListener('click', () => {
        newListInput.style.display = 'inline-block';
    });

    displaySavedProducts();
});
