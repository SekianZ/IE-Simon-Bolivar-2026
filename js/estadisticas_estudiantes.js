/*document.querySelectorAll('#lista-estudiantes li').forEach(estudiante => {
    estudiante.addEventListener('click', function() {
        const idEstudiante = this.getAttribute('data-id');

        // Realiza la solicitud Fetch para obtener los datos del estudiante
        fetch(`backend/opciones.php?accion=obtener_estadisticas&id_estudiante=${idEstudiante}`)
            .then(response => response.json())
            .then(data => {
                // Actualiza el contenido del div con los datos recibidos
                if (data.success) {
                    document.getElementById('nombre-estudiante').textContent = data.nombre;
                    document.getElementById('asistencias').textContent = data.asistencias;
                    document.getElementById('faltas').textContent = data.faltas;
                    document.getElementById('tardanzas').textContent = data.tardanzas; // Mostramos solo 2 decimales

                    // Actualizar otros detalles adicionales
                    document.getElementById('correo').textContent = data.correo;
                    document.getElementById('bloque').textContent = data.bloque;
                } else {
                    document.getElementById('detalles-estudiante').innerHTML = `
                        <p>Error al cargar los datos del estudiante</p>
                    `;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('detalles-estudiante').innerHTML = `
                    <p>Hubo un error al obtener los datos del estudiante</p>
                `;
            });
    });
});*/


let estadoPorDefecto = {
  asistencias: 0,
  faltas: 0,
  tardanzas: 0,
};

function restearpartes() {
  // Reiniciar los valores de asistencia a los valores por defecto
  document.getElementById("nombre-estudiante").textContent = '';
  document.getElementById("asistencias").textContent = estadoPorDefecto.asistencias;
  document.getElementById("faltas").textContent = estadoPorDefecto.faltas;
  document.getElementById("tardanzas").textContent = estadoPorDefecto.tardanzas;

  // Limpiar detalles adicionales
  document.getElementById("correo").textContent = "";
  document.getElementById("bloque").textContent = "";

  const contenedorAsistencias = document.getElementById('contenedorAsistencias');
  contenedorAsistencias.innerHTML = ''; // Limpia el contenido de asistencias

}



function mostrarEstadisticasEstudiante(idEstudiante) {

  if (idEstudiante) {
    // Realiza la solicitud Fetch para obtener los datos del estudiante
    fetch(
      `backend/opciones.php?accion=obtener_estadisticas&id_estudiante=${idEstudiante}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Verificar si la respuesta tiene éxito
        if (data.success) {
          // Actualizar los detalles del estudiante con los datos obtenidos
          document.getElementById("nombre-estudiante").textContent = data.nombre;
          document.getElementById("asistencias").textContent = data.asistencias;
          document.getElementById("faltas").textContent = data.faltas;
          document.getElementById("tardanzas").textContent = data.tardanzas;

          // Actualizar otros detalles adicionales
          document.getElementById("correo").textContent = data.correo;
          document.getElementById("bloque").textContent = data.bloque;
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "ID inexistente, coloque otro ID",
            showConfirmButton: true
          }).then((result) => {
            if (result.isConfirmed) {
              // Salir de la función guardarCambios
              return;
            }
          });
        }
      })
      .catch((error) => {
        // Manejo de errores
        console.error("Error:", error);
        document.getElementById("detalles-estudiante").innerHTML = `
                    <p>Hubo un error al obtener los datos del estudiante</p>
                `;
      });
  } else {
    // Mensaje de validación si no se ha ingresado el ID del estudiante
    alert("Por favor, ingrese un ID de estudiante válido.");
  }
}

let currentYear = new Date().getFullYear(); // Año actual
let currentMonth = new Date().getMonth(); // Mes actual (0-11)

// Crear controles para cambiar el año
function crearControlesAño() {
  const contenedorControles = document.getElementById('contenedorControles');

  // Botón para reducir el año
  const botonReducirAño = document.createElement('button');
  botonReducirAño.textContent = 'Año anterior';
  botonReducirAño.addEventListener('click', () => cambiarAño(-1));

  // Botón para incrementar el año
  const botonIncrementarAño = document.createElement('button');
  botonIncrementarAño.textContent = 'Año siguiente';
  botonIncrementarAño.addEventListener('click', () => cambiarAño(1));

  // Mostrar el año actual
  const spanAñoActual = document.createElement('span');
  spanAñoActual.id = 'añoActual';
  spanAñoActual.textContent = ` ${currentYear} `;

  // Agregar los elementos al contenedor de controles
  contenedorControles.appendChild(botonReducirAño);
  contenedorControles.appendChild(spanAñoActual);
  contenedorControles.appendChild(botonIncrementarAño);
}

// Función para cambiar el año
function cambiarAño(incremento) {
  currentYear += incremento; // Cambiar el año
  document.getElementById('añoActual').textContent = ` ${currentYear} `; // Actualizar la visualización del año
  actualizarMeses(); // Actualizar los meses disponibles
  mostrarAsistencias(); // Mostrar las asistencias del nuevo año
}

// Función para actualizar los meses disponibles
function actualizarMeses() {
  const selectMeses = document.getElementById('month');
  selectMeses.innerHTML = ''; // Limpiar las opciones anteriores

  // Generar meses en función del año actual (puedes ajustarlo según tus necesidades)
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  meses.forEach(mes => {
    const option = document.createElement('option');
    option.value = mes.toLowerCase();
    option.textContent = mes.charAt(0).toUpperCase() + mes.slice(1);
    selectMeses.appendChild(option);
  });
}

// Llamar a la función para generar los controles de año al cargar la página
crearControlesAño();
actualizarMeses(); // Inicializar los meses con el año actual


async function mapeodebloque() {
  const accion = 'listar';
  const tipo = 'bloque';
  const url = `backend/opciones.php?accion=${encodeURIComponent(accion)}&tipo=${encodeURIComponent(tipo)}`;

  const mapeoresponse = await fetch(url, {
    method: 'GET',
  });

  if (!mapeoresponse.ok) {
    throw new Error(`Error en la solicitud: ${mapeoresponse.statusText}`);
  }

  const mapeo = await mapeoresponse.json();
  console.log(`Mapeo de bloques:`, mapeo); // Verifica la estructura aquí

  const mapeogod = await transformarbloquemap(mapeo);
  return mapeogod;
}

async function transformarbloquemap(mapeo) {
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

const mesesMap = {
  'enero': '01',
  'febrero': '02',
  'marzo': '03',
  'abril': '04',
  'mayo': '05',
  'junio': '06',
  'julio': '07',
  'agosto': '08',
  'septiembre': '09',
  'octubre': '10',
  'noviembre': '11',
  'diciembre': '12'
};

async function generardias(year, monthName) {
  if (!monthName) {
    console.error('El nombre del mes no puede ser undefined');
    return []; // O lanzar un error, según lo que prefieras
  }

  const bloque = document.getElementById('bloqueEstudiantes').value; // Suponiendo que este es el bloque que quieres usar
  console.log(bloque);

  // Obtener días visibles desde mapeodebloque
  const diasPorBloque = await mapeodebloque();
  console.log(diasPorBloque); // Verifica el contenido de diasPorBloque

  const diasVisibles = diasPorBloque[bloque] || [];
  console.log(diasVisibles);

  const month = parseInt(mesesMap[monthName.toLowerCase()]); // Obtener el índice del mes

  console.log(month);

  if (!month) {
    console.error('Mes no válido:', monthName);
    return []; // O lanzar un error, según lo que prefieras
  }

  const fecha = new Date(year, month, 0); // Último día del mes
  const diasDelMes = [];

  // Iterar a través de los días del mes
  for (let i = 1; i <= fecha.getDate(); i++) {
    const diaActual = new Date(year, month - 1, i); // Ajuste: mes es 0-indexado
    const diaSemana = diaActual.toLocaleString('es-ES', { weekday: 'long' }); // Nombre del día en español

    // Si el día corresponde a los días específicos del bloque, añadirlo
    if (diasVisibles.includes(diaSemana)) {
      diasDelMes.push(String(i).padStart(2, '0')); // Añadir el día al array
    }
  }

  return diasDelMes;
}

// Llama a la función generardias con un año y un nombre de mes
(async () => {
  const diasDelMes = await generardias(2024, 'septiembre'); // Septiembre 2024
  console.log(diasDelMes); // Muestra los días seleccionados
})();









async function obtenerAsistencia() {
  const bloque = document.getElementById('bloqueEstudiantes').value;
  console.log(bloque);
  const SelectMes = document.getElementById("month");
  const mesesSeleccionados = Array.from(SelectMes.selectedOptions).map(option => option.value);
  const asistenciaFinal = {}; // Objeto para almacenar la asistencia final

  try {
    for (const nombremes of mesesSeleccionados) {
      const mes = mesesMap[nombremes.toLowerCase()];
      if (!mes) {
        console.error(`Mes no encontrado para: ${nombremes}`);
        continue;
      }

      const asistenciaform = new FormData();
      asistenciaform.append('accion', 'listar');
      asistenciaform.append('tipo', 'asistencia');
      asistenciaform.append('datos[mes]', mes);
      console.log(mes);
      asistenciaform.append('datos[anio]', currentYear);
      console.log(currentYear);
      asistenciaform.append('datos[bloqueE]', bloque);
      console.log(bloque);

      const asistenciaResponse = await fetch('backend/opciones.php', {
        method: 'POST',
        body: asistenciaform
      });

      if (!asistenciaResponse.ok) {
        throw new Error(`Error en la solicitud: ${asistenciaResponse.statusText}`);
      }

      const asistencia = await asistenciaResponse.json();
      console.log(`Asistencia para ${nombremes}:`, asistencia);

      // Transformar los datos de asistencia para el formato requerido
      const asistTransform = transformarAsistencia(asistencia);
      asistenciaFinal[nombremes] = asistTransform;
      console.log(asistTransform)
    }

    const alumnosForm = new FormData();
    alumnosForm.append('accion', 'listarpB');
    alumnosForm.append('tipo', 'estudiante');
    alumnosForm.append('datos[bloques]', bloque);

    const alumnosResponse = await fetch('backend/opciones.php', {
      method: 'POST',
      body: alumnosForm
    });

    if (!alumnosResponse.ok) {
      throw new Error(`Error en la solicitud: ${alumnosResponse.statusText}`);
    }

    const alumnos = await alumnosResponse.json();
    console.log('Alumnos:', alumnos);

    return { alumnos, asistencia: asistenciaFinal }; // Ya devuelves la asistencia transformada
  } catch (error) {
    console.error('Error al obtener datos de asistencia:', error);
    return { alumnos: [], asistencia: {} };
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


// Función para cambiar el estado a emoji
function cambiarEstadoAEmoji(estado) {
  switch (estado) {
    case 'Presente':
      return '✔️';
    case 'Tarde':
      return '⏰';
    case 'Ausente':
      return '❌';
    default:
      return '❓'; // Por defecto, consideramos interrogación
  }
}

async function mostrarAsistencias() {
  const mesesSeleccionados = Array.from(document.getElementById('month').selectedOptions).map(option => option.value);
  const contenedor = document.getElementById('contenedorAsistencias');

  const { alumnos, asistencia } = await obtenerAsistencia();

  console.log('Datos de asistencia:', asistencia);
  console.log('Datos de alumnos:', alumnos);

  const titulo = document.createElement('h2');
  titulo.textContent = `ASISTENCIA ${currentYear}`;
  contenedor.innerHTML = ''; // Limpiar el contenedor
  contenedor.appendChild(titulo);

  const totalesPorAlumno = {};

  // Iterar sobre los meses seleccionados
  for (const mes of mesesSeleccionados) {
    const diasMes = await generardias(currentYear, mes);

    console.log('El mes es ', mes);

    const alumnosMes = Object.entries(asistencia[mes] || {});
    console.log('Asistencia del mes:', asistencia[mes]); // Verifica la asistencia para el mes
    const tituloMes = document.createElement('h3');
    tituloMes.textContent = `Asistencia del mes de ${mes.charAt(0).toUpperCase() + mes.slice(1)}`;
    contenedor.appendChild(tituloMes);

    // Generar días visibles
    console.log('Días seleccionados:', diasMes); // Verifica los días generados
    const tabla = document.createElement('table');
    const thead = document.createElement('thead');

    // Encabezados de la tabla
    thead.innerHTML = `<tr>
                          <th>Nombre del Alumno</th>
                          ${diasMes.map(dia => `<th>${dia}</th>`).join('')}
                          <th>Asistencias del Mes</th>
                          <th>Faltas del Mes</th>
                          <th>Tardanzas del Mes</th>
                        </tr>`;
    tabla.appendChild(thead);

    const tbody = document.createElement('tbody');

    // Iterar sobre los alumnos
    alumnos.forEach(alumno => {
      const tr = document.createElement('tr');
      const tdNombre = document.createElement('td');
      tdNombre.textContent = alumno.nombre;
      tr.appendChild(tdNombre);

      // Inicializar totales
      if (!totalesPorAlumno[alumno.nombre]) {
        totalesPorAlumno[alumno.nombre] = { asistencias: 0, faltas: 0, tardanzas: 0 };
      }

      let asistenciasMes = 0;
      let faltasMes = 0;
      let tardanzasMes = 0;

      // Asistencia diaria
      diasMes.forEach(dia => {
        const tdAsistencia = document.createElement('td');
        const estado = asistencia[mes][alumno.id_estudiante]?.[dia]; // Cambiado a id_estudiante
        console.log(`Estado de ${alumno.nombre} en ${dia}:`, estado); // Imprime el estado
        const emoji = cambiarEstadoAEmoji(estado); // Cambia el estado a emoji
        tdAsistencia.textContent = emoji;
        tr.appendChild(tdAsistencia);

        // Contar asistencias
        if (estado === 'Presente') {
          asistenciasMes++;
          totalesPorAlumno[alumno.nombre].asistencias++;
        } else if (estado === 'Ausente') {
          faltasMes++;
          totalesPorAlumno[alumno.nombre].faltas++;
        } else if (estado === 'Tarde') {
          tardanzasMes++;
          totalesPorAlumno[alumno.nombre].tardanzas++;
        }
      });

      // Totales de asistencias para el mes
      tr.appendChild(createTotalCell(asistenciasMes));
      tr.appendChild(createTotalCell(faltasMes));
      tr.appendChild(createTotalCell(tardanzasMes));

      tbody.appendChild(tr);
    });

    tabla.appendChild(tbody);
    contenedor.appendChild(tabla);
  }

  // Tabla de totales por alumno
  contenedor.appendChild(createTotalTable(totalesPorAlumno));
}


// Modificar el botón "Regresar" en la sección de asistencia
function regresar() {
  restearpartes(); // Reiniciar los valores de asistencia al regresar
  mostrarContenido('Estudiantes'); // Regresar a la sección de estudiantes
}


// Llama a la función mostrarAsistencias cuando sea necesario
mostrarAsistencias();



function createTotalCell(total) {
  const td = document.createElement('td');
  td.textContent = total;
  return td;
}

function createTotalTable(totalesPorAlumno) {
  const tablaTotales = document.createElement('table');
  const theadTotales = document.createElement('thead');
  theadTotales.innerHTML = `
    <tr>
        <th>Nombre del Alumno</th>
        <th>Asistencias Totales</th>
        <th>Faltas Totales</th>
        <th>Tardanzas Totales</th>
    </tr>`;
  tablaTotales.appendChild(theadTotales);

  const tbodyTotales = document.createElement('tbody');
  for (const [nombre, totales] of Object.entries(totalesPorAlumno)) {
    const tr = document.createElement('tr');
    tr.appendChild(createTotalCell(nombre));
    tr.appendChild(createTotalCell(totales.asistencias));
    tr.appendChild(createTotalCell(totales.faltas));
    tr.appendChild(createTotalCell(totales.tardanzas));
    tbodyTotales.appendChild(tr);
  }

  tablaTotales.appendChild(tbodyTotales);
  return tablaTotales;
}



// Mostrar la tabla para el mes seleccionado por defecto
mostrarAsistencias();

function imprimirAsistencias() {
  // Crear un iframe oculto
  let iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';

  document.body.appendChild(iframe);

  // Obtener el contenido que deseas imprimir
  let contenidoImprimir = document.getElementById('contenedorAsistencias').outerHTML;

  // Escribir el contenido dentro del iframe con enlace a CSS de impresión
  let doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <html>
      <head>
        <title>Impresión de Asistencias</title>
        <link rel="stylesheet" href="styles/imprimir.css">
      </head>
      <body>
        ${contenidoImprimir}
      </body>
    </html>
  `);
  doc.close();

  // Esperar un momento para cargar el contenido y luego imprimir
  iframe.contentWindow.focus();
  iframe.contentWindow.print();

  // Eliminar el iframe después de la impresión
  iframe.contentWindow.onafterprint = function () {
    document.body.removeChild(iframe);
  };
}
