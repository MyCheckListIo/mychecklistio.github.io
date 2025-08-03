const baseRecetas = {
    estandar: [
      { nombre: "Pollo al horno", ingredientes: ["pollo", "papas", "ajo"] },
      { nombre: "Ensalada César", ingredientes: ["lechuga", "pollo", "aderezo César"] },
      { nombre: "Espaguetis a la boloñesa", ingredientes: ["pasta", "carne", "tomate"] },
    ],
    saludable: [
      { nombre: "Quinoa con verduras", ingredientes: ["quinoa", "calabacín", "pimiento"] },
      { nombre: "Salmón al vapor", ingredientes: ["salmón", "espárragos", "limón"] },
    ],
    vegana: [
      { nombre: "Tofu salteado", ingredientes: ["tofu", "brócoli", "salsa de soja"] },
      { nombre: "Ensalada de garbanzos", ingredientes: ["garbanzos", "tomate", "pepino"] },
    ],
    keto: [
      { nombre: "Huevos revueltos con aguacate", ingredientes: ["huevos", "aguacate", "aceite de oliva"] },
      { nombre: "Ensalada de pollo y aguacate", ingredientes: ["pollo", "aguacate", "lechuga"] },
    ]
  };
  
  function obtenerParametrosUrl() {
    const params = new URLSearchParams(window.location.search);
    return {
      dia: parseInt(params.get('dia')) || 1,
      tipo: params.get('tipo') || 'estandar'
    };
  }
  
  function mostrarReceta(dia, tipo) {
    const recetas = baseRecetas[tipo];
    if (!recetas) {
      mostrarError("Tipo de dieta no válido.");
      return;
    }
    const recetaIndex = (dia - 1) % recetas.length;
    const receta = recetas[recetaIndex];
  
    document.getElementById('tituloReceta').textContent = `Receta Día ${dia}`;
    document.getElementById('nombreReceta').textContent = receta.nombre;
  
    const listaIngredientes = document.getElementById('listaIngredientes');
    listaIngredientes.innerHTML = `<p style="font-style: italic; opacity: 0.7;">Ingredientes ocultos. Compra el día o el menú completo para desbloquearlos.</p>`;
  }
  
  function mostrarError(mensaje) {
    const main = document.querySelector('main');
    main.innerHTML = `<p style="color:#ffb3b3; font-weight: bold;">${mensaje}</p>`;
  }
  
  function generarUUID() {
    return crypto?.randomUUID?.() || Math.random().toString(36).substr(2, 9);
  }
  
  function obtenerUserInfo() {
    return JSON.parse(localStorage.getItem('userInfo')) || { level: 1, experience: 0, tokens: 0, gems: 0 };
  }
  
  function guardarUserInfo(info) {
    localStorage.setItem('userInfo', JSON.stringify(info));
  }
  
  function simularCompra(tipoCompra, costo) {
    let userInfo = obtenerUserInfo();
    if (userInfo.tokens < costo) {
      const confirmar = confirm(`No tienes suficientes tokens (${userInfo.tokens}). ¿Deseas ir a comprar más?`);
      if (confirmar) window.location.href = 'comprartokens.html';
      return;
    }
  
    const confirmarCompra = confirm(`Esta compra cuesta ${costo} tokens.\n¿Deseas continuar?`);
    if (!confirmarCompra) return;
  
    const { dia, tipo } = obtenerParametrosUrl();
    const accesoUUID = generarUUID();
  
    const accesos = JSON.parse(localStorage.getItem('accesosUsuarios')) || {};
    accesos[accesoUUID] = {
      tipoCompra,
      dia,
      tipoDieta: tipo,
      fechaCompra: new Date().toISOString()
    };
    localStorage.setItem('accesosUsuarios', JSON.stringify(accesos));
  
    userInfo.tokens -= costo;
    guardarUserInfo(userInfo);
  
    alert(`Compra exitosa: ${tipoCompra}\nTe quedan ${userInfo.tokens} tokens.`);
    window.location.href = `slotdieta.html?id=${accesoUUID}`;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const { dia, tipo } = obtenerParametrosUrl();
    mostrarReceta(dia, tipo);
  
    document.getElementById('btnComprarDia').addEventListener('click', () => {
      simularCompra(`Receta del Día ${dia}`, 10);
    });
  
    document.getElementById('btnComprarCompleto').addEventListener('click', () => {
      simularCompra('Menú completo de 7 días', 50);
    });
  
    const display = document.getElementById('userTokens');
    if (display) {
      const userInfo = obtenerUserInfo();
      display.textContent = userInfo.tokens;
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUserInfo && typeof storedUserInfo.tokens === 'number') {
      const tokenDisplay = document.getElementById('userTokens');
      if (tokenDisplay) {
        tokenDisplay.textContent = storedUserInfo.tokens;
      }
    }
  });
  