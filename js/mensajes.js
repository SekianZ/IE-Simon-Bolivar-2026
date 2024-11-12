function listarmensajes() {
    fetch("backend/opciones.php?accion=listar&tipo=mensajes")
        .then(response => response.json())
        .then(data => {
            const mensajeLista = document.getElementById('mensaje-lista');
            mensajeLista.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos mensajes

            if (data && data.length > 0) {
                const table = document.createElement('table');
                table.classList.add('tabla-mensajes');// Agregar clase 'mensaje-tabla'
                table.innerHTML = `
                    <thead class="mensaje-thead">
                        <tr>
                            <th class="titulo-mensaje">Nombre del Mensaje</th>
                            <th class="plantilla-mensaje">Mensaje</th>
                            <th class="acciones-mensaje">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="mensaje-tbody">
                    </tbody>
                `;
                const tbody = table.querySelector('tbody');
                data.forEach(mensaje => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="editable" data-original="${mensaje.nombreM}">${mensaje.nombreM}</td>
                        <td class="mensaje-realizado" id="mensajetabla" data-original="${mensaje.msgP}">${mensaje.msgP}</td>
                        <td class="columna-boton">
                            
                            <button class="save-btn" data-id="${mensaje.id_mp}" style="display:none;">Guardar</button>
                            <button class="cancel-btn" data-id="${mensaje.id_mp}" style="display:none;">Cancelar</button>
                            <button class="delete-btn" data-id="${mensaje.id_mp}">Eliminar</button>
                        </td>
                    `;
                    tbody.appendChild(row);

                    // Obtener la celda donde está el mensaje
                    const mensajeCelda = row.querySelector('#mensajetabla');

                    // Llamar a actualizarPrevisualizacion con el mensaje actual y la celda de la tabla
                    actualizarPrevisualizacion2(mensaje.msgP, mensajeCelda);
                });
                mensajeLista.appendChild(table);

                addEventListenersToTable();
            }
        })
        .catch(error => console.error('Error al obtener los datos de mensajes:', error));
}

//Funcion que se utiliza en listarmensajes para agregarle funcionalidad a los botones y al formulario de mensajes
function addEventListenersToTable() {
    const table = document.querySelector('#mensaje-lista table');

    if (!table) {
        console.error('La tabla no se encuentra en el DOM.');
        return;
    }

    table.addEventListener('click', function (event) {
        const target = event.target;

        if (target.classList.contains('modify-btn')) {
            const row = target.closest('tr');

            // Hacer las celdas editables
            row.querySelectorAll('.editable').forEach(cell => {
                cell.contentEditable = "true";
                cell.setAttribute('data-original', cell.textContent);
            });

            // Obtener la celda donde está el mensaje
            const mensajeCelda = row.querySelector('#mensajetabla');

            // Llamar a la función para reemplazar "Estudiante" por {estudiante}
            retonarvaloresverdaderos(mensajeCelda.textContent, mensajeCelda);

            // Mostrar/Ocultar botones
            target.style.display = 'none';
            row.querySelector('.save-btn').style.display = 'inline';
            row.querySelector('.cancel-btn').style.display = 'inline';


        } else if (target.classList.contains('save-btn')) {
            const row = target.closest('tr');
            const id = target.getAttribute('data-id');
            const nombre = row.querySelector('td:nth-child(1)').textContent.trim();
            const mensaje = row.querySelector('td:nth-child(2)').textContent.trim();

            const formData = new FormData();
            formData.append('accion', 'actualizar');
            formData.append('tipo', 'mensajes');
            formData.append('datos[id]', id);
            formData.append('datos[nombreM]', nombre);
            formData.append('datos[msgP]', mensaje);

            fetch('backend/opciones.php', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la solicitud: ' + response.statusText);
                    }
                    return response.json();
                })
                .then(result => {
                    if (result.status === 'success') {
                        Swal.fire({
                            icon: "success",
                            title: "Éxito",
                            text: "Actualizado correctamente",
                            allowOutsideClick: false,
                            showConfirmButton: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Redirigir y actualizar la página
                                listarmensajes();
                            }
                        });
                    } else {
                        alert('Error al actualizar el mensaje: ' + result.message);
                    }
                })
                .catch(error => console.error('Error al actualizar el mensaje:', error));

        } else if (target.classList.contains('cancel-btn')) {
            const row = target.closest('tr');
            row.querySelectorAll('.editable').forEach(cell => {
                cell.textContent = cell.getAttribute('data-original'); // Restaurar el valor original
                cell.contentEditable = "false";
            });
            row.querySelector('.modify-btn').style.display = 'inline';
            row.querySelector('.save-btn').style.display = 'none';
            target.style.display = 'none';

        } else if (target.classList.contains('delete-btn')) {
            Swal.fire({
                icon: "warning",
                title: "¿Estás seguro de que deseas eliminar este mensaje?",
                text: "Eliminaras este mensaje para siempre",
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'Cancelar',
                showConfirmButton: true

            }).then((result) => {
                if (result.isConfirmed) {
                    const formData = new FormData();
                    const id = target.getAttribute('data-id');
                    formData.append('accion', 'eliminar');
                    formData.append('tipo', 'mensajes');
                    formData.append('datos[id]', id);

                    fetch('backend/opciones.php', {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => response.json()) // Asegúrate de que el backend está enviando JSON
                        .then(data => {
                            window.location.reload();
                        })
                        .catch(
                            error => console.error('Error al eliminar el mensaje:', error),
                            window.location.reload()

                        );
                }
            });
        }
    });
}
//Listar mensajes
function actualizarPrevisualizacion2(texto, celda) {
    // Obtener el nombre del estudiante para reemplazo
    var nombreEstudiante = "Estudiante";

    // Reemplazar *palabra* por <strong>palabra</strong>
    var textoConFormato = texto.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

    // Reemplazar {estudiante} por el nombre ingresado
    textoConFormato = textoConFormato.replace(/{estudiante}/g, '<strong>' + nombreEstudiante + '</strong>');

    // Insertar el texto formateado en la misma celda
    celda.innerHTML = textoConFormato;
}

//Listar mensajes
function retonarvaloresverdaderos(texto, celda) {
    // Reemplazar *palabra* por <strong>palabra</strong>
    var textoConFormato = texto.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

    // Reemplazar "Estudiante" por {estudiante} para la edición
    textoConFormato = textoConFormato.replace(/Estudiante/g, '{estudiante}');

    // Insertar el texto formateado en la misma celda
    celda.textContent = textoConFormato;
}

// Actualiza la previsualización cuando se edita el textarea

function mensajepredefinido() {
    const selectPredefinido = document.getElementById('mpredefinido');
    const mensajeEditor = document.getElementById('mensaje');
    cargarMensajesPredefinidos(selectPredefinido);

    // Evento cuando se selecciona un mensaje predefinido
    selectPredefinido.addEventListener('change', function () {
        manejarCambioPredefinido(selectPredefinido, mensajeEditor);
    });

    // Evento para actualizar la previsualización cuando se edita el div editable
    mensajeEditor.addEventListener('input', actualizarPrevisualizacion);
}

document.addEventListener('DOMContentLoaded', function () {
    resetEditor();
    // Llamar a la función para llenar el select
    // Inicializa la lista de mensajes al cargar la página
    listarmensajes();

    // Manejar la selección de todos los estudiantes
    manejarSeleccionTodos();

    // Actualiza la lista de opciones en base a los checkboxes seleccionados
    const bloques = document.getElementById('bloques');
    bloques.addEventListener('change', actualizarOpciones);

    const fileInput = document.getElementById('archivo');
    const fileName = document.getElementById('file-name');
    fileInput.addEventListener('change', function () {
        fileName.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : 'No se ha seleccionado ningún archivo';
    });

    // Al cargar la página, gestionar la visualización de secciones
    gestionarSeccion();

    // Correo


    // mensaje predefinido
    mensajepredefinido();
    // Añade un manejador de eventos al select de bloque para actualizar la tabla cuando cambie la opción
    document.getElementById('bloqueasis').addEventListener('change', actualizarDatos);

    document.getElementById('mensaje').addEventListener('input', actualizarPrevisualizacion);
});



// También puedes agregar la función para actualizar la vista previa cuando se cargue la página
window.onload = function () {
    actualizarPrevisualizacion();
};

function registrarmsgp() {
    const nombremensajep = document.getElementById("nombreM").value;
    const mensajep = document.getElementById("mensajeP").innerHTML;

    document.getElementById('btnregistrar').disabled = true;

    // Verificar si los campos están llenos
    if (!nombremensajep || !mensajep) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Por favor completa todos los campos.",
            showConfirmButton: true
        });
        return;
    }

    const formData = new FormData();
    formData.append('accion', 'agregar');
    formData.append('tipo', 'mensajes');
    formData.append('datos[nombreM]', nombremensajep);
    formData.append('datos[msgP]', mensajep);

    fetch('backend/opciones.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: "Datos agregados correctamente",
                allowOutsideClick: false,
                showConfirmButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });

            // Deshabilitar campos después de guardar
            document.querySelectorAll('input[type="text"], input[type="email"]').forEach(function (input) {
                if (input.id !== 'asunto') {
                    input.disabled = true;
                }
            });

            document.querySelectorAll('button[id^="editar-"]').forEach(function (button) {
                button.textContent = 'Editar';
            });

            document.getElementById('guardar').style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);

            // Rehabilitar el botón si ocurre un error
            document.getElementById('btnregistrar').disabled = false;
        });
}