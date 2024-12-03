// URL base del API
const apiUrl = "http://localhost:5000/api/Asiento";

// Contenedor de asientos
const seatsContainer = document.querySelector(".seats");
// Lista de asientos seleccionados
let selectedSeats = []; // Arreglo para almacenar asientos seleccionados

// Función para guardar los asientos seleccionados en localStorage
function guardarAsientosEnLocalStorage() {
    localStorage.setItem('asientosSeleccionados', JSON.stringify(selectedSeats));
    console.log("Asientos seleccionados guardados en localStorage:", selectedSeats);
}

// Función para cargar los asientos seleccionados desde localStorage
function cargarAsientosDesdeLocalStorage() {
    const storedSeats = localStorage.getItem('asientosSeleccionados');
    if (storedSeats) {
        selectedSeats = JSON.parse(storedSeats);
        console.log("Asientos seleccionados cargados desde localStorage:", selectedSeats);
    }
}

function toggleSeatSelection(seatElement) {
    // Evitar selección de asientos ocupados
    if (seatElement.classList.contains('occupied')) {
        console.log("El asiento está ocupado y no se puede seleccionar.");
        return;
    }

    const seatRow = seatElement.getAttribute('data-fila');
    const seatNumber = seatElement.getAttribute('data-numero');

    if (!seatRow || !seatNumber) {
        console.error('Error: No se pudo obtener el atributo data-fila o data-numero');
        return;
    }

    const seatId = `${seatRow}-${seatNumber}`;

    if (selectedSeats.includes(seatId)) {
        selectedSeats = selectedSeats.filter(seat => seat !== seatId);
        seatElement.classList.remove('selected');
    } else {
        selectedSeats.push(seatId);
        seatElement.classList.add('selected');
    }

    updateSelectedSeats();
    guardarAsientosEnLocalStorage(); // Guardar los cambios en localStorage
}

function updateSelectedSeats() {
    const selectedSeatsText = selectedSeats.join(", ");
    console.log(`Butacas seleccionadas: ${selectedSeatsText}`);
    document.getElementById("selected-seats").innerText = selectedSeatsText;
}

// Mostrar mensajes al usuario
function showMessage(message) {
    const messageElement = document.getElementById("message");
    messageElement.innerText = message;
}

// Cargar asientos desde el backend
async function loadSeatsFromBackend() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Error al cargar los asientos");
        }

        const seatsData = await response.json();
        console.log("Datos de asientos cargados:", seatsData);
        populateSeats(seatsData);
    } catch (error) {
        console.error("Error al cargar los asientos:", error);
        showMessage("No se pudo cargar los asientos. Intente de nuevo más tarde.");
    }
}

// Poblar los asientos en el DOM
function populateSeats(seatsData) {
    seatsContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevos asientos

    seatsData.forEach(seat => {
        const seatElement = document.createElement('div');
        seatElement.classList.add('seat');

        if (seat.estado === "Ocupado") {
            seatElement.classList.add('occupied');
        } else if (seat.estado === "Disponible") {
            seatElement.classList.add('available');
        }

        if (seat.estado === "VIP") {
            seatElement.classList.add('vip');
        }

        seatElement.setAttribute('data-fila', seat.fila);
        seatElement.setAttribute('data-numero', seat.numero);

        // Crear el ID del asiento
        const seatId = `${seat.fila}-${seat.numero}`;
        // Marcar como seleccionado si está en selectedSeats
        if (selectedSeats.includes(seatId)) {
            seatElement.classList.add('selected');
        }

        seatElement.addEventListener('click', () => toggleSeatSelection(seatElement));

        seatsContainer.appendChild(seatElement);
    });
}

// Navegar a la página de confirmación
function irAPaginaDeConfirmacion() {
    guardarAsientosEnLocalStorage(); // Asegurarse de guardar antes de navegar
    window.location.href = "confirmacion.html"; // Cambia la URL según sea necesario
}

// Cargar película y horario seleccionados
function cargarInfoSeleccionada() {
    const peliculaSeleccionada = JSON.parse(localStorage.getItem('peliculaSeleccionada'));
    const horarioSeleccionado = JSON.parse(localStorage.getItem('horarioSeleccionado'));
    if (!peliculaSeleccionada || !horarioSeleccionado) {
        alert('Por favor selecciona una película y un horario primero.');
        window.location.href = '/html/Peliculas.html';
        return;
    }
    document.getElementById('info-pelicula').textContent = peliculaSeleccionada.titulo;
    document.getElementById('info-horario').textContent = `${horarioSeleccionado.horaInicio} - ${horarioSeleccionado.horaFin}`;
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarInfoSeleccionada();
    loadSeatsFromBackend(); // Recargar siempre los asientos desde el backend para garantizar que están actualizados
});
