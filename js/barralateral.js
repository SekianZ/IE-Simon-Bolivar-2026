function toggleMenu() {
    const sidebar = document.getElementById("listadoP");
    sidebar.classList.toggle("active");
}
/* GUARDAR LA ULTIMA SECCION DE LA PAGINA PARA QUE NO DEBA ACTUALIZAR SIEMPRE */
function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.seccion-contenido').forEach(elem => {
        elem.style.display = 'none';
    });

    // Mostrar la sección seleccionada
    document.getElementById(seccion).style.display = 'block';

    // Guardar la última sección en localStorage
    localStorage.setItem('ultimaSeccion', seccion);
}

function gestionarSeccion() {
    const haVisitado = localStorage.getItem('haVisitado');

    if (!haVisitado) {
        // Mostrar la sección por defecto si es la primera visita
        mostrarSeccion('cuenta');
        localStorage.setItem('haVisitado', 'true'); // Marcar que la página ha sido visitada
    } else {
        // Mostrar la última sección seleccionada si ya ha visitado la página
        const ultimaSeccion = localStorage.getItem('ultimaSeccion') || 'cuenta';
        mostrarSeccion(ultimaSeccion);
    }
}