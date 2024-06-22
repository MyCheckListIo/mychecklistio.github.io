document.addEventListener('DOMContentLoaded', function() {
  const editNameBtn = document.getElementById('editNameBtn');
  const userNameInput = document.getElementById('userName');
  const userLevel = document.getElementById('userLevel');
  const userXP = document.getElementById('userXP');
  const userTokens = document.getElementById('userTokens');
  const userGems = document.getElementById('userGems');

  loadUserData();

  editNameBtn.addEventListener('click', function() {
    
    userNameInput.removeAttribute('readonly');
  });

  userNameInput.addEventListener('change', function() {
    saveUserName(this.value);
  });

  function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};

    userNameInput.value = userData.userName || 'Nombre de usuario';
    userLevel.textContent = userData.level || '1';
    userXP.textContent = userData.xp || '100 XP';
    userTokens.textContent = userData.tokens || '50';
    userGems.textContent = userData.gems || '10';
  }

  function saveUserName(newName) {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};

    userData.userName = newName;

    localStorage.setItem('userData', JSON.stringify(userData));
  }
});
