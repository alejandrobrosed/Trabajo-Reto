document.addEventListener("DOMContentLoaded", async () => {
  const tablaEntradas = document.querySelector(".tabla-entradas");
  if (!tablaEntradas) {
    console.error("No se encontró el elemento con la clase 'tabla-entradas'.");
    return; // Salimos para evitar más errores
  }

  console.log("Elemento tabla-entradas encontrado:", tablaEntradas);

  // Mostrar fecha y hora actual
  const fechaHoraElement = document.getElementById("fecha-hora");
  const actualizarFechaHora = () => {
    const ahora = new Date();
    const opciones = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    fechaHoraElement.textContent = ahora.toLocaleDateString("es-ES", opciones);
  };
  actualizarFechaHora();
  setInterval(actualizarFechaHora, 60000); // Actualizar cada minuto

  async function cargarEntradas() {
    try {
      const response = await fetch("http://localhost:5000/api/Entrada");

      // Verifica que la respuesta sea válida
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
      }

      const datos = await response.json();

      // Revisa si `datos` es un array válido
      if (!Array.isArray(datos)) {
        throw new Error("La respuesta de la API no es una lista válida.");
      }

      console.log("Datos recibidos de la API:", datos);

      datos.forEach((entrada) => {
        // Validar que el precio sea un número
        const precio = entrada.Precio || 0; // Usar 0 si el precio no está definido
        const tipo = entrada.Tipo || "Sin definir"; // Usar la propiedad Tipo directamente

        // Crear las filas dinámicamente
        const fila = document.createElement("div");
        fila.classList.add("fila");
        fila.dataset.precio = precio;

        fila.innerHTML = `
          <span class="articulo">${tipo}</span>
          <span class="precio">${precio.toFixed(2)} €</span>
          <div class="cantidad">
            <button class="btn-menos">-</button>
            <span class="numero">0</span>
            <button class="btn-mas">+</button>
          </div>
          <span class="subtotal">0,00 €</span>
        `;

        tablaEntradas.appendChild(fila);
      });

      // Asignar eventos a los botones después de agregar las filas
      asignarEventosBotones();
    } catch (error) {
      console.error("Error al cargar las entradas:", error);

      // Opcional: muestra un mensaje de error al usuario
      const errorElemento = document.createElement("p");
      errorElemento.textContent =
        "Hubo un error al cargar las entradas. Intenta más tarde.";
      errorElemento.style.color = "red";
      tablaEntradas.appendChild(errorElemento);
    }
  }

  const asignarEventosBotones = () => {
    const actualizarPrecios = () => {
      const filas = document.querySelectorAll(".fila");
      let total = 0;

      filas.forEach((fila) => {
        const precio = parseFloat(fila.dataset.precio);
        const cantidad = parseInt(fila.querySelector(".numero").textContent);
        const subtotal = precio * cantidad;
        fila.querySelector(".subtotal").textContent =
          subtotal.toFixed(2) + " €";
        total += subtotal;
      });

      document.querySelector(".precio-total").textContent =
        total.toFixed(2) + " €";
    };

    document.querySelectorAll(".btn-mas").forEach((boton) => {
      boton.addEventListener("click", () => {
        const numero = boton.parentElement.querySelector(".numero");
        numero.textContent = parseInt(numero.textContent) + 1;
        actualizarPrecios();
      });
    });

    document.querySelectorAll(".btn-menos").forEach((boton) => {
      boton.addEventListener("click", () => {
        const numero = boton.parentElement.querySelector(".numero");
        if (parseInt(numero.textContent) > 0) {
          numero.textContent = parseInt(numero.textContent) - 1;
          actualizarPrecios();
        }
      });
    });
  };

  function mostrarAsientosSeleccionados() {
    const storedSeats = localStorage.getItem('asientosSeleccionados');
    if (storedSeats) {
      const selectedSeats = JSON.parse(storedSeats);
      const selectedSeatsText = selectedSeats.join(", ");
      console.log("Asientos seleccionados:", selectedSeatsText);

      // Mostrar los asientos seleccionados en el elemento correspondiente
      const seatsContainer = document.getElementById("selected-seats-confirmation");
      if (seatsContainer) {
        seatsContainer.innerText = selectedSeatsText;
      } else {
        console.error("No se encontró el elemento con ID 'selected-seats-confirmation'.");
      }
    } else {
      console.log("No se encontraron asientos seleccionados.");
      const seatsContainer = document.getElementById("selected-seats-confirmation");
      if (seatsContainer) {
        seatsContainer.innerText = "No se seleccionaron asientos.";
      }
    }
  }

  // Llamar a la función para mostrar asientos seleccionados al cargar la página
  mostrarAsientosSeleccionados();

  // Cargar las entradas al iniciar
  cargarEntradas();
});
