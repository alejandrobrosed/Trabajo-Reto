// Cargar todas las películas
function cargarTodasLasPeliculas() {
    const peliculasGuardadas = localStorage.getItem('todasLasPeliculas');

    if (peliculasGuardadas) {
        console.log('Cargando películas desde el localStorage');
        const data = JSON.parse(peliculasGuardadas);
        console.log('Películas almacenadas:', data); // Verificar contenido
        mostrarPeliculas(data, 'galeria-contenedor');
    } else {
        console.log('Cargando películas desde el servidor');
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
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data); // Mostrar los datos recibidos
            if (data && Array.isArray(data) && data.length > 0) {
                localStorage.setItem('todasLasPeliculas', JSON.stringify(data));
                console.log('Datos guardados en localStorage:', JSON.stringify(data));
                mostrarPeliculas(data, 'galeria-contenedor');
            } else {
                console.warn('Datos no válidos o vacíos:', data);
                document.getElementById('galeria-contenedor').innerHTML = '<p>No se encontraron películas disponibles.</p>';
            }
        })
        .catch(error => {
            console.error('Error al cargar las películas:', error);
            document.getElementById('galeria-contenedor').innerHTML = '<p>Error al cargar las películas.</p>';
        });
    }
}


// Llamada al endpoint para cargar las mejores películas
function cargarMejoresPeliculas() {
    const mejoresPeliculasGuardadas = localStorage.getItem('mejoresPeliculas');

    if (mejoresPeliculasGuardadas) {
        console.log('Cargando mejores películas desde el localStorage');
        const data = JSON.parse(mejoresPeliculasGuardadas);
        mostrarPeliculas(data, 'mejores-peliculas');
    } else {
        console.log('Cargando mejores películas desde el servidor');
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
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos para mejores películas:', data);
            const mejoresPeliculas = data.slice(0, 5); // Seleccionar las primeras 5 películas
            if (mejoresPeliculas && mejoresPeliculas.length > 0) {
                localStorage.setItem('mejoresPeliculas', JSON.stringify(mejoresPeliculas));
                mostrarPeliculas(mejoresPeliculas, 'mejores-peliculas');
            } else {
                console.warn('No se encontraron mejores películas en los datos:', data);
                document.getElementById('mejores-peliculas').innerHTML = '<p>No se encontraron mejores películas.</p>';
            }
        })
        .catch(error => {
            console.error('Error al cargar las mejores películas:', error);
            document.getElementById('mejores-peliculas').innerHTML = '<p>Error al cargar las mejores películas.</p>';
        });
    }
}

// Función genérica para renderizar películas
function mostrarPeliculas(peliculas, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.innerHTML = ''; // Limpiar contenido existente

    if (!peliculas || peliculas.length === 0) {
        console.log('No hay películas para mostrar');
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

        tarjeta.addEventListener('click', () => {
            const peliculaSeleccionada = {
                titulo: pelicula.titulo,
                duracion: pelicula.duracion,
                director: pelicula.director,
                imagenUrl: pelicula.imagenUrl,
                videoUrl: pelicula.videoUrl || null,
                sinopsis: pelicula.sinopsis || 'Sinopsis no disponible',
                actores: pelicula.actores || 'Actores no disponibles',
                fechaEstreno: pelicula.fechaEstreno || 'Fecha no disponible',
                genero: pelicula.genero || 'Género no disponible',
                clasificacion: pelicula.clasificacion || 'Clasificación no disponible'
            };

            localStorage.setItem('peliculaSeleccionada', JSON.stringify(peliculaSeleccionada));
            window.location.href = '/html/Horarios.html';
        });

        contenedor.appendChild(tarjeta);
    });

    console.log(`Películas renderizadas en ${contenedorId}:`, peliculas);
}


// Cargar las películas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarMejoresPeliculas(); // Cargar las mejores películas
    cargarTodasLasPeliculas(); // Cargar todas las películas
});
