// Realizar la llamada AJAX
function cargarPeliculas() {
    fetch('https://localhost:7259/api/PeliculaPrincipal', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        mostrarPeliculas(data);
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        document.getElementById('peliculas-container').innerHTML = '<p>Error al cargar las películas.</p>';
    });
}

function mostrarPeliculas(peliculas) {
    const contenedor = document.getElementById('galeria-contenedor');
    contenedor.innerHTML = ''; // Limpiar contenido existente

    if (peliculas.length === 0) {
        contenedor.innerHTML = '<p>No hay películas disponibles.</p>';
        return;
    }

    peliculas.forEach(pelicula => {
        const tarjeta = `
            <div class="pelicula">
                <img src="/imagenes/${pelicula.imagenUrl}" alt="${pelicula.titulo}">
                <p class="pelicula__titulo">${pelicula.titulo}</p>
                <p class="pelicula__detalle"><strong>Duración:</strong> ${pelicula.duracion} minutos</p>
                <p class="pelicula__detalle"><strong>Director:</strong> ${pelicula.director}</p>
            </div>
        `;
        contenedor.innerHTML += tarjeta;
    });
}


// Ejecutar la función al cargar el DOM
document.addEventListener('DOMContentLoaded', cargarPeliculas);
