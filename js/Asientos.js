const seatsContainer = document.querySelector('.seats');
const selectedSeatsDisplay = document.getElementById('selected-seats');
const messageElement = document.getElementById('message'); // Referencia al contenedor de mensajes
const continueButton = document.querySelector('.continue'); // Referencia al botón "Continuar"

let selectedSeats = [];

const totalOccupiedSeats = 8;

function showMessage(message) {
    messageElement.textContent = message;
    messageElement.style.visibility = 'visible';

    setTimeout(() => {
        messageElement.style.visibility = 'hidden';
    }, 3000); 
}

function createSeats() {
    const rows = 15;
    const cols = 10;
    let occupiedCount = 0; 

    for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= cols; col++) {
            const seat = document.createElement('div');
            seat.classList.add('seat');

            if (row === 7 || row === 8) {
                seat.classList.add('vip');
            }
            else if (occupiedCount < totalOccupiedSeats && Math.random() < 0.1) {
                seat.classList.add('occupied');
                occupiedCount++;
            }
            else {
                seat.classList.add('available');
            }

            seat.addEventListener('click', () => toggleSeatSelection(seat, row, col));

            seatsContainer.appendChild(seat);
        }
    }
}

function toggleSeatSelection(seat, row, col) {
    if (seat.classList.contains('occupied')) {
        // Mostrar mensaje para asiento ocupado
        showMessage("Este asiento está ocupado, por favor seleccione otro asiento.");
    } else if (seat.classList.contains('vip')) {
        // Mostrar mensaje para asiento VIP
        showMessage("Asiento VIP seleccionado. ¡Disfrute de la máxima comodidad!");
        seat.classList.toggle('selected');
        updateSelectedSeats(row, col, seat);
    } else if (seat.classList.contains('available')) {
        seat.classList.toggle('selected');
        updateSelectedSeats(row, col, seat);
    }

    updateContinueButtonState();
}

function updateSelectedSeats(row, col, seat) {
    const seatPosition = `${row}-${col}`;

    if (seat.classList.contains('selected')) {
        selectedSeats.push(seatPosition);
    } else {
        selectedSeats = selectedSeats.filter(s => s !== seatPosition);
    }

    updateSelectedSeatsDisplay();
}

function updateSelectedSeatsDisplay() {
    selectedSeatsDisplay.textContent = selectedSeats.join(', ');
}

function updateContinueButtonState() {
    if (selectedSeats.length > 0) {
        continueButton.disabled = false;
    } else {
        continueButton.disabled = true;
    }
}
continueButton.addEventListener('click', () => {
    if (selectedSeats.length === 0) {
        showMessage("Por favor, seleccione un asiento antes de continuar.");
    } else {
        console.log("Asientos seleccionados:", selectedSeats);
    }
});

createSeats();
document.getElementById('continue-btn').addEventListener('click', function () {
    if (!this.disabled) {
        window.location.href = '/html/Home.html';
    }
});