document.addEventListener("DOMContentLoaded", function() {
  const btnMercadoCentral = document.getElementById("btnMercadoCentral");
  const btnFrutas = document.getElementById("btnFrutas");
  const btnHortalizas = document.getElementById("btnHortalizas");
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

  const precios = {
    frutas: {
      '29/06/2024 - 01/07/2024': {
        Mandarina: 500,
        Naranja: 500,
        Limón: 350,
        Pera: 1000,
      },
      '06/07/2024 - 08/07/2024': {
        Mandarina: 500,
        Banana: 1000,
        Naranja: 500,
        Limón: 350,
        Pera: 1000
      },
      '13/07/2024 - 15/07/2024': {
        Mandarina: 500,
        Banana: 670,
        Naranja: 500,
        Limón: 350,
        Batata: 800,
        Tomate: 1000,
        Pera: 1000
      },
      '20/07/2024 - 22/07/2024': {
        Mandarina: 500,
        Banana: 1000,
        Magrón: 3000,
        Naranja: 500,
        Limón: 350,
        Batata: 800,
        Papa_Negra: 475,
        Manzana: 1000,
        Pera: 1000
      },
      '31/07/2024 - 06/08/2024': {
        Naranja: 500,
        Espinaca: 1500,
        Batata: 800,
        Papa_Negra: 500,
        Morrón: [2500, 1000],  // Suponiendo que hay dos precios diferentes para este producto
        Limón: 350,
        Manzana: 1000,
        Pera: 1000,
        Mandarina: 330
      }
    },
    hortalizas: {
      '29/06/2024 - 01/07/2024': {
        Batata: 700,
        Papa_Negra: 400,
        Zanahoria: 700
      },
      '06/07/2024 - 08/07/2024': {
        Batata: 5800,
        Papa_Negra: 475,
        Tomate: 1500
      },
      '13/07/2024 - 15/07/2024': {
        Batata: 800,
        Papa_Negra: 475,
        Tomate: 1000
      },
      '20/07/2024 - 22/07/2024': {
        Batata: 800,
        Papa_Negra: 475
      },
      '31/07/2024 - 06/08/2024': {
        Batata: 800,
        Papa_Negra: 500
      }
    }
  };

  const detallesProductos = {
    Mandarina: {
      info: "La mandarina es una fruta cítrica rica en vitamina C.",
      preciosHistoricos: [480, 490, 500, 510, 520, 500, 500]
    },
    Banana: {
      info: "La banana es una fruta rica en potasio.",
      preciosHistoricos: [650, 670, 690, 700, 710, 1000]
    },
    Naranja: {
      info: "La naranja es rica en vitamina C y antioxidantes.",
      preciosHistoricos: [480, 490, 500, 510, 520, 500]
    },
    Limón: {
      info: "El limón es un cítrico muy versátil en la cocina.",
      preciosHistoricos: [340, 350, 360, 370, 380, 350]
    },
    Pera: {
      info: "La pera es una fruta refrescante y rica en fibra.",
      preciosHistoricos: [950, 960, 1000, 1020, 1040, 1000]
    },
    Batata: {
      info: "La batata es un tubérculo dulce y nutritivo.",
      preciosHistoricos: [700, 720, 740, 760, 780, 800]
    },
    Papa_Negra: {
      info: "La papa negra es una variedad de papa muy consumida.",
      preciosHistoricos: [400, 475, 475, 475, 475, 475, 500]
    },
    Tomate: {
      info: "El tomate es un ingrediente básico en muchas recetas.",
      preciosHistoricos: [1500, 1550, 1600, 1650, 1700]
    },
    Zanahoria: {
      info: "La zanahoria es una raíz comestible rica en vitamina A.",
      preciosHistoricos: [690, 700, 710, 720, 730]
    },
    Magrón: {
      info: "El magrón es un alimento específico con su precio listado.",
      preciosHistoricos: [3000]
    },
    Manzana: {
      info: "La manzana es una fruta popular rica en fibra.",
      preciosHistoricos: [1000]
    },
    Espinaca: {
      info: "La espinaca es una hoja verde rica en nutrientes.",
      preciosHistoricos: [1500]
    },
    Morrón: {
      info: "El morrón es un pimiento con precios variados.",
      preciosHistoricos: [2500, 1000]
    }
  };

  function mostrarProductos(tipo, periodo) {
    if (productosAbiertos === tipo) {
      // Si el tipo de producto ya está abierto, ciérralo y restablece
      opcionesProductos.style.display = "block";
      tablaPrecios.innerHTML = "";
      detalleProducto.style.display = "none";
      productosAbiertos = null;  // Restablece la variable
    } else {
      // Si no está abierto, muéstralo
      opcionesProductos.style.display = "none";
      tablaPrecios.innerHTML = "";
      detalleProducto.style.display = "none";

      const productos = precios[tipo][periodo];
      for (const producto in productos) {
          const precio = productos[producto];
          const item = document.createElement("div");
          item.textContent = `${producto}: $${Array.isArray(precio) ? precio.join(' / ') : precio}`;
          item.style.cursor = "pointer";
          item.addEventListener("click", () => mostrarDetalleProducto(producto));
          tablaPrecios.appendChild(item);
      }

      productosAbiertos = tipo;  // Marca el tipo de producto como abierto
    }
  }

  function mostrarDetalleProducto(producto) {
    const detalles = detallesProductos[producto];
    nombreProducto.textContent = producto;
    infoProducto.textContent = detalles.info;

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(graficoPrecios, {
      type: 'line',
      data: {
        labels: [
          "29/06/2024 - 01/07/2024",
          "06/07/2024 - 08/07/2024",
          "13/07/2024 - 15/07/2024",
          "20/07/2024 - 22/07/2024",
          "31/07/2024 - 06/08/2024"
        ],
        datasets: [{
          label: `Evolución precio de ${producto}`,
          data: detalles.preciosHistoricos,
          borderColor: 'rgba(255, 102, 0, 1)',
          borderWidth: 2,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: false,
            min: Math.min(...detalles.preciosHistoricos) - 50,
            max: Math.max(...detalles.preciosHistoricos) + 50
          }
        }
      }
    });

    detalleProducto.style.display = "block";
  }

  btnMercadoCentral.addEventListener("click", function() {
    if (opcionesProductos.style.display === "none") {
      opcionesProductos.style.display = "block"; 
      tablaPrecios.innerHTML = ""; 
      detalleProducto.style.display = "none";
    } else {
      opcionesProductos.style.display = "none";
      tablaPrecios.innerHTML = "";
      detalleProducto.style.display = "none";
    }
  });

  btnFrutas.addEventListener("click", function() {
    mostrarProductos("frutas", '29/06/2024 - 01/07/2024');
  });

  btnHortalizas.addEventListener("click", function() {
    mostrarProductos("hortalizas", '29/06/2024 - 01/07/2024');
  });

  btnMinimizar.addEventListener("click", function() {
    graficoContainer.classList.toggle('minimizado');
    btnMinimizar.textContent = graficoContainer.classList.contains('minimizado') ? 'Restaurar' : 'Minimizar';
    detalleProducto.classList.toggle('minimizado');
  });
});

