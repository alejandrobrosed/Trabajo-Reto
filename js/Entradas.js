document.addEventListener("DOMContentLoaded", async () => {
  const tablaEntradas = document.querySelector(".tabla-entradas");
  if (!tablaEntradas) {
    console.error("No se encontró el elemento con la clase 'tabla-entradas'.");
    return;
  }

  console.log("Elemento tabla-entradas encontrado:", tablaEntradas);

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
  setInterval(actualizarFechaHora, 60000);

  async function cargarEntradas() {
    try {
      const response = await fetch("http://localhost:5000/api/Entrada");

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
      }

      const datos = await response.json();
      console.log("Datos completos recibidos de la API:", JSON.stringify(datos, null, 2));

      if (!Array.isArray(datos)) {
        throw new Error("La respuesta de la API no es una lista válida.");
      }

      datos.forEach((entrada) => {
        const precio = typeof entrada.precio === "number" ? entrada.precio : 0;
        const tipo = typeof entrada.tipo === "string" ? entrada.tipo : "Sin definir";

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

      asignarEventosBotones();
    } catch (error) {
      console.error("Error al cargar las entradas:", error);

      const errorElemento = document.createElement("p");
      errorElemento.textContent = "Hubo un error al cargar las entradas. Intenta más tarde.";
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
        fila.querySelector(".subtotal").textContent = subtotal.toFixed(2) + " €";
        total += subtotal;
      });

      document.querySelector(".precio-total").textContent = total.toFixed(2) + " €";
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
    const seatsContainer = document.getElementById("selected-seats-confirmation");
    if (storedSeats && seatsContainer) {
      const selectedSeats = JSON.parse(storedSeats);
      seatsContainer.innerText = selectedSeats.length > 0 ? selectedSeats.join(", ") : "No se seleccionaron asientos.";
    }
  }

  mostrarAsientosSeleccionados();
  cargarEntradas();
});
