document.addEventListener("DOMContentLoaded", () => {
  const btnMercadoCentral = document.getElementById("btnMercadoCentral");
  const btnFrutas = document.getElementById("btnFrutas");
  const btnHortalizas = document.getElementById("btnHortalizas");
  const btnCarnes = document.getElementById("btnCarnes");
  const tablaPrecios = document.getElementById("tablaPrecios");
  const opcionesProductos = document.getElementById("opcionesProductos");
  const detalleProducto = document.getElementById("detalleProducto");
  const nombreProducto = document.getElementById("nombreProducto");
  const infoProducto = document.getElementById("infoProducto");
  const graficoPrecios = document.getElementById("graficoPrecios").getContext('2d');
  const graficoContainer = document.getElementById("graficoContainer");
  const btnMinimizar = document.getElementById("btnMinimizar");

  let chartInstance = null;
  let productosAbiertos = null;

  // Tus datos de precios (igual que antes)
  const precios = {
    frutas: {
      '01/08/2024 - 15/08/2025': {
        Mandarina: [500, 520, 480, 500, 1000],
        Banana: [650, 670, 690, 1000, 1500],
        Naranja: [480, 490, 500, 500, 500],
        Limón: [340, 350, 360, 350, 350],
        Pera: [950, 960, 1000, 1000, 1000],
        "Manzana Red Del": [1000, 1000, 1000, 1000, 1000]
      },
      '01/09/2025 - 15/09/2025': {
        Mandarina: [520, 540, 560, 580, 600],
        Banana: [690, 710, 730, 750, 770],
        Naranja: [500, 510, 520, 530, 540],
        Limón: [360, 370, 380, 390, 400],
        Pera: [1000, 1020, 1040, 1050, 1060],
        "Manzana Red Del": [1000, 1010, 1020, 1030, 1040]
      }
    },
    hortalizas: {
      '01/08/2024 - 15/08/2025': {
        Batata: [700, 720, 740, 800, 1000],
        Papa: [400, 475, 500, 1000, 1000],
        Papa_Negra: [400, 475, 475, 500, 500],
        Tomate: [1500, 1550, 1600, 1000, 1000],
        Cebolla: [1000, 1000, 1000, 1000, 1000],
        Zanahoria: [690, 700, 710, 720, 730],
        Brocoli: [1000, 1000, 1000, 1000, 1000]
      },
      '01/09/2025 - 15/09/2025': {
        Acelga: [447.33],
        Papa: [326.64],
        Tomate: [1552.29],
        Cebolla: [305.71],
        Zapallo: [437.93],
        Zanahoria: [412.67],
        Pimiento: [2778.98],
        Zapallito: [849.65],
        Lechuga: [809.17],
        Berenjena: [799.58]
      }
    },
    carnes: {
      '01/08/2024 - 15/08/2025': {
        "Picada especial": [18000, 18000, 18000, 18000, 18000],
        Calamar: [8100, 8100, 8100, 8100, 8100],
        Jamón: [4000, 4000, 4000, 4000, 4000],
        "Capellettis/torteletis": [11800, 11800, 11800, 11800, 11800],
        "Pata y muslo de campo": [14000, 14000, 14000, 14000, 14000]
      },
      '01/09/2025 - 15/09/2025': {
        "Picada especial": [18200, 18300, 18400, 18500, 18600],
        Calamar: [8200, 8250, 8300, 8350, 8400],
        Jamón: [4050, 4100, 4150, 4200, 4250],
        "Capellettis/torteletis": [11900, 12000, 12100, 12200, 12300],
        "Pata y muslo de campo": [14100, 14200, 14300, 14400, 14500]
      }
    }
  };

  // Mostrar productos de un grupo y periodo
  function mostrarProductos(tipo) {
    if (productosAbiertos === tipo) {
      tablaPrecios.innerHTML = "";
      detalleProducto.style.display = "none";
      productosAbiertos = null;
      return;
    }

    tablaPrecios.innerHTML = "";
    detalleProducto.style.display = "none";

    // Tomar último periodo disponible automáticamente
    const periodos = Object.keys(precios[tipo]);
    const ultimoPeriodo = periodos[periodos.length - 1];

    for (const producto in precios[tipo][ultimoPeriodo]) {
      const precio = precios[tipo][ultimoPeriodo][producto];
      const item = document.createElement("div");
      item.textContent = `${producto}: $${Array.isArray(precio) ? precio.join(' / ') : precio}`;
      item.style.cursor = "pointer";
      item.addEventListener("click", () => mostrarDetalleProducto(producto));
      tablaPrecios.appendChild(item);
    }

    productosAbiertos = tipo;
  }

  function mostrarDetalleProducto(producto) {
    nombreProducto.textContent = producto;
    infoProducto.textContent = "";
  
    if (chartInstance) chartInstance.destroy();
  
    // detectar grupo automáticamente
    let grupo = Object.keys(precios).find(g =>
      Object.values(precios[g])[0][producto] !== undefined ||
      Object.values(precios[g])[1] && Object.values(precios[g])[1][producto] !== undefined
    );
  
    const labels = [];
    const data = [];
  
    // recorrer periodos
    const periodos = Object.keys(precios[grupo]);
  
    periodos.forEach(periodo => {
      let valores = precios[grupo][periodo][producto];
  
      // si no hay valores para ese periodo pero sí en otro, usa el del anterior
      if (!valores) {
        // buscamos en periodos anteriores el primero que tenga valores
        for (let i = periodos.indexOf(periodo) - 1; i >= 0; i--) {
          const anterior = precios[grupo][periodos[i]][producto];
          if (anterior) {
            valores = anterior; // copiamos valores anteriores
            break;
          }
        }
      }
  
      // si encontramos valores (originales o copiados) los añadimos al gráfico
      if (valores) {
        valores.forEach((v, idx) => {
          labels.push(`${periodo} (${idx + 1})`);
          data.push(v);
        });
      }
    });
  
    chartInstance = new Chart(graficoPrecios, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `Evolución precio de ${producto}`,
          data,
          borderColor: 'rgba(55, 102, 0, 1)',
          borderWidth: 2,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: Math.min(...data) - 50,
            max: Math.max(...data) + 50
          }
        }
      }
    });
  
    detalleProducto.style.display = "block";
  }
  

  // Eventos
  btnMercadoCentral.addEventListener("click", () => {
    opcionesProductos.style.display = opcionesProductos.style.display === "none" ? "block" : "none";
    tablaPrecios.innerHTML = "";
    detalleProducto.style.display = "none";
  });

  btnFrutas.addEventListener("click", () => mostrarProductos("frutas"));
  btnHortalizas.addEventListener("click", () => mostrarProductos("hortalizas"));
  if (btnCarnes) btnCarnes.addEventListener("click", () => mostrarProductos("carnes"));

  btnMinimizar.addEventListener("click", () => {
    graficoContainer.classList.toggle('minimizado');
    btnMinimizar.textContent = graficoContainer.classList.contains('minimizado') ? 'Restaurar' : 'Minimizar';
    detalleProducto.classList.toggle('minimizado');
  });
});
