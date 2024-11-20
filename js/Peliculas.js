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

    const mejoresPeliculas = peliculas.slice(0, 5); // Seleccionar las primeras 5 películas

    mejoresPeliculas.forEach(pelicula => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('movie');
        tarjeta.innerHTML = `
            <img src="/imagenes/${pelicula.imagenUrl}" alt="${pelicula.titulo}">
            <div class="play-icon" data-video-url="${pelicula.videoUrl}" onclick="openVideo(this)">▶</div>
            <p>${pelicula.titulo}</p>
        `;

        // Agregar evento para guardar la película seleccionada en el localStorage
        tarjeta.addEventListener('click', () => {
            const peliculaSeleccionada = {
                titulo: pelicula.titulo,
                duracion: pelicula.duracion,
                director: pelicula.director,
                imagenUrl: pelicula.imagenUrl,
                videoUrl: pelicula.videoUrl || null
            };

            // Guardar en el localStorage
            localStorage.setItem('peliculaSeleccionada', JSON.stringify(peliculaSeleccionada));

            // Redirigir a la página principal (opcional)
            window.location.href = '/html/Horarios.html'; // Cambia la ruta según corresponda
        });

        contenedor.appendChild(tarjeta);
    });
}

function obtenerPeliculaSeleccionada() {
    const peliculaSeleccionada = localStorage.getItem('peliculaSeleccionada');
    if (peliculaSeleccionada) {
        return JSON.parse(peliculaSeleccionada);
    }
    return null; // Si no hay ninguna película seleccionada
}

// Ejemplo: Mostrar la película seleccionada en la consola
const pelicula = obtenerPeliculaSeleccionada();
if (pelicula) {
    console.log('Película seleccionada:', pelicula);
} else {
    console.log('No se ha seleccionado ninguna película.');
}


// Llamar la función al cargar el DOM
document.addEventListener('DOMContentLoaded', cargarMejoresPeliculas);
