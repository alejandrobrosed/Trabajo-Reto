// Función para cargar las mejores películas desde el backend
function cargarMejoresPeliculas() {
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
        return response.json(); // Parsear la respuesta JSON
    })
    .then(data => {
        mostrarMejoresPeliculas(data); // Renderizar las mejores películas
    })
    .catch(error => {
        console.error('Error al cargar las mejores películas:', error);
        document.getElementById('mejores-peliculas').innerHTML = '<p>Error al cargar las mejores películas.</p>';
    });
}

// Función para mostrar las mejores películas en el HTML
function mostrarMejoresPeliculas(peliculas) {
    const contenedor = document.getElementById('mejores-peliculas');
    contenedor.innerHTML = ''; // Limpiar contenido existente

    if (peliculas.length === 0) {
        contenedor.innerHTML = '<p>No hay películas disponibles.</p>';
        return;
    }

    // Seleccionar las primeras 5 películas como "mejores"
    const mejoresPeliculas = peliculas.slice(0, 5);

    mejoresPeliculas.forEach(pelicula => {
        const tarjeta = `
            <div class="movie">
                <img src="/imagenes/${pelicula.imagenUrl}" alt="${pelicula.titulo}">
                <div class="play-icon" data-video-url="#" onclick="alert('Trailer no disponible');">▶</div>
                <p>${pelicula.titulo}</p>
            </div>
        `;
        contenedor.innerHTML += tarjeta;
    });
}

// Llamar la función al cargar el DOM
document.addEventListener('DOMContentLoaded', cargarMejoresPeliculas);
