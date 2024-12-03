document.addEventListener("DOMContentLoaded", async () => {
  const tablaEntradas = document.querySelector(".tabla-entradas");
  if (!tablaEntradas) {
    console.error("No se encontró el elemento con la clase 'tabla-entradas'.");
    return;
  }

  const actualizarFechaHora = () => {
    const fechaHoraElement = document.getElementById("fecha-hora");
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

  // Obtener el número de asientos seleccionados
  function obtenerNumeroDeAsientosSeleccionados() {
    const storedSeats = localStorage.getItem('asientosSeleccionados');
    return storedSeats ? JSON.parse(storedSeats).length : 0;
  }

  // Cargar entradas desde la API
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

      datos.forEach((entrada, index) => {
        const precio = typeof entrada.precio === "number" ? entrada.precio : 0;
        const tipo = typeof entrada.tipo === "string" ? entrada.tipo : "Sin definir";

        const fila = document.createElement("div");
        fila.classList.add("fila");
        fila.dataset.index = index;
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
      actualizarDisponibilidadDeEntradas();
    } catch (error) {
      console.error("Error al cargar las entradas:", error);
      const errorElemento = document.createElement("p");
      errorElemento.textContent = "Hubo un error al cargar las entradas. Intenta más tarde.";
      errorElemento.style.color = "red";
      tablaEntradas.appendChild(errorElemento);
    }
  }

  // Guardar entradas seleccionadas en LocalStorage
  function guardarEntradasSeleccionadas() {
    const entradas = [];
    document.querySelectorAll(".fila").forEach((fila) => {
      const tipo = fila.querySelector(".articulo").textContent.trim();
      const cantidad = parseInt(fila.querySelector(".numero").textContent);
      const precio = parseFloat(fila.dataset.precio);
      if (cantidad > 0) {
        entradas.push({ tipo, cantidad, precio });
      }
    });

    console.log("Guardando en LocalStorage:", entradas);
    localStorage.setItem("entradasSeleccionadas", JSON.stringify(entradas));
  }

  // Definir la función actualizarPrecios de manera global
  function actualizarPrecios() {
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

    // Guardar las entradas seleccionadas cada vez que se actualizan los precios
    guardarEntradasSeleccionadas();
  }

  // Actualizar la disponibilidad de entradas según los asientos seleccionados
  function actualizarDisponibilidadDeEntradas() {
    const numeroAsientosSeleccionados = obtenerNumeroDeAsientosSeleccionados();

    // Restringir la cantidad de entradas disponibles
    document.querySelectorAll(".fila").forEach((fila) => {
      const btnMas = fila.querySelector(".btn-mas");
      const numeroEntradasActual = Array.from(document.querySelectorAll(".numero")).reduce((total, elem) => {
        return total + parseInt(elem.textContent);
      }, 0);

      // Deshabilitar el botón de incremento si ya se ha alcanzado el número de asientos seleccionados
      btnMas.disabled = numeroEntradasActual >= numeroAsientosSeleccionados;
    });

    actualizarPrecios();
  }

  const asignarEventosBotones = () => {
    document.querySelectorAll(".btn-mas").forEach((boton) => {
      boton.addEventListener("click", () => {
        const numero = boton.parentElement.querySelector(".numero");
        numero.textContent = parseInt(numero.textContent) + 1;
        
        // Actualizar precios y guardar en LocalStorage después de cada incremento
        actualizarPrecios();
        actualizarDisponibilidadDeEntradas();
      });
    });

    document.querySelectorAll(".btn-menos").forEach((boton) => {
      boton.addEventListener("click", () => {
        const numero = boton.parentElement.querySelector(".numero");
        if (parseInt(numero.textContent) > 0) {
          numero.textContent = parseInt(numero.textContent) - 1;

          // Actualizar precios y guardar en LocalStorage después de cada decremento
          actualizarPrecios();
          actualizarDisponibilidadDeEntradas();
        }
      });
    });
  };

  // Mostrar los asientos seleccionados (no afecta a entradas)
  function mostrarAsientosSeleccionados() {
    const storedSeats = localStorage.getItem('asientosSeleccionados');
    const seatsContainer = document.getElementById("selected-seats-confirmation");
    if (storedSeats && seatsContainer) {
      const selectedSeats = JSON.parse(storedSeats);
      seatsContainer.innerText = selectedSeats.length > 0 ? selectedSeats.join(", ") : "No se seleccionaron asientos.";
    }
  }

  // Evento para el botón "Comprar"
  document.querySelector(".btn-comprar").addEventListener("click", () => {
    // Guardar los datos actuales en LocalStorage antes de redirigir
    guardarEntradasSeleccionadas();
    // Redirigir a la página de inicio
    window.location.href = "Carrito.html"; // Cambia esta URL según la ubicación de tu página principal
  });

  mostrarAsientosSeleccionados();
  cargarEntradas();
});
