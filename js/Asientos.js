// URL base del API
const apiUrl = "https://localhost:5000/api/Asiento";

// Contenedor de asientos
const seatsContainer = document.querySelector(".seats");
// Lista de asientos seleccionados
let selectedSeats = []; // Arreglo para almacenar asientos seleccionados

function toggleSeatSelection(seatElement) {
    // Obtener los valores de fila y número de los atributos de datos
    const seatRow = seatElement.getAttribute('data-fila');
    const seatNumber = seatElement.getAttribute('data-numero');

    // Verificar si los valores se obtienen correctamente
    console.log(`Fila: ${seatRow}, Número: ${seatNumber}`);

    // Verificar si los valores son correctos
    if (!seatRow || !seatNumber) {
        console.error('Error: No se pudo obtener el atributo data-fila o data-numero');
        return;
    }

    // Crear el ID del asiento basado en fila y número
    const seatId = `${seatRow}-${seatNumber}`;
    console.log(`ID del asiento: ${seatId}`);

    if (selectedSeats.includes(seatId)) {
        // Si ya está seleccionado, quitarlo
        selectedSeats = selectedSeats.filter(seat => seat !== seatId);
        seatElement.classList.remove('selected');
    } else {
        // Si no está seleccionado, agregarlo
        selectedSeats.push(seatId);
        seatElement.classList.add('selected');
    }

    // Actualizar el texto de las butacas seleccionadas
    updateSelectedSeats();
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
        console.log("Datos de asientos cargados:", seatsData); // Verificar los datos
        populateSeats(seatsData);
    } catch (error) {
        console.error("Error al cargar los asientos:", error);
        showMessage("No se pudo cargar los asientos. Intente de nuevo más tarde.");
    }
}

// Poblar los asientos en el DOM
function populateSeats(seatsData) {
    console.log("Datos de asientos:", seatsData); // Verifica que todos los asientos estén aquí
    seatsContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevos asientos

    seatsData.forEach(seat => {
        const seatElement = document.createElement('div');
        seatElement.classList.add('seat');

        // Asignar clases según el estado
        if (seat.estado === "Ocupado") {
            seatElement.classList.add('occupied');
        } else if (seat.estado === "Disponible") {
            seatElement.classList.add('available');
        }

        // Asignar clases adicionales para asientos VIP
        if (seat.estado === "VIP") {
            seatElement.classList.add('vip');
        }

        // Asignar los datos para la fila y número como atributos `data-`
        seatElement.setAttribute('data-fila', seat.fila);
        seatElement.setAttribute('data-numero', seat.numero);

        // Agregar evento para seleccionar el asiento
        seatElement.addEventListener('click', () => toggleSeatSelection(seatElement));

        // Agregar asiento al contenedor
        seatsContainer.appendChild(seatElement);
    });
}

// Enviar asientos seleccionados al backend
async function sendSelectedSeatsToBackend() {
    const selectedSeatsData = selectedSeats.map(seat => {
        const [fila, numero] = seat.split("-");
        return {
            Fila: fila,
            Numero: parseInt(numero),
            Estado: "Seleccionado"
        };
    });

    try {
        const response = await fetch(`${apiUrl}/seleccionados`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(selectedSeatsData)
        });

        if (!response.ok) {
            throw new Error("Error al enviar los asientos seleccionados");
        }

        showMessage("Asientos seleccionados enviados con éxito");
    } catch (error) {
        console.error("Error al enviar los asientos seleccionados:", error);
        showMessage("No se pudo enviar los asientos seleccionados. Intente de nuevo más tarde.");
    }
}

// Cargar asientos al inicializar la página
loadSeatsFromBackend();
