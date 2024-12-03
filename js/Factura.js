document.addEventListener("DOMContentLoaded", async () => {
    // Inicializar número de pedido
    const numeroPedido = localStorage.getItem("ultimoNumeroPedido")
        ? parseInt(localStorage.getItem("ultimoNumeroPedido")) + 1
        : 1;

    // Guardar el número de pedido actualizado en localStorage
    localStorage.setItem("ultimoNumeroPedido", numeroPedido);

    // Recuperar datos del cliente y las entradas desde localStorage
    const clienteNombre = localStorage.getItem("clienteNombre") || "No proporcionado";
    const clienteApellido = localStorage.getItem("clienteApellido") || "No proporcionado";
    const clienteEmail = localStorage.getItem("clienteEmail") || "No proporcionado";
    const clienteTelefono = localStorage.getItem("clienteTelefono") || "No proporcionado";
    const entradasSeleccionadas = JSON.parse(localStorage.getItem("entradasSeleccionadas")) || [];
    const asientosSeleccionados = JSON.parse(localStorage.getItem("asientosSeleccionados")) || [];
    const fechaActual = new Date().toISOString(); // Usar ISOString para asegurarse de que la fecha sea válida

    // Calcular el total de las entradas
    let total = 0;
    let entradasHTML = "";

    entradasSeleccionadas.forEach((entrada) => {
        const { tipo, cantidad, precio } = entrada;
        total += cantidad * precio;
        entradasHTML += `<p>${cantidad}x ${tipo} - ${precio.toFixed(2)} € c/u</p>`;
    });

    // Formatear los asientos seleccionados para mostrar en la factura
    const asientosTexto = asientosSeleccionados.length > 0
        ? asientosSeleccionados.join(", ")
        : "No proporcionado";

    // Actualizar la factura en el DOM
    const detallesFacturaContainer = document.querySelector(".details");
    detallesFacturaContainer.innerHTML = `
        <p><strong>Nombre del Cliente:</strong> ${clienteNombre} ${clienteApellido}</p>
        <p><strong>Correo Electrónico:</strong> ${clienteEmail}</p>
        <p><strong>Teléfono:</strong> ${clienteTelefono}</p>
        <p><strong>Fecha:</strong> ${new Date(fechaActual).toLocaleString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })}</p>
        <p><strong>Asientos Seleccionados:</strong> ${asientosTexto}</p>
        <p><strong>Total:</strong> ${total.toFixed(2)} €</p>
    `;

    // Preparar datos para enviar al backend
    const factura = {
        nombre: `${clienteNombre} ${clienteApellido}`,
        correo: clienteEmail,
        telefono: clienteTelefono,
        fecha: fechaActual,
        asiento: asientosSeleccionados.length > 0 ? asientosSeleccionados.join(", ") : "", // Enviar como una cadena, no como un array
        precio: parseFloat(total.toFixed(2)), // Asegurarse de que el precio sea un número
    };

    // Validación adicional: revisar si los campos son válidos
    if (!clienteNombre || !clienteEmail || !clienteTelefono || asientosSeleccionados.length === 0) {
        console.error("Error: Algunos campos requeridos están vacíos o inválidos.");
        return; // No continuar si hay campos inválidos
    }

    // Imprimir los datos para depuración
    console.log("Datos enviados:", JSON.stringify(factura));

    // Enviar datos al backend mediante POST
    try {
        const response = await fetch("http://localhost:5000/api/Factura", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(factura),
        });

        if (response.ok) {
            console.log("Factura guardada exitosamente.");
        } else {
            console.error("Error al guardar la factura:", response.status, response.statusText);
            
            // Intentar leer el cuerpo de la respuesta para obtener detalles del error
            const errorResponse = await response.json();
            console.error("Detalles del error:", errorResponse);

            if (errorResponse.errors) {
                for (const [key, value] of Object.entries(errorResponse.errors)) {
                    console.error(`Error en el campo "${key}": ${value}`);
                }
            }
        }
    } catch (error) {
        console.error("Error de red al guardar la factura:", error);
    }

    // Redirigir al home
    document.getElementById("backHomeButton").addEventListener("click", () => {
        window.location.href = "Home.html"; // Cambia esta ruta si es necesario
    });
});
