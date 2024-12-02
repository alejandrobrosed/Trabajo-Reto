// Llamada al endpoint para cargar todas las películas
function cargarTodasLasPeliculas() {
    fetch('http://localhost:5000/api/PeliculaPrincipal', {
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
        mostrarPeliculas(data, 'galeria-contenedor'); // Renderizar todas las películas
    })
    .catch(error => {
        console.error('Error al cargar las películas:', error);
        document.getElementById('galeria-contenedor').innerHTML = '<p>Error al cargar las películas.</p>';
    });
}

// Llamada al endpoint para cargar las mejores películas
function cargarMejoresPeliculas() {
    fetch('http://localhost:5000/api/PeliculaPrincipal', {
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
        const mejoresPeliculas = data.slice(0, 5); // Seleccionar las primeras 5 películas
        mostrarPeliculas(mejoresPeliculas, 'mejores-peliculas'); // Renderizar las mejores películas
    })
    .catch(error => {
        console.error('Error al cargar las mejores películas:', error);
        document.getElementById('mejores-peliculas').innerHTML = '<p>Error al cargar las mejores películas.</p>';
    });
}

// Función genérica para renderizar películas
function mostrarPeliculas(peliculas, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.innerHTML = ''; // Limpiar contenido existente

    if (peliculas.length === 0) {
        contenedor.innerHTML = '<p>No hay películas disponibles.</p>';
        return;
    }

    peliculas.forEach(pelicula => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('pelicula');
        tarjeta.innerHTML = `
            <img src="/imagenes/${pelicula.imagenUrl}" alt="${pelicula.titulo}">
            <p class="pelicula__titulo">${pelicula.titulo}</p>
            <p class="pelicula__detalle"><strong>Duración:</strong> ${pelicula.duracion} minutos</p>
            <p class="pelicula__detalle"><strong>Director:</strong> ${pelicula.director}</p>
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

// Cargar las películas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarMejoresPeliculas(); // Cargar las mejores películas
    cargarTodasLasPeliculas(); // Cargar todas las películas
});
