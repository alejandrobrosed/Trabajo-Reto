document.addEventListener("DOMContentLoaded", () => {
    // Obtener datos de entradas seleccionadas desde localStorage
    const entradasSeleccionadas = JSON.parse(localStorage.getItem("entradasSeleccionadas")) || [];
    const asientosSeleccionados = JSON.parse(localStorage.getItem("asientosSeleccionados")) || [];
    
    // Actualizar detalles de la compra en el DOM
    const detallesCompraContainer = document.querySelector(".ticket-info");
    const totalContainer = document.querySelector(".total");
    
    if (entradasSeleccionadas.length > 0) {
        let total = 0;
        let entradasHTML = "";
        
        entradasSeleccionadas.forEach((entrada) => {
            const { tipo, cantidad, precio } = entrada;
            total += cantidad * precio;
            entradasHTML += `<p>${cantidad}x ${tipo} (${precio.toFixed(2)} € c/u)</p>`;
        });

        // Añadir los asientos seleccionados al resumen
        if (asientosSeleccionados.length > 0) {
            entradasHTML += `<p><strong>Asientos seleccionados:</strong> ${asientosSeleccionados.join(", ")}</p>`;
        }

        // Actualizar la información en la sección de detalles de entradas
        detallesCompraContainer.innerHTML = `
            ${entradasHTML}
            <p><strong>Total: ${total.toFixed(2)} €</strong></p>
        `;

        // Actualizar el total en la sección de totales
        totalContainer.innerHTML = `
            <p>Total</p>
            <p>${total.toFixed(2)} €</p>
            <p>Gastos de gestión, IVA y recargos incluidos</p>
        `;
    } else {
        // Manejar el caso en que no haya entradas seleccionadas
        detallesCompraContainer.innerHTML = "<p>No has seleccionado ninguna entrada.</p>";
        totalContainer.innerHTML = `
            <p>Total</p>
            <p>0,00 €</p>
            <p>Gastos de gestión, IVA y recargos incluidos</p>
        `;
    }

    // Restaurar los datos personales si ya fueron ingresados
    const nombre = localStorage.getItem("clienteNombre");
    const apellido = localStorage.getItem("clienteApellido");
    const email = localStorage.getItem("clienteEmail");
    const telefono = localStorage.getItem("clienteTelefono");

    if (nombre) document.getElementById("nombre").value = nombre;
    if (apellido) document.getElementById("apellido").value = apellido;
    if (email) document.getElementById("email").value = email;
    if (telefono) document.getElementById("telefono").value = telefono;

    // Manejar la redirección del botón "Continuar"
    const continuarButton = document.querySelector(".continue-button");
    continuarButton.addEventListener("click", () => {
        const termsCheckbox = document.getElementById("terms");
        if (!termsCheckbox.checked) {
            alert("Debes aceptar los términos y condiciones antes de continuar.");
            return;
        }

        // Obtener los valores ingresados en el formulario
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefono = document.getElementById("telefono").value.trim();

        // Validar que todos los campos estén completos
        if (!nombre || !apellido || !email || !telefono) {
            alert("Por favor, completa todos los campos antes de continuar.");
            return;
        }

        // Guardar los datos personales en localStorage
        localStorage.setItem("clienteNombre", nombre);
        localStorage.setItem("clienteApellido", apellido);
        localStorage.setItem("clienteEmail", email);
        localStorage.setItem("clienteTelefono", telefono);

        // Redirigir a la página de la factura
        window.location.href = "Factura.html";
    });
});
