document.addEventListener('DOMContentLoaded', () => {
    const btnAbrirCofre = document.getElementById('btnAbrirCofre');
    const resultado = document.getElementById('resultadoRecompensa');
    const rachaContainer = document.getElementById('rachaContainer');
    const completadosContainer = document.getElementById('logrosCompletadosList');
    const pendientesContainer = document.getElementById('logrosPendientesList');
  
    const hoy = new Date().toDateString();
    const ayer = new Date(Date.now() - 86400000).toDateString();
  
    let userStats = JSON.parse(localStorage.getItem('userStats')) || {};
    userStats = {
    nivel: userStats.nivel || 1,
    experiencia: userStats.experiencia || 0,
    tokens: userStats.tokens || 0,
    gemas: userStats.gemas || 0,
    ultimaRecompensa: userStats.ultimaRecompensa || null,
    racha: userStats.racha || 0,
    logros: Array.isArray(userStats.logros) ? userStats.logros : []
    };
  
    rachaContainer.textContent = `Racha actual: ${userStats.racha} días`;
  
    if (userStats.ultimaRecompensa === hoy) {
      btnAbrirCofre.disabled = true;
      resultado.textContent = "¡Ya reclamaste tu recompensa de hoy!";
    }
  
    mostrarLogros(userStats);
  
    btnAbrirCofre.addEventListener('click', () => {
      if (userStats.ultimaRecompensa === hoy) return;
  
      const recompensa = getRecompensaAleatoria();
      userStats.experiencia += recompensa.xp;
      userStats.tokens += recompensa.tokens;
      userStats.gemas += recompensa.gemas;
  
      if (userStats.ultimaRecompensa === ayer) {
        userStats.racha++;
      } else {
        userStats.racha = 1;
      }
  
      userStats.ultimaRecompensa = hoy;
  
      verificarLogros(userStats);
  
      localStorage.setItem('userStats', JSON.stringify(userStats));
  
      resultado.textContent = `¡Ganaste +${recompensa.tokens} tokens, +${recompensa.xp} XP y +${recompensa.gemas} gemas!`;
      rachaContainer.textContent = `Racha actual: ${userStats.racha} días`;
  
      btnAbrirCofre.disabled = true;
      mostrarLogros(userStats);
    });
  
    function getRecompensaAleatoria() {
      const recompensas = [
        { xp: 10, tokens: 5, gemas: 0 },
        { xp: 20, tokens: 10, gemas: 1 },
        { xp: 15, tokens: 7, gemas: 0 },
        { xp: 25, tokens: 12, gemas: 2 },
        { xp: 30, tokens: 15, gemas: 3 }
      ];
      return recompensas[Math.floor(Math.random() * recompensas.length)];
    }
  
    function verificarLogros(stats) {
      const todosLosLogros = [
        { nombre: "Comprar 5 Manzanas", condicion: stats.tokens >= 25, id: "logro1" },
        { nombre: "Beber 2 Litros de Agua", condicion: stats.gemas >= 2, id: "logro2" },
        { nombre: "Hacer Ejercicio por 5 Días Consecutivos", condicion: stats.racha >= 5, id: "logro3" }
      ];
  
      todosLosLogros.forEach(logro => {
        if (logro.condicion && !stats.logros.includes(logro.id)) {
          stats.logros.push(logro.id);
          alert(`¡Logro alcanzado! ${logro.nombre}`);
        }
      });
    }
  
    function mostrarLogros(stats) {
      const todosLosLogros = [
        { nombre: "Comprar 5 Manzanas", id: "logro1" },
        { nombre: "Beber 2 Litros de Agua", id: "logro2" },
        { nombre: "Hacer Ejercicio por 5 Días Consecutivos", id: "logro3" }
      ];
  
      completadosContainer.innerHTML = '';
      pendientesContainer.innerHTML = '';
  
      todosLosLogros.forEach(logro => {
        const div = document.createElement('div');
        div.classList.add('logro');
  
        const texto = document.createElement('p');
        texto.textContent = logro.nombre;
        div.appendChild(texto);
  
        if (stats.logros.includes(logro.id)) {
          div.classList.add('completado');
          completadosContainer.appendChild(div);
        } else {
          div.classList.add('pendiente');
          pendientesContainer.appendChild(div);
        }
      });
    }
  });
  