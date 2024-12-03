document.addEventListener("DOMContentLoaded", async () => {
    // Inicializar número de pedido
    const numeroPedido = localStorage.getItem("ultimoNumeroPedido")
        ? parseInt(localStorage.getItem("ultimoNumeroPedido")) + 1
        : 1;

    // Guardar el número de pedido actualizado en localStorage
    localStorage.setItem("ultimoNumeroPedido", numeroPedido);

    // Recuperar datos del cliente y las entradas desde localStorage
    const clienteNombre = localStorage.getItem("clienteNombre") || "No proporcionado";
    const clienteEmail = localStorage.getItem("clienteEmail") || "No proporcionado";
    const clienteTelefono = localStorage.getItem("clienteTelefono") || "No proporcionado";
    const entradasSeleccionadas = JSON.parse(localStorage.getItem("entradasSeleccionadas")) || [];
    const fechaActual = new Date().toLocaleString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    let total = 0;
    entradasSeleccionadas.forEach((entrada) => {
        total += entrada.cantidad * entrada.precio;
    });

    // Actualizar la factura en el DOM
    const detallesFacturaContainer = document.querySelector(".details");
    detallesFacturaContainer.innerHTML = `
        <p><strong>Nombre del Cliente:</strong> ${clienteNombre}</p>
        <p><strong>Correo Electrónico:</strong> ${clienteEmail}</p>
        <p><strong>Teléfono:</strong> ${clienteTelefono}</p>
        <p><strong>Fecha:</strong> ${fechaActual}</p>
        <p><strong>Total:</strong> ${total.toFixed(2)} €</p>
    `;

    // Preparar datos para enviar al backend
    const factura = {
        nombre: clienteNombre,
        correo: clienteEmail,
        telefono: clienteTelefono,
        fecha: fechaActual,
        precio: total.toFixed(2),
    };

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
        }
    } catch (error) {
        console.error("Error de red al guardar la factura:", error);
    }
});
