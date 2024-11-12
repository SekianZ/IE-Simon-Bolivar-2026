document.addEventListener('DOMContentLoaded', () => {
    actualizarDatos(); // Inicializa la tabla al cargar la página
});

let currentMonth = new Date().getMonth(); // Obtiene el mes actual (0-11)
let currentYear = new Date().getFullYear();
let diaActual = new Date().getDate(); // Obtiene el año actual
let fechaSeleccionada = null; // Declaración global

function cambiarMes(offset) {
    // Calcular el nuevo mes y el nuevo año
    let newMonth = currentMonth + offset;
    let newYear = currentYear;

    if (newMonth > 11) {
        newMonth = 0;
        newYear++;
    } else if (newMonth < 0) {
        newMonth = 11;
        newYear--;
    }

    // Actualizar las variables globales
    currentMonth = newMonth;
    currentYear = newYear;

    // Actualizar la fechaSeleccionada si el nuevo mes es el mes actual
    const fechaActual = new Date();
    if (newMonth === fechaActual.getMonth() && newYear === fechaActual.getFullYear()) {
        fechaSeleccionada = fechaActual; // Mantener la fecha actual si estamos en el mes actual
    } else {
        fechaSeleccionada = null; // No hay día actual si no es el mes actual
    }

    if (newMonth === fechaActual.getMonth() && newYear === fechaActual.getFullYear()) {
        diaActual = fechaActual.getDate();
    } else {
        diaActual = null; // No hay día actual si no es el mes actual
    }

    console.log('Month changed to:', newMonth);
    console.log('Year changed to:', newYear);
    console.log('Día actual:', diaActual); // Verifica que se actualiza correctamente

    // Actualizar la tabla
    actualizarDatos();
}

async function obtenerDatosAsistencia() {
    const selectAV = document.getElementById('bloqueasis').value;

    if (selectAV === "default") {
        return { alumnos: [], asistencia: [] };
    }

    try {
        // Solicitud para los datos de asistencia
        const formDataAsistencia = new FormData();
        formDataAsistencia.append('accion', 'listar');
        formDataAsistencia.append('tipo', 'asistencia');
        formDataAsistencia.append('datos[mes]', String(currentMonth + 1).padStart(2, '0'));
        console.log(String(currentMonth + 1).padStart(2, '0')); // Directamente como JSON
        formDataAsistencia.append('datos[anio]', currentYear);
        console.log(currentYear);
        formDataAsistencia.append('datos[bloqueE]', selectAV);
        console.log(selectAV);

        const asistenciaResponse = await fetch('backend/opciones.php', {
            method: 'POST',
            body: formDataAsistencia
        });

        if (!asistenciaResponse.ok) {
            throw new Error(`Error en la solicitud: ${asistenciaResponse.statusText}`);
        }

        const asistencia = await asistenciaResponse.json();
        console.log(asistencia);

        // Solicitud para los datos de los alumnos
        const formDataAlumnos = new FormData();
        formDataAlumnos.append('accion', 'listarpB');
        formDataAlumnos.append('tipo', 'estudiante');
        formDataAlumnos.append('datos[bloques]', selectAV); // Directamente como JSON

        const alumnosResponse = await fetch('backend/opciones.php', {
            method: 'POST',
            body: formDataAlumnos
        });

        if (!alumnosResponse.ok) {
            throw new Error(`Error en la solicitud: ${alumnosResponse.statusText}`);
        }

        const alumnos = await alumnosResponse.json();
        console.log(alumnos);

        // Transformar los datos de asistencia para el formato requerido
        const asistenciaTransformada = transformarAsistencia(asistencia);

        return { alumnos, asistencia: asistenciaTransformada };
    } catch (error) {
        console.error('Error al obtener datos de asistencia:', error);
        return { alumnos: [], asistencia: [] };
    }
}

function transformarAsistencia(asistencia) {
    const asistenciaMap = {};

    asistencia.forEach(record => {
        const { id_estudiante, fecha, estado } = record;
        const dia = fecha.split('-')[2]; // Extraer el día de la fecha (dd)

        if (!asistenciaMap[id_estudiante]) {
            asistenciaMap[id_estudiante] = {};
        }

        asistenciaMap[id_estudiante][dia] = estado;
    });

    return asistenciaMap;

}

let mapeobloques = {};

function conseguirbloques(callback) {
    fetch("backend/opciones.php?accion=listar&tipo=bloque")
        .then(response => response.json())
        .then(data => {
            mapeobloques = data;
            if (callback) callback(mapeobloques); // Llamar a la función de callback después de obtener los datos
        })
        .catch(error => console.error('Error al obtener los datos de los bloques:', error));
}

function colocarbloques(bloques) {
    const selectBloque = document.getElementById('bloqueasis');
    // Limpiar las opciones actuales
    selectBloque.innerHTML = '<option value="default">--Seleccione un bloque--</option>';

    bloques.forEach(bloque => {
        // Crear una nueva opción
        const option = document.createElement('option');
        option.value = bloque.id_bloque; // Suponiendo que el objeto bloque tiene id_bloque
        option.textContent = `Bloque ${bloque.nombreB}`; // Suponiendo que el objeto bloque tiene un campo nombre

        // Añadir la opción al select
        selectBloque.appendChild(option);
    });

    const bloquesDiv = document.getElementById('bloques');
    bloquesDiv.innerHTML = ''; // Limpiar los bloques anteriores

    bloques.forEach(bloque => {
        // Crear el elemento del checkbox y el label
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `bloque${bloque.nombreB}`; // Usar el nombre del bloque
        checkbox.name = 'bloque';
        checkbox.value = bloque.id_bloque; // Suponiendo que el bloque tiene id_bloque

        // Crear el texto que irá al lado del checkbox
        label.textContent = ` Bloque ${bloque.nombreB}`;
        label.prepend(checkbox); // Añadir el checkbox antes del texto
        bloquesDiv.appendChild(label); // Añadir al div de bloques
        bloquesDiv.appendChild(document.createElement('br')); // Añadir salto de línea
    });
}

// Llama a conseguirbloques y luego usa los datos
conseguirbloques((data) => {
    colocarbloques(data); // Pasa los bloques a la función que los coloca en el select
});


async function transformarbloquemapasis(mapeo) {
    const bloques = Array.isArray(mapeo) ? mapeo : mapeo.bloques || []; // Ajusta según la estructura real

    const diasPorBloque = {};

    bloques.forEach(bloque => {
        if (bloque.dias_estudio) {
            const diasArray = bloque.dias_estudio.split(',').map(dia => dia.toLowerCase().trim());
            diasPorBloque[bloque.id_bloque] = diasArray;
        }
    });

    return diasPorBloque;
}

function tranformarmapeobloque(mapeo) {
    const bloques = Array.isArray(mapeo) ? mapeo : mapeo.bloques || [];

    const diasPorBloque = {};

    bloques.forEach(bloque => {
        if (bloque.dias_estudio) {
            const diasArray = bloque.dias_estudio.split(',').map(dia => dia.toLowerCase().trim());
            diasPorBloque[bloque.id_bloque] = diasArray;
        }
    });

    return diasPorBloque;
}

function generarDiasDelMes(bloque) {
    // Aquí deberías asegurarte de que mapeobloques ya tenga los datos cargados
    const diasPorBloque = tranformarmapeobloque(mapeobloques);

    const diasVisibles = diasPorBloque[bloque] || [];
    const fecha = new Date(currentYear, currentMonth + 1, 0); // Último día del mes
    const diasDelMes = [];

    // Iterar a través de los días del mes
    for (let i = 1; i <= fecha.getDate(); i++) {
        const diaActual = new Date(currentYear, currentMonth, i);
        const diaSemana = diaActual.toLocaleString('es-ES', { weekday: 'long' }); // Nombre del día en español

        // Si el día corresponde a los días específicos del bloque, añadirlo
        if (diasVisibles.includes(diaSemana)) {
            diasDelMes.push(String(i).padStart(2, '0')); // Añadir el día al array
        }
    }

    return diasDelMes;
}


function calcularPorcentajeAsistencia(asistencia, diasVisibles) {
    // Filtra los días visibles que tienen registro de asistencia
    const diasRegistrados = diasVisibles.filter(dia => asistencia[dia] !== 'No registrado');
    const totalDiasRegistrados = diasRegistrados.length;
    // Filtra los días registrados que están marcados como 'Presente'
    const diasAsistidos = diasRegistrados.filter(dia => asistencia[dia] === 'Presente').length;
    // Calcula el porcentaje de días asistidos
    return totalDiasRegistrados > 0 ? Math.round((diasAsistidos / totalDiasRegistrados) * 100) : 0;
}

// Variable global para almacenar la fecha seleccionada
document.addEventListener('DOMContentLoaded', () => {
    const fechaInput = document.getElementById('fechaasistencia');
    if (fechaInput) {
        fechaInput.addEventListener('change', (event) => {
            const fecha = new Date(event.target.value);
            if (!isNaN(fecha.getTime())) {
                const mestrue = new Date().getMonth();
                const añotrue = new Date().getFullYear();
                fechaSeleccionada = fecha; // Actualizar fechaSeleccionada
                currentMonth = fecha.getMonth(); // Actualizar mes
                currentYear = fecha.getFullYear(); // Actualizar año
                const fechaActual = new Date();

                if (currentMonth === mestrue && currentYear === añotrue) {
                    diaActual = fechaActual.getDate();
                } else {
                    diaActual = null; // No hay día actual si no es el mes actual
                }
                // Actualizar la tabla
                actualizarDatos();
            }
        });
    }
});

async function actualizarTabla() {
    const selectAV = document.getElementById('bloqueasis').value;
    const { alumnos, asistencia } = await obtenerDatosAsistencia();
    const diasVisibles = generarDiasDelMes(selectAV);

    const tbody = document.getElementById('asistencia-data');
    const encabezadoDias = document.getElementById('encabezado-dias');

    // Actualizar solo el título del mes
    const mesNombre = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
    document.getElementById('asistencia-mes').innerText = `Asistencia del Mes (${mesNombre} ${currentYear})`;

    // Limpiar las filas de datos anteriores
    tbody.innerHTML = '';

    // Limpiar encabezado de días anterior y agregar nuevos días
    encabezadoDias.innerHTML = '<th id="nombre-alumno">Nombre</th>'; // Restablecer encabezado

    // Generar encabezados de los días con id único
    diasVisibles.forEach((dia, index) => {
        encabezadoDias.innerHTML += `<th id="dia-${index + 1}">${dia}</th>`;
    });

    // Agregar las columnas adicionales con sus propios IDs
    encabezadoDias.innerHTML += `
        <th id="asistencias-alumno">Asistencias</th>
        <th id="tardanza-alumno">Tardanzas</th>
        <th id="faltas-alumno">Faltas</th>
        <th id="porcentaje-asistencias">% asistencias</th>
    `;

    // Crear filas para cada estudiante
    alumnos.forEach(alumno => {
        const fila = document.createElement('tr');
        fila.innerHTML = `<td class="alumnos-asistencia">${alumno.nombre}</td>`;

        let tardanzas = 0;
        let faltas = 0;
        let asistencias = 0;

        // Añadir celdas para cada día del mes
        diasVisibles.forEach(dia => {
            const estado = asistencia[alumno.id_estudiante] && asistencia[alumno.id_estudiante][dia] || 'No registrado';
            let icono;
            switch (estado) {
                case 'Presente':
                    icono = '✔️'; // Check mark
                    asistencias++;
                    break;
                case 'Ausente':
                    icono = '❌'; // Cross mark
                    faltas++;
                    break;
                case 'Tarde':
                    icono = '⌛'; // Hourglass
                    tardanzas++;
                    break;
                default:
                    icono = '❓'; // Empty cell for "No registrado"
                    break;
            }
            // Crear la celda con el icono y agregar un evento para cambiar de estado al hacer clic
            const celda = document.createElement('td');
            celda.classList.add('estado');
            celda.dataset.idEstudiante = alumno.id_estudiante;
            celda.dataset.dia = dia;
            celda.innerHTML = `<span class="estado-clickable">${icono}</span>`; // Usar span para interactividad

            // Resaltar la celda si es el día actual
            if (diaActual && parseInt(dia) === diaActual) {
                celda.classList.add('resaltado'); // Clase para resaltar el día actual
            } else {
                celda.classList.remove('resaltado'); // Asegurarse de quitar el resaltado si no es el día actual
            }

            fila.appendChild(celda);
        });

        // Agregar las estadísticas (Tardanzas, Faltas, Asistencias) al final de la fila
        fila.innerHTML += `<td class="asistencias-tabla">${asistencias}</td>`;
        fila.innerHTML += `<td class="tardanzas-tabla">${tardanzas}</td>`;
        fila.innerHTML += `<td class="faltas-tabla">${faltas}</td>`;

        // Calcular y agregar el porcentaje de asistencias
        const porcentaje = calcularPorcentajeAsistencia(asistencia[alumno.id_estudiante] || {}, diasVisibles);
        fila.innerHTML += `<td class="porcentaje-tabla">${porcentaje}%</td>`;

        tbody.appendChild(fila);
    });

    // Asignar eventos de clic a todas las celdas generadas después de crearlas
    document.querySelectorAll('.estado').forEach(celda => {
        celda.addEventListener('click', () => cambiarEstado(celda, celda.dataset.idEstudiante, celda.dataset.dia));
    });
}

function cambiarEstado(celda, idEstudiante, dia) {
    // Obtener el estado actual desde el span dentro de la celda
    const spanEstado = celda.querySelector('span');
    let estadoActual = spanEstado.innerText;

    // Ciclar entre los estados de asistencia
    switch (estadoActual) {
        case '✔️':
            estadoActual = '❌'; // Ausente
            break;
        case '❌':
            estadoActual = '⌛'; // Tarde
            break;
        case '⌛':
            estadoActual = '❓'; // No registrado
            break;
        default:
            estadoActual = '✔️'; // Presente
    }

    // Actualiza visualmente el estado en el span
    spanEstado.innerText = estadoActual;

    // Construir la fecha completa con el año, mes y día (ajusta según tu lógica)
    const fechaCompleta = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${dia}`;

    // Llamar a una función para actualizar el estado en el servidor
    actualizarAsistencia(idEstudiante, fechaCompleta, estadoActual)
        .then(() => {
            actualizarDatos();
            console.log('Estado actualizado en el servidor');
        })
        .catch(error => {
            console.error('Error al actualizar el estado', error);
        });
}




async function eliminarVacios() {
    try {
        const response = await fetch("backend/opciones.php?accion=eliminar_vacio");
        const data = await response.json();

        if (data.status === 'success') {
            console.log(data.message); // Mensaje de éxito
            console.log('Filas eliminadas:', data.filasEliminadas); // Mostrar cuántas filas fueron eliminadas
            // Aquí puedes actualizar la tabla o realizar la acción necesaria
        } else {
            console.error('Error al eliminar vacíos:', data.error); // Mostrar el error en caso de fallo
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}


// Función para enviar los datos al servidor
async function actualizarAsistencia(idEstudiante, fechaCompleta, nuevoEstado) {
    try {
        console.log('ID del estudiante:', idEstudiante);
        console.log('Fecha:', fechaCompleta);  // Mostrar la fecha completa
        console.log('Nuevo estado (emoji):', nuevoEstado);

        // Convertir emoji a texto
        const estadoTexto = convertirEmojiAEstado(nuevoEstado);
        console.log('Nuevo estado (texto):', estadoTexto);

        const formData = new FormData();
        formData.append('accion', 'actualizar_asistencia');
        formData.append('id_estudiante', idEstudiante);
        formData.append('fecha', fechaCompleta);  // Enviar la fecha completa
        formData.append('estado', estadoTexto);

        console.log('Formulario enviado a opcione.php (texto):');
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

        response = await fetch('backend/opciones.php', {
            method: 'POST',
            body: formData
        });

        eliminarVacios();



        const resultado = await response.json();
        if (resultado.success) {
            console.log('Asistencia actualizada correctamente',resultado.mensaje);
        } else {
            console.error('Error al actualizar asistencia:', resultado.mensaje);
        }
    } catch (error) {
        console.error('Error al hacer la solicitud:', error);
    }
}


function convertirEmojiAEstado(emoji) {
    switch (emoji) {
        case '✔️':
            console.log('Presente');
            return 'Presente';
        case '❌':
            console.log('Ausente');
            return 'Ausente';
        case '⌛':
            console.log('Tarde');
            return 'Tarde';
        default:
            return ''; // Si no coincide con ningún emoji, devuelve una cadena vacía
    }
}


async function obtenerDatosAnuales() {
    try {
        const bloque = document.getElementById('bloqueasis').value;
        //const currentYear = new Date().getFullYear();

        const formData = new FormData();
        formData.append('accion', 'estadsanuales');
        formData.append('tipo', 'asistencia');
        formData.append('datos[bloque]', bloque);
        formData.append('datos[anio]', currentYear);

        const response = await fetch('backend/opciones.php', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const text = await response.text(); // Obtener la respuesta como texto
        console.log('Respuesta del servidor:', text);

        try {
            const asistenciaAnual = JSON.parse(text); // Intentar convertir a JSON
            console.log('Datos anuales:', asistenciaAnual);
            return asistenciaAnual;
        } catch (jsonError) {
            console.error('Error al analizar JSON:', jsonError);
            return null;
        }
    } catch (error) {
        console.error('Error al obtener datos anuales:', error);
        return null;
    }
}

// Función para calcular estadísticas
function calcularEstadisticas(alumnos, asistencia, asistenciaAnual) {
    const estadisticas = {
        impuntualMes: { nombre: '', faltas: 0, tardanzas: 0 },
        puntualMes: { nombre: '', asistencias: 0 },
        tardanzasMes: { nombre: '', tardanzas: 0 },
        impuntualAno: asistenciaAnual.faltas,
        puntualAno: asistenciaAnual.asistencias,
        tardanzasAno: asistenciaAnual.tardanzas
    };
    const selectAV = document.getElementById('bloqueasis').value;
    const diasDelMes = generarDiasDelMes(selectAV);

    alumnos.forEach(alumno => {
        let asistenciasMes = 0;
        let tardanzasMes = 0;
        let faltasMes = 0;

        diasDelMes.forEach(dia => {
            const estado = asistencia[alumno.id_estudiante] && asistencia[alumno.id_estudiante][dia] || 'No registrado';
            switch (estado) {
                case 'Presente':
                    asistenciasMes++;
                    break;
                case 'Ausente':
                    faltasMes++;
                    break;
                case 'Tarde':
                    tardanzasMes++;
                    break;
            }
        });

        if (tardanzasMes > estadisticas.tardanzasMes.tardanzas) {
            estadisticas.tardanzasMes = { nombre: alumno.nombre, tardanzas: tardanzasMes };
        }

        if (asistenciasMes > estadisticas.puntualMes.asistencias) {
            estadisticas.puntualMes = { nombre: alumno.nombre, asistencias: asistenciasMes };
        }

        if (faltasMes > estadisticas.impuntualMes.faltas) {
            estadisticas.impuntualMes = { nombre: alumno.nombre, faltas: faltasMes, tardanzas: tardanzasMes };
        }
    });

    return estadisticas;
}

// Función para actualizar estadísticas
async function actualizarEstadisticas() {
    const { alumnos, asistencia } = await obtenerDatosAsistencia(); // Datos del mes actual
    const asistenciaAnual = await obtenerDatosAnuales(); // Datos del año

    if (!asistenciaAnual) {
        console.error('No se pudieron obtener los datos anuales');
        return;
    }

    const estadisticas = calcularEstadisticas(alumnos, asistencia, asistenciaAnual);

    document.getElementById('impuntual-mes').innerText = `${estadisticas.impuntualMes.nombre} (${estadisticas.impuntualMes.faltas} faltas, ${estadisticas.impuntualMes.tardanzas} tardanzas)`;
    document.getElementById('puntual-mes').innerText = `${estadisticas.puntualMes.nombre} (${estadisticas.puntualMes.asistencias} asistencias)`;
    document.getElementById('tardanzas-mes').innerText = `${estadisticas.tardanzasMes.nombre} (${estadisticas.tardanzasMes.tardanzas} tardanzas)`;

    document.getElementById('impuntual-ano').innerText = `${estadisticas.impuntualAno.nombre} (${estadisticas.impuntualAno.faltas} faltas)`;
    document.getElementById('puntual-ano').innerText = `${estadisticas.puntualAno.nombre} (${estadisticas.puntualAno.asistencias} asistencias)`;
    document.getElementById('tardanzas-ano').innerText = `${estadisticas.tardanzasAno.nombre} (${estadisticas.tardanzasAno.tardanzas} tardanzas)`;
}


// Llama a esta función después de actualizar la tabla
async function actualizarDatos() {
    await actualizarTabla(); // Actualiza la tabla de asistencia
    await actualizarEstadisticas(); // Actualiza las estadísticas
}