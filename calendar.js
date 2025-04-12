document.addEventListener('DOMContentLoaded', () => {
    const btnCrearLista = document.getElementById("btnCrearLista");
    const btnListasGuardadas = document.getElementById("btnListasGuardadas");
    const btnHome = document.getElementById("btnHome");
    const btnAgregarRecordatorio = document.getElementById("btnAgregarRecordatorio");
  
    if (btnCrearLista) {
      btnCrearLista.addEventListener("click", () => {
        window.location.href = "/public/crearlista.html";
      });
    }
  
    if (btnListasGuardadas) {
      btnListasGuardadas.addEventListener("click", () => {
        window.location.href = "/public/listasguardadas.html";
      });
    }
  
    if (btnAgregarRecordatorio) {
      btnAgregarRecordatorio.addEventListener("click", () => {
        window.location.href = "/public/calendar.html";
      });
    }
  
    if (btnHome) {
      btnHome.addEventListener("click", () => {
        window.location.href = "/public/index.html";
      });
    }
  });  
  

const guardados = localStorage.getItem("recordatorios");
if (guardados) {
    Object.assign(recordatoriosPorDia, JSON.parse(guardados));
}

document.addEventListener('DOMContentLoaded', function() {
    const calendarDate = document.getElementById("calendarDate");
    const calendarReminder = document.getElementById("calendarReminder");

    const hoy = new Date();
    let currentDay = hoy.getDate();
    calendarDate.textContent = currentDay;
    
    const recordatoriosPorDia = {};

    function actualizarRecordatorios() {
        const recordatorios = recordatoriosPorDia[currentDay] || [];
        calendarReminder.innerHTML = '';
    
        if (recordatorios.length === 0) {
            calendarReminder.innerHTML = '<p class="sin-recordatorios">Sin recordatorios</p>';
            return;
        }
    
        recordatorios.forEach((recordatorio, index) => {
            const div = document.createElement("div");
            div.classList.add("recordatorio-item");
            div.innerHTML = `
                <p>${recordatorio.text} - ${recordatorio.date} ${recordatorio.time}</p>
                <div class="acciones">
                    <button class="editar" data-id="${index}">Editar</button>
                    <button class="eliminar" data-id="${index}">Eliminar</button>
                </div>
            `;
            calendarReminder.appendChild(div);
        });
    
        document.querySelectorAll('.editar').forEach(button => {
            button.addEventListener('click', editarRecordatorio);
        });
    
        document.querySelectorAll('.eliminar').forEach(button => {
            button.addEventListener('click', eliminarRecordatorio);
        });
    }
    

    function changeDay(offset) {
        currentDay += offset;
        if (currentDay < 1) currentDay = 31;
        if (currentDay > 31) currentDay = 1;
        calendarDate.textContent = currentDay;
        actualizarRecordatorios();
    }

    function editarRecordatorio(event) {
        const index = event.target.getAttribute('data-id');
        const nuevoRecordatorio = prompt("Edita tu recordatorio:", recordatoriosPorDia[currentDay][index].text);
        if (nuevoRecordatorio) {
            recordatoriosPorDia[currentDay][index].text = nuevoRecordatorio;
            actualizarRecordatorios();
        }
    }

    function eliminarRecordatorio(event) {
        const index = event.target.getAttribute('data-id');
        recordatoriosPorDia[currentDay].splice(index, 1);
        actualizarRecordatorios();
    }

    const prevButton = document.getElementById("prevDay");
    const nextButton = document.getElementById("nextDay");

    if (prevButton) {
        prevButton.addEventListener("click", () => changeDay(-1));
    }

    if (nextButton) {
        nextButton.addEventListener("click", () => changeDay(1));
    }

    const btnHome = document.getElementById("btnHome");

    if (btnHome) {
        btnHome.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

    const btnAgregarRecordatorio = document.getElementById("btnAgregarRecordatorio");
    const popup = document.getElementById("popup");
    const popupClose = document.getElementById("popupClose");
    const reminderForm = document.getElementById("reminderForm");

    btnAgregarRecordatorio.addEventListener("click", () => {
        popup.style.display = "block";
    });

    popupClose.addEventListener("click", () => {
        popup.style.display = "none";
    });

    reminderForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const reminderText = document.getElementById("reminderText").value;
        const reminderDate = document.getElementById("reminderDate").value;
        const reminderTime = document.getElementById("reminderTime").value;

        if (!reminderText || !reminderDate || !reminderTime) return;

        if (!recordatoriosPorDia[currentDay]) {
            recordatoriosPorDia[currentDay] = [];
        }

        recordatoriosPorDia[currentDay].push({
            text: reminderText,
            date: reminderDate,
            time: reminderTime
        });

        actualizarRecordatorios();
        popup.style.display = "none";
    });

    actualizarRecordatorios();
});

function guardarEnStorage() {
    localStorage.setItem("recordatorios", JSON.stringify(recordatoriosPorDia));
}
