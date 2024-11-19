document.addEventListener("DOMContentLoaded", () => {
    const filas = document.querySelectorAll(".fila");
    const precioTotalElement = document.querySelector(".precio-total");
  
    filas.forEach((fila) => {
      const btnMenos = fila.querySelector(".btn-menos");
      const btnMas = fila.querySelector(".btn-mas");
      const numeroElement = fila.querySelector(".numero");
      const subtotalElement = fila.querySelector(".subtotal");
      const precioPorEntrada = parseFloat(fila.dataset.precio);
  
      btnMas.addEventListener("click", () => {
        let cantidad = parseInt(numeroElement.textContent);
        cantidad++;
        numeroElement.textContent = cantidad;
        actualizarSubtotal(cantidad, precioPorEntrada, subtotalElement);
        actualizarTotal();
      });
  
      btnMenos.addEventListener("click", () => {
        let cantidad = parseInt(numeroElement.textContent);
        if (cantidad > 0) {
          cantidad--;
          numeroElement.textContent = cantidad;
          actualizarSubtotal(cantidad, precioPorEntrada, subtotalElement);
          actualizarTotal();
        }
      });
    });
  
    function actualizarSubtotal(cantidad, precioPorEntrada, subtotalElement) {
      const subtotal = cantidad * precioPorEntrada;
      subtotalElement.textContent = subtotal.toFixed(2).replace(".", ",") + " €";
    }
  
    function actualizarTotal() {
      let total = 0;
      filas.forEach((fila) => {
        const cantidad = parseInt(fila.querySelector(".numero").textContent);
        const precioPorEntrada = parseFloat(fila.dataset.precio);
        total += cantidad * precioPorEntrada;
      });
      precioTotalElement.textContent = total.toFixed(2).replace(".", ",") + " €";
    }
  });
  