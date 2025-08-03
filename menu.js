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
  
  function generarMenu(dieta, personas, dias) {
    if (!baseRecetas[dieta]) {
      alert(`Dieta no válida: ${dieta}`);
      return;
    }
  
    const recetas = baseRecetas[dieta];
    const menu = [];
  
    for (let i = 0; i < dias; i++) {
      const recetaIndex = i % recetas.length;
      menu.push({
        dia: i + 1,
        receta: recetas[recetaIndex].nombre,
        ingredientes: recetas[recetaIndex].ingredientes,
        personas,
        desbloqueada: false
      });
    }
  
    const menuFinal = {
      id: crypto.randomUUID(),
      fechaCreacion: new Date().toISOString(),
      dieta,
      personas,
      dias,
      recetas: menu
    };
  
    guardarMenu(menuFinal);
    mostrarMenu(menuFinal);
  
    return menuFinal;
  }
  
  function guardarMenu(menu) {
    const historial = JSON.parse(localStorage.getItem("menusGuardados")) || [];
    historial.push(menu);
    localStorage.setItem("menusGuardados", JSON.stringify(historial));
  }
  
  function mostrarMenu(menu) {
    const contenedorResultado = document.getElementById("resultadoMenu");
    if (!contenedorResultado) return;
  
    contenedorResultado.classList.remove("hidden");
  
    const listaRecetasHtml = menu.recetas.map(item => {
      return `
        <li>
          <strong>Día ${item.dia}:</strong> ${item.receta}
          <br><em>Ingredientes:</em> ${item.ingredientes.join(", ")}
          <br><button class="btn-ver-receta" data-dia="${item.dia}" data-dieta="${menu.dieta}">Ver receta</button>
        </li>
      `;
    }).join("");
  
    const listaCompraHtml = generarListaCompra(menu.recetas)
      .map(ingrediente => `<li>${ingrediente}</li>`).join("");
  
    contenedorResultado.innerHTML = `
      <h2>🍽️ Menú para ${menu.personas} persona(s) - ${menu.dias} día(s) - Dieta: ${menu.dieta.toUpperCase()}</h2>
      <ul>${listaRecetasHtml}</ul>
      <h3>🛒 Lista de compras sugerida:</h3>
      <ul>${listaCompraHtml}</ul>
    `;
  
    contenedorResultado.querySelectorAll(".btn-ver-receta").forEach(btn => {
      btn.addEventListener("click", e => {
        const dia = e.target.dataset.dia;
        const dieta = e.target.dataset.dieta;
        window.location.href = `receta.html?dia=${dia}&tipo=${dieta}`;
      });
    });
  }
  
  function generarListaCompra(recetas) {
    const ingredientesUnicos = new Set();
  
    recetas.forEach(({ ingredientes }) => {
      ingredientes.forEach(ingrediente => ingredientesUnicos.add(ingrediente));
    });
  
    return Array.from(ingredientesUnicos);
  }
  
  // Código para manejar el formulario
  
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('menuForm');
  
    form.addEventListener('submit', e => {
      e.preventDefault();
  
      const dieta = document.getElementById('tipoDieta').value;
      const personas = parseInt(document.getElementById('personas').value);
      const dias = parseInt(document.getElementById('dias').value);
  
      generarMenu(dieta, personas, dias);
    });
  });
  