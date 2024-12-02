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

    // Crear botones dinámicos
    horarios.forEach(horario => {
        if (horario.horaInicio && horario.horaFin) {
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
                
                // Redirigir a la página principal
                window.location.href = '/html/Asientos.html'; // Cambia '/home' por la URL de tu página principal
            });

            contenedor.appendChild(boton);
        } else {
            console.warn('Horario inválido:', horario);
        }
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


// Ejecutar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', cargarHorarios);
