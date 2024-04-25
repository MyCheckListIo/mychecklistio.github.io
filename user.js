document.addEventListener('DOMContentLoaded', function() {
  const editNameBtn = document.getElementById('editNameBtn');
  const userNameInput = document.getElementById('userName');
  const userLevel = document.getElementById('userLevel');
  const userXP = document.getElementById('userXP');
  const userTokens = document.getElementById('userTokens');
  const userGems = document.getElementById('userGems');

  // Cargar datos del usuario al cargar la página
  loadUserData();

  editNameBtn.addEventListener('click', function() {
    // Habilitar la edición del nombre de usuario
    userNameInput.removeAttribute('readonly');
  });

  userNameInput.addEventListener('change', function() {
    // Guardar el nuevo nombre de usuario en localStorage al cambiar
    saveUserName(this.value);
  });

  function loadUserData() {
    // Cargar datos del usuario desde localStorage
    const userData = JSON.parse(localStorage.getItem('userData')) || {};

    // Mostrar datos en la página
    userNameInput.value = userData.userName || 'Nombre de usuario';
    userLevel.textContent = userData.level || '1';
    userXP.textContent = userData.xp || '100 XP';
    userTokens.textContent = userData.tokens || '50';
    userGems.textContent = userData.gems || '10';
  }

  function saveUserName(newName) {
    // Cargar datos del usuario desde localStorage
    const userData = JSON.parse(localStorage.getItem('userData')) || {};

    // Actualizar el nombre de usuario en los datos del usuario
    userData.userName = newName;

    // Guardar los datos actualizados en localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
  }
});
