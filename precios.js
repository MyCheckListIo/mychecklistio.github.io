document.addEventListener("DOMContentLoaded", function() {
  const btnMercadoCentral = document.getElementById("btnMercadoCentral");
  const btnFrutas = document.getElementById("btnFrutas");
  const btnHortalizas = document.getElementById("btnHortalizas");
  const btnVolver = document.getElementById("btnVolver");
  const tablaPrecios = document.getElementById("tablaPrecios");
  const opcionesProductos = document.getElementById("opcionesProductos");

  const precios = {
    frutas: {
      '03/05/2024 - 08/05/2024': {
        Mandarina: 400,
        Manzana: 900,
        Pera: 750
      }
    },
    hortalizas: {
      '03/05/2024 - 08/05/2024': {
        Lechuga: 650,
        Zanahoria: 450,
        Papa_Negra: 250,
        Batata: 350,
        Cebolla_Comercial: 450,
        Anco: 300,
        Zapallito_Redondo: 600
      }
    }
  };

  function mostrarProductos(tipo, periodo) {
    opcionesProductos.style.display = "none";
    
    tablaPrecios.innerHTML = "";
    
    const productos = precios[tipo][periodo];
    for (const producto in productos) {
      const precio = productos[producto];
      const item = document.createElement("div");
      item.textContent = `${producto}: $${precio}`;
      tablaPrecios.appendChild(item);
    }
  }

   btnMercadoCentral.addEventListener("click", function() {
      opcionesProductos.style.display = "block"; 
      tablaPrecios.innerHTML = ""; 
      opcionesmostrarProductos.style.display = "none"; 
  });

  btnFrutas.addEventListener("click", function() {
    opcionesProductos.style.display = "none";
    mostrarProductos("frutas", '03/05/2024 - 08/05/2024');
  });

  btnHortalizas.addEventListener("click", function() {
    opcionesProductos.style.display = "none";
    mostrarProductos("hortalizas", '03/05/2024 - 08/05/2024');
  });

  btnVolver.addEventListener("click", function() {
    opcionesProductos.style.display = "block";
    btnAtras.style.display = "none";
    tablaPrecios.innerHTML = "";
  });
});
