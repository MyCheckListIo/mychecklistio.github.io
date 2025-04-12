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
    const userData = JSON.parse(localStorage.getItem('userInfo')) || {};

    userNameInput.value = userData.userName || 'Nombre de usuario';
    userLevel.textContent = userData.level || '1';
    userXP.textContent = userData.experience || '0';
    userTokens.textContent = userData.tokens || '0';
    userGems.textContent = userData.gems || '0';
  }

  function saveUserName(newName) {
    const userData = JSON.parse(localStorage.getItem('userInfo')) || {};
    userData.userName = newName;

    localStorage.setItem('userInfo', JSON.stringify(userData));
  }
});
