// Función para cargar los horarios desde el backend
async function cargarHorarios() {
    try {
        // Llamada al endpoint de horarios
        const response = await fetch('http://localhost:5000/api/Horario'); // Cambia por tu URL real
        if (!response.ok) {
            throw new Error('Error al cargar los horarios');
        }

        // Convertir la respuesta en JSON
        const horarios = await response.json();
        console.log('Horarios obtenidos:', horarios);

        // Mostrar los horarios en la página
        mostrarHorarios(horarios);
    } catch (error) {
        console.error('Error en la solicitud de horarios:', error);
    }
}

// Función para cargar la película seleccionada desde el localStorage y mostrar su información
async function cargarPeliculaSeleccionada() {
    const peliculaSeleccionada = obtenerPeliculaSeleccionada();
    if (!peliculaSeleccionada) {
        console.error('No se ha seleccionado ninguna película.');
        return;
    }

    // Depuración: Mostrar todos los datos de la película seleccionada
    console.log('Datos de la película seleccionada:', peliculaSeleccionada);

    try {
        // Obtener la imagen almacenada y ajustar la URL si es necesario
        const imgElement = document.getElementById('imagen-pelicula');
        let imagenUrl = peliculaSeleccionada.imagenUrl;

        if (!imagenUrl) {
            console.error('No se encontró una imagen URL para la película.');
        } else {
            // Depuración: Mostrar URL de la imagen
            console.log('URL de la imagen almacenada:', imagenUrl);
        }

        // Si la URL no empieza con 'http' o 'https', entonces la tratamos como relativa
        if (!imagenUrl.startsWith('http') && !imagenUrl.startsWith('/')) {
            imagenUrl = `/imagenes/${imagenUrl}`;
        }

        // Asignar la URL corregida al elemento de la imagen
        imgElement.src = imagenUrl;
        imgElement.alt = peliculaSeleccionada.titulo || 'Imagen no disponible';

        // Asignar el resto de la información de la película
        document.getElementById('titulo-pelicula').textContent = peliculaSeleccionada.titulo || 'Título no disponible';

        // Depuración: Mostrar el valor de la sinopsis
        console.log('Sinopsis almacenada:', peliculaSeleccionada.sinopsis);

        // Verificar si la sinopsis está definida y no es una cadena vacía
        if (peliculaSeleccionada.sinopsis && peliculaSeleccionada.sinopsis.trim() !== '') {
            document.getElementById('sinopsis-pelicula').textContent = peliculaSeleccionada.sinopsis;
        } else {
            document.getElementById('sinopsis-pelicula').textContent = 'Sinopsis no disponible';
            console.warn('Sinopsis no encontrada o está vacía.');
        }

        document.getElementById('director-pelicula').textContent = peliculaSeleccionada.director || 'Director no disponible';
        document.getElementById('duracion-pelicula').textContent = peliculaSeleccionada.duracion || 'Duración no disponible';
        document.getElementById('fecha-estreno-pelicula').textContent = peliculaSeleccionada.fechaEstreno || 'Fecha de estreno no disponible';
        document.getElementById('clasificacion-pelicula').textContent = peliculaSeleccionada.clasificacion || 'Clasificación no disponible';

    } catch (error) {
        console.error('Error en la solicitud de la película:', error);
    }
}



// Función para obtener la película seleccionada desde el localStorage
function obtenerPeliculaSeleccionada() {
    const peliculaSeleccionada = localStorage.getItem('peliculaSeleccionada');
    if (peliculaSeleccionada) {
        const pelicula = JSON.parse(peliculaSeleccionada);
        if (pelicula.titulo) {
            return pelicula;
        } else {
            console.error('La película seleccionada no tiene un título válido:', pelicula);
            return null;
        }
    }
    console.error('No se ha seleccionado ninguna película en el localStorage.');
    return null;
}

// Ejecutar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    cargarHorarios();
    cargarPeliculaSeleccionada(); // Llamada para cargar la información de la película seleccionada
});


// Función para mostrar los horarios en la página
function mostrarHorarios(horarios) {
    const contenedor = document.querySelector('.botones'); // Asegúrate de que exista en el HTML
    if (!contenedor) {
        console.error('Contenedor de horarios no encontrado en el DOM');
        return;
    }

    contenedor.innerHTML = ''; // Limpiar contenido existente

    if (!horarios || horarios.length === 0) {
        contenedor.innerHTML = '<p>No hay horarios disponibles.</p>';
        return;
    }

    // Obtener la fecha y hora actual
    const ahora = new Date();

    // Crear botones dinámicos para los horarios
    horarios.forEach(horario => {
        if (horario.horaInicio && horario.horaFin) {
            // Combinar la fecha actual con la hora del horario
            const [horaInicioHoras, horaInicioMinutos] = horario.horaInicio.split(':').map(Number);
            const horarioInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), horaInicioHoras, horaInicioMinutos);

            if (horarioInicio < ahora) {
                // Si el horario ya pasó, no lo mostramos
                console.log(`El horario ${horario.horaInicio} - ${horario.horaFin} ya se ha pasado la hora.`);
                return;
            }

            const boton = document.createElement('button');
            boton.classList.add('horario');
            boton.textContent = `${horario.horaInicio} - ${horario.horaFin}`;

            // Agregar evento para guardar en localStorage y redirigir
            boton.addEventListener('click', () => {
                const horarioSeleccionado = {
                    horaInicio: horario.horaInicio,
                    horaFin: horario.horaFin,
                    dia: horario.Dia
                };

                // Guardar en localStorage
                localStorage.setItem('horarioSeleccionado', JSON.stringify(horarioSeleccionado));

                // Redirigir a la página principal (asegúrate de que la ruta sea correcta)
                window.location.href = '/html/Asientos.html';
            });

            contenedor.appendChild(boton);
        } else {
            console.warn('Horario inválido:', horario);
        }
    });
}


// Función para obtener la película seleccionada desde el localStorage
function obtenerPeliculaSeleccionada() {
    const peliculaSeleccionada = localStorage.getItem('peliculaSeleccionada');
    if (peliculaSeleccionada) {
        const pelicula = JSON.parse(peliculaSeleccionada);
        if (pelicula.titulo) {
            return pelicula;
        } else {
            console.error('La película seleccionada no tiene un título válido:', pelicula);
            return null;
        }
    }
    console.error('No se ha seleccionado ninguna película en el localStorage.');
    return null;
}

// Ejecutar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    cargarHorarios();
    cargarPeliculaSeleccionada(); // Llamada para cargar la información de la película seleccionada
});

