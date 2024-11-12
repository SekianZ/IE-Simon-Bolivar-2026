// Lista de días de la semana
const diasDeLaSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
let mapeobloques = {};

// Guardar el estado de la página antes de recargar
window.addEventListener('beforeunload', function () {
    const visibleSection = document.querySelector('section:not([style*="display: none"])');
    if (visibleSection) {
        sessionStorage.setItem('visibleSection', visibleSection.id);
    }
});

// Restaurar el estado de la página al cargar
window.addEventListener('load', function () {
    const visibleSectionId = sessionStorage.getItem('visibleSection');
    if (visibleSectionId) {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.display = 'none'; // Ocultar todas las secciones
        });
        const visibleSection = document.getElementById(visibleSectionId);
        if (visibleSection) {
            visibleSection.style.display = 'block'; // Mostrar la sección guardada
        }
    }
});

function mostrarContenido(seccion) {
    // Ocultar todas las secciones
    const btnRegresar = document.getElementById('regresar');
    const navBar = document.getElementById('navbar');
    const menuLinks = document.querySelectorAll('.navbar .menu li a');
    
    document.getElementById('Bloques').style.display = 'none';
    document.getElementById('Estudiantes').style.display = 'none';
    document.getElementById('asistencia').style.display = 'none';
    document.getElementById('Inicio').style.display = 'none';
    document.getElementById('noticias').style.display = 'none'; 

    if (seccion=='Inicio'){
        document.getElementById('Inicio').style.display = 'block';
        document.getElementById('noticias').style.display = 'block';
    } else {
        // Mostrar solo la sección seleccionada
        document.getElementById(seccion).style.display = 'block';
    }

    // Color de los enlaces del menú basado en el color del botón 'Regresar'
    let regColor = '';

    switch (seccion) {
        case 'Inicio':
            navBar.style.backgroundColor = '#30343c'; // Color de fondo para la barra lateral
            btnRegresar.style.backgroundColor = '#ffffff'; // Color de fondo para el botón de regresar
            btnRegresar.style.color = 'black'; // Color de texto para el botón de regresar
            document.body.style.backgroundColor = '#08090a'; // Fondo de la sección de Inicio
            regColor = 'black'; // Color de texto para los links en la sección 'Inicio'

            break;
        case 'Bloques':
            navBar.style.backgroundColor = '#284d70'; // Color de fondo para la barra lateral
            btnRegresar.style.backgroundColor = '#284d70'; // Color de fondo para el botón de regresar
            btnRegresar.style.color = 'white'; // Color de texto para el botón de regresar
            document.body.style.backgroundColor = '#e0f7fa'; // Fondo de la sección de Bloques
            regColor = 'skyblue'; // Color de texto para los links en la sección 'Bloques'

            break;
        case 'Estudiantes':
            navBar.style.backgroundColor = '#ff6347';
            btnRegresar.style.backgroundColor = '#ff6347'; // Color de fondo para el botón de regresar
            btnRegresar.style.color = 'white'; // Color de texto para el botón de regresar

            document.body.style.backgroundColor = '#9b9898'; // Fondo de la sección de Estudiantes
            regColor = 'orange'; // Color de texto para los links en la sección 'Estudiantes'

            break;
        case 'asistencia':
            document.body.style.backgroundColor = '#c8e6c9'; // Fondo de la sección de Asistencia
            regColor = 'orange'; // Color de texto para los links en la sección 'Asistencia'
            break;
        // Añadir más casos si agregas más secciones
    }

    // Cambiar el color de los enlaces al hacer hover
    menuLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.color = regColor; // Cambiar color de texto al hover
        });

        link.addEventListener('mouseleave', () => {
            link.style.color = ''; // Restaurar el color original
        });
    });

    // Guardar la sección visible en sessionStorage
    sessionStorage.setItem('visibleSection', seccion);
}


function menuasistencia() {
    const selectbloqueid = document.getElementById("bloqueEstudiantes").value;
    console.log(selectbloqueid);
    if (selectbloqueid == null || selectbloqueid == 'default') {
        alert("Tienes que seleccionar un bloque para ver su menú de asistencia");
    } else {
        mostrarContenido('asistencia');
    }
}



async function conseguirDatos(tipo) {
    try {
        let response;
        response = await fetch(`backend/opciones.php?accion=listar&tipo=${tipo}`);
        const data = await response.json();
        console.log(data);
        return data; // Retorna los datos obtenidos

    } catch (error) {
        console.error('Error al obtener los datos:', error);
        return null; // Retorna null en caso de error
    }
}

async function colocarbloquesEstudianteTabla(selectBloque) {

    const bloques = await conseguirDatos('bloque');
    // Array que contiene los IDs de los selects que queremos rellenar
    selectBloque.innerHTML = '<option value="default">--Seleccione un bloque--</option>';
    // Limpiar y rellenar selects
    bloques.forEach(bloque => {

        const option = document.createElement('option');
        option.value = bloque.id_bloque;
        option.textContent = `Bloque ${bloque.nombreB}`;
        selectBloque.appendChild(option);

    });
}


async function colocarbloques() {
    const bloques = await conseguirDatos('bloque');
    // Array que contiene los IDs de los selects que queremos rellenar
    const selects = ['bloqueeditar', 'selectBloquesE', 'bloqueEstudiantes', 'bloqueEstudianteid']; // Añade más IDs si es necesario

    // Limpiar y rellenar selects
    selects.forEach(selectId => {
        const selectBloque = document.getElementById(selectId);
        if (selectBloque) {
            selectBloque.innerHTML = '<option value="default">--Seleccione un bloque--</option>';

            bloques.forEach(bloque => {
                const option = document.createElement('option');
                option.value = bloque.id_bloque; // Suponiendo que el objeto bloque tiene id_bloque
                option.textContent = `Bloque ${bloque.nombreB}`; // Suponiendo que el objeto bloque tiene un campo nombreB
                selectBloque.appendChild(option);
            });
        }
    });

    // Actualizar la tabla con los bloques
    const tbody = document.querySelector('#tablaBloques tbody');
    tbody.innerHTML = ''; // Limpiar la tabla antes de rellenarla

    bloques.forEach(bloque => {
        const fila = document.createElement('tr');


        // Crear la celda para el nombre del bloque
        const celdaNombre = document.createElement('td');
        celdaNombre.textContent = bloque.nombreB;
        fila.appendChild(celdaNombre);

        // Crear la celda para los días del bloque
        const celdaDias = document.createElement('td');
        celdaDias.textContent = bloque.dias_estudio; // Asumiendo que los días son un array
        fila.appendChild(celdaDias);

        // Añadir la fila a la tabla
        tbody.appendChild(fila);
    });
}

// Función para agregar días a los select
function agregarDias() {
    const newDiasBloque = document.getElementById('newDiasBloque');
    const DiasBloque = document.getElementById('DiasBloque');

    diasDeLaSemana.forEach(dia => {
        // Crear un nuevo option para newDiasBloque
        const optionNew = document.createElement('option');
        optionNew.value = dia;
        optionNew.textContent = dia;
        newDiasBloque.appendChild(optionNew);

        // Crear un nuevo option para DiasBloque
        const optionDias = document.createElement('option');
        optionDias.value = dia;
        optionDias.textContent = dia;
        DiasBloque.appendChild(optionDias);
    });
}


// Llamada inicial para ocultar todas las secciones menos la primera
window.onload = function () {
    document.getElementById('Inicio').style.display = 'block';
    document.getElementById('Estudiantes').style.display = 'none';
    document.getElementById('Bloques').style.display = 'none';
    document.getElementById('Inicio').style.display = 'block';
    document.getElementById('noticias').style.display = 'block';
}


//ESTUDIANTES

async function colocarEstudiantes() {
    const selectCE = document.getElementById('bloqueEstudiantes').value;
    const estudiantes = await procesarFormulario('listarpB', 'estudiante', { bloques: selectCE }, null, false, true); // Enviar datos directamente

    // Agrega la verificación para ver si 'estudiantes' es un array
    if (!Array.isArray(estudiantes)) {
        console.error('Error: Se esperaban estudiantes, pero se recibió:', estudiantes);
        return; // Salir si no es un array
    }

    console.log('Estudiantes retornados:', estudiantes);

    // Actualizar la tabla con los estudiantes
    const tbody = document.querySelector('#tablaEstudiantes tbody');
    tbody.innerHTML = ''; // Limpiar la tabla antes de rellenarla

    estudiantes.forEach(estudiante => {
        const fila = document.createElement('tr');

        // Crear la celda para el nombre del estudiante
        const celdaNombre = document.createElement('td');
        celdaNombre.textContent = estudiante.nombre;
        celdaNombre.style.cursor = "pointer";
        celdaNombre.onclick = () => mostrarEstadisticasEstudiante(estudiante.id_estudiante);
        fila.appendChild(celdaNombre);

        // Crear la celda para el correo del estudiante
        const celdaCorreo = document.createElement('td');
        celdaCorreo.textContent = estudiante.correo; // Asumiendo que el correo es una propiedad del estudiante
        fila.appendChild(celdaCorreo);

        // Crear celda para el botón de actualizar
        const celdaActualizar = document.createElement('td');
        const botonActualizar = document.createElement('button');
        botonActualizar.textContent = 'Actualizar';
        botonActualizar.classList.add('btn', 'btn-warning'); // Añade clases para estilos, si es necesario
        botonActualizar.onclick = () => mostrarFormularioActualizacion(estudiante.id_estudiante, fila, estudiante.nombre, estudiante.correo, estudiante.id_bloque); // Llama a la función de actualización
        celdaActualizar.appendChild(botonActualizar);
        fila.appendChild(celdaActualizar);

        // Crear celda para el botón de eliminar
        const celdaEliminar = document.createElement('td');
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.classList.add('btn', 'btn-danger'); // Añade clases para estilos, si es necesario
        botonEliminar.onclick = () => btnEliminarEstudiante(estudiante.id_estudiante);
        celdaEliminar.appendChild(botonEliminar);
        fila.appendChild(celdaEliminar);

        // Añadir la fila a la tabla
        tbody.appendChild(fila);
    });
}

async function mostrarFormularioActualizacion(idEstudiante, fila, nombreA, correo, bloqueid) {
    console.log(idEstudiante);
    console.log(bloqueid);
    // Comprobar si ya hay un formulario de actualización en pantalla
    if (document.getElementById(`formulario-actualizacion-${idEstudiante}`)) return;

    const filaFormulario = document.createElement('tr');
    filaFormulario.id = `formulario-actualizacion-${idEstudiante}`;

    const celdaFormulario = document.createElement('td');
    celdaFormulario.colSpan = 4; // Ocupa todas las columnas de la fila

    // Etiqueta y campo de entrada para nombre
    const labelNombre = document.createElement('label');
    labelNombre.textContent = 'Nuevo Nombre:';
    labelNombre.classList.add('form-label'); // Clase opcional para estilos

    const inputNombre = document.createElement('input');
    inputNombre.type = 'text';
    inputNombre.value = nombreA;
    inputNombre.placeholder = 'Nuevo Nombre';
    inputNombre.classList.add('form-control');

    // Etiqueta y campo de entrada para correo
    const labelCorreo = document.createElement('label');
    labelCorreo.textContent = 'Nuevo Correo:';
    labelCorreo.classList.add('form-label');

    const inputCorreo = document.createElement('input');
    inputCorreo.type = 'email';
    inputCorreo.value = correo;
    inputCorreo.placeholder = 'Nuevo Correo';
    inputCorreo.classList.add('form-control');

    // Etiqueta y campo de selección para bloque
    const labelBloque = document.createElement('label');
    labelBloque.textContent = 'Seleccionar Bloque:';
    labelBloque.classList.add('form-label');

    const bloqueSelect = document.createElement('select');
    bloqueSelect.id = `bloqueSelect-${idEstudiante}`;
    await colocarbloquesEstudianteTabla(bloqueSelect);
    bloqueSelect.value = bloqueid;
    bloqueSelect.classList.add('form-control');

    // Botón para guardar
    const botonGuardar = document.createElement('button');
    botonGuardar.textContent = 'Guardar';
    botonGuardar.classList.add('btn', 'btn-success', 'mt-2');
    botonGuardar.onclick = () => btnActualizarEstudiante(idEstudiante, inputNombre.value, inputCorreo.value, bloqueSelect.value);

    // Botón para cancelar
    const botonCancelar = document.createElement('button');
    botonCancelar.textContent = 'Cancelar';
    botonCancelar.classList.add('btn', 'btn-danger', 'mt-2', 'ml-2');
    botonCancelar.onclick = () => filaFormulario.remove();

    // Añadir elementos al contenedor del formulario
    celdaFormulario.appendChild(labelNombre);
    celdaFormulario.appendChild(inputNombre);
    celdaFormulario.appendChild(labelCorreo);
    celdaFormulario.appendChild(inputCorreo);
    celdaFormulario.appendChild(labelBloque);
    celdaFormulario.appendChild(bloqueSelect);
    celdaFormulario.appendChild(botonGuardar);
    celdaFormulario.appendChild(botonCancelar);

    filaFormulario.appendChild(celdaFormulario);
    fila.after(filaFormulario); // Insertar la fila de formulario debajo de la fila actual
}

async function valorbloquesestudiantes() {
    const valorSelect = document.getElementById('bloqueEstudiantes').value;
    const selectAgregar = document.getElementById('bloqueEstudianteid');

    console.log("Se puso el valor: ", valorSelect, "en", selectAgregar);
    selectAgregar.value = valorSelect;
}

document.addEventListener('DOMContentLoaded', () => {
    agregarDias();
    colocarbloques();
});

document.getElementById('bloqueEstudiantes').addEventListener('change', async function () {
    await colocarEstudiantes();
    await valorbloquesestudiantes();
    restearpartes();
});

